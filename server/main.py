import cv2
import datetime
from flask import Flask, Response, jsonify, request, send_file
from flask_cors import CORS
from pymongo import MongoClient
import base64
from io import BytesIO
from PIL import Image
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from mailjet_rest import Client
import os


AIKEY = "zu-23f971dd13e55bf7d161d94a5d46840b"
api_key = ''
api_secret = ''
from_email = 'observa564@gmail.com' #na safari je api - mailjet







from_name = 'Observa'
to_email = ''
to_name = 'Recipient Name'
subject = 'Motion Detected🚨'
text_content = 'This is a test email sent from Mailjet.'
html_content = '<h3>This is a test email sent from Mailjet.</h3>'


app = Flask(__name__)
CORS(app)

video_captures = {}

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces
motion_collection = db.detected_motion
recordings_collection = db.recordings_collection  
users_collection = db.users 

# Users data
users = [
    {
        "name": "User1",
        "email": "user1@example.com",
        "password": generate_password_hash("password1", method='pbkdf2:sha256'),
        "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
        "cameras": [
            {"name": "User1_Camera1", "address": "https://192.168.8.176:8080/video"},
            {"name": "User1_Camera2", "address": "https://192.168.8.177:8080/video"}
        ]
    },
    {
        "name": "User2",
        "email": "user2@example.com",
        "password": generate_password_hash("password2", method='pbkdf2:sha256'),
        "avatar": "https://randomuser.me/api/portraits/women/2.jpg",
        "cameras": [
            {"name": "User2_Camera1", "address": "https://192.168.8.178:8080/video"},
            {"name": "User2_Camera2", "address": "https://192.168.8.179:8080/video"}
        ]
    }
]

# Insert users into the database
users_collection.insert_many(users)

def init_video_captures(user_id):
    global video_captures
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return False

    video_captures[user_id] = {}
    for camera in user.get("cameras", []):
        video_capture = cv2.VideoCapture(camera["address"], cv2.CAP_FFMPEG)
        if not video_capture.isOpened():
            print(f"Failed to open video capture for {camera['address']}")
            continue
        video_capture.set(cv2.CAP_PROP_FPS, 28) 
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[user_id][camera["address"]] = {"capture": video_capture, "frame_size": frame_size}
        
    return True

def generate_frames(user_id, camera_address):
    global video_captures
    is_recording = False
    recording_start_time = None
    SECONDS_TO_RECORD = 3
    video_capture = video_captures[user_id][camera_address]["capture"]
    frame_size = video_captures[user_id][camera_address]["frame_size"]

    last_frame = None 
    face_counter = 0  

    while True:
        success, frame = video_capture.read()
        if not success:
            print(f"Failed to capture frame from {camera_address}")
            break
        else:
            current_datetime = datetime.datetime.now()

            grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(grayscale_frame, 1.3, 5)

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)  
                face_counter += 1
                if face_counter % 3 == 0:  
                    face_image = frame[y:y+h, x:x+w]
                    _, buffer = cv2.imencode('.jpg', face_image)
                    face_image_data = base64.b64encode(buffer).decode('utf-8')
                    faces_collection.insert_one({
                        "camera_address": camera_address,
                        "timestamp": current_datetime,
                        "user_id": user_id,
                        "image_data": face_image_data
                    })

            # Motion Detection
            if last_frame is None:
                last_frame = grayscale_frame
                continue

            frame_diff = cv2.absdiff(last_frame, grayscale_frame)
            _, threshold_frame = cv2.threshold(frame_diff, 30, 255, cv2.THRESH_BINARY)
            dilated_frame = cv2.dilate(threshold_frame, None, iterations=2)
            contours, _ = cv2.findContours(dilated_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            for contour in contours:
                if cv2.contourArea(contour) < 400000:
                    continue
                (x, y, w, h) = cv2.boundingRect(contour)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                motion_image = frame[y:y+h, x:x+w]
                _, buffer = cv2.imencode('.jpg', motion_image)
                motion_image_data = base64.b64encode(buffer).decode('utf-8')
                
                # Send email with motion detection
                try:
                    camera_name = next((camera["name"] for camera in users_collection.find_one({"_id": ObjectId(user_id)})["cameras"] if camera["address"] == camera_address), "Unknown Camera")
                    send_motion_email(user_id, camera_name, current_datetime, motion_image_data)
                except Exception as e:
                    print(f"Error sending email: {e}")

                motion_collection.insert_one({
                    "camera_address": camera_address,
                    "timestamp": current_datetime,
                    "user_id": user_id,  
                    "image_data": motion_image_data
                })

            last_frame = grayscale_frame 

            if not is_recording:
                is_recording = True
                recording_start_time = datetime.datetime.now()

            if (datetime.datetime.now() - recording_start_time).total_seconds() >= SECONDS_TO_RECORD:
                is_recording = False

            ret, buffer = cv2.imencode('.jpg', frame)
            frame_data_base64 = base64.b64encode(buffer).decode('utf-8')
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')



@app.route('/camera/<user_id>/<int:camera_id>')
def index(user_id, camera_id):
    if not init_video_captures(user_id):
        return "User not found", 404
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or camera_id < 0 or camera_id >= len(user["cameras"]):
        return "Camera not found", 404
    return Response(generate_frames(user_id, user["cameras"][camera_id]["address"]), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/add_camera', methods=['POST'])
def add_camera():
    user_id = request.json.get('user_id')
    name = request.json.get('name')
    address = request.json.get('address')
    if user_id and name and address:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            new_camera = {"name": name, "address": address}
            users_collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"cameras": new_camera}})
            return jsonify({"message": "Camera added successfully"}), 201
    return jsonify({"message": "Invalid user_id, name or address"}), 400

@app.route('/api/remove_camera', methods=['POST'])
def remove_camera():
    user_id = request.json.get('user_id')
    address = request.json.get('address')
    if user_id and address:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            users_collection.update_one({"_id": ObjectId(user_id)}, {"$pull": {"cameras": {"address": address}}})
            if address in video_captures.get(user_id, {}):
                video_captures[user_id][address]["capture"].release()
                del video_captures[user_id][address]
            return jsonify({"message": "Camera removed successfully"}), 200
    return jsonify({"message": "Camera not found"}), 404

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    user_id = request.args.get('user_id')
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        return jsonify(user.get("cameras", []))
    return jsonify({"message": "User not found"}), 404

@app.route('/api/recordings', methods=['GET'])
def get_recordings():
    user_id = request.args.get('user_id')
    camera_address = request.args.get('camera_address')
    if not user_id or not camera_address:
        return jsonify({"message": "user_id and camera_address parameters are required"}), 400

    recordings = recordings_collection.find({"user_id": user_id, "camera_address": camera_address}).sort("timestamp", 1)
    frames = []

    for recording in recordings:
        frames.append({
            "id": str(recording["_id"]),
            "frame_data_base64": recording["frame_data_base64"]
        })

    return jsonify(frames), 200

@app.route('/api/images', methods=['GET'])
def get_images():
    user_id = request.args.get('user_id')
    faces = faces_collection.find({"user_id": user_id}).sort("timestamp", -1)
    image_list = []
    for face in faces:
        image_list.append({
            "id": str(face["_id"]),
            "image_data": face["image_data"]
        })
    return jsonify(image_list), 200


@app.route('/display_image/<string:document_id>')
def display_image(document_id):
    document = faces_collection.find_one({'_id': ObjectId(document_id)})
    if document is None:
        return jsonify({"message": "Document not found"}), 404

    image_data_base64 = document['image_data']
    image_data_binary = base64.b64decode(image_data_base64)
    image = Image.open(BytesIO(image_data_binary))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    buffered.seek(0)
    return send_file(buffered, mimetype='image/jpeg')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if users_collection.find_one({'email': email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    new_user = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'cameras': [],
        'email_subscribers': [email],  
        'phone_subscribers': [],
        'avatar': 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'
    }

    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid email or password"}), 400

 
    user_data = {
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "avatar": user.get("avatar", ""),
        "cameras": user.get("cameras", []),
        "email_subscribers": user.get("email_subscribers", [email]),
        "phone_subscribers": user.get("phone_subscribers", [])
    }

    if email not in user_data["email_subscribers"]:
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$addToSet": {"email_subscribers": email}}
        )
        user_data["email_subscribers"].append(email)

    return jsonify(user_data), 200

@app.route('/api/add_email_subscriber', methods=['POST'])
def add_email_subscriber():
    data = request.get_json()
    user_id = data.get('user_id')
    email_subscriber = data.get('email_subscriber')

    if not user_id or not email_subscriber:
        return jsonify({"message": "user_id and email_subscriber are required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"email_subscribers": email_subscriber}}
    )

    return jsonify({"message": "Email subscriber added successfully"}), 200

@app.route('/api/add_phone_subscriber', methods=['POST'])
def add_phone_subscriber():
    data = request.get_json()
    user_id = data.get('user_id')
    phone_subscriber = data.get('phone_subscriber')

    if not user_id or not phone_subscriber:
        return jsonify({"message": "user_id and phone_subscriber are required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"phone_subscribers": phone_subscriber}}
    )

    return jsonify({"message": "Phone subscriber added successfully"}), 200

@app.route('/api/update_profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    email = data.get('email')
    avatar = data.get('avatar')

    if not user_id or not name or not email:
        return jsonify({"message": "user_id, name, and email are required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    update_fields = {
        "name": name,
        "email": email,
    }
    if avatar:
        update_fields["avatar"] = avatar

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    user_data = {
        "user_id": str(updated_user["_id"]),
        "name": updated_user["name"],
        "email": updated_user["email"],
        "avatar": updated_user.get("avatar", "")
    }

    return jsonify(user_data), 200

@app.route('/api/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or not check_password_hash(user['password'], current_password):
        return jsonify({"message": "Invalid current password"}), 400

    hashed_new_password = generate_password_hash(new_password, method='pbkdf2:sha256')
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_new_password}}
    )

    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/api/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    user_id = data.get('user_id')

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    users_collection.delete_one({"_id": ObjectId(user_id)})
    faces_collection.delete_many({"user_id": user_id})
    recordings_collection.delete_many({"user_id": user_id})

    return jsonify({"message": "Account deleted successfully"}), 200

@app.route('/api/motion_images', methods=['GET'])
def get_motion_images():
    user_id = request.args.get('user_id')
    motions = motion_collection.find({"user_id": user_id}).sort("timestamp", -1)
    image_list = []
    for motion in motions:
        image_list.append({
            "id": str(motion["_id"]),
            "image_data": motion["image_data"]
        })
    return jsonify(image_list), 200




@app.route('/api/user_faces/<string:user_id>', methods=['GET'])
def get_user_faces(user_id):
    faces = faces_collection.find({'user_id': user_id}).sort("timestamp", -1)
    image_list = []
    for face in faces:
        image_list.append({
            "id": str(face["_id"]),
            "image_data": face["image_data"]
        })
    return jsonify(image_list), 200

@app.route('/api/delete_motion_image', methods=['DELETE'])
def delete_motion_image():
    data = request.get_json()
    image_id = data.get('image_id')
    user_id = data.get('user_id')

    if not image_id or not user_id:
        return jsonify({"message": "image_id and user_id are required"}), 400

    result = motion_collection.delete_one({"_id": ObjectId(image_id), "user_id": user_id})

    if result.deleted_count == 1:
        return jsonify({"message": "Image deleted successfully"}), 200
    else:
        return jsonify({"message": "Image not found"}), 404
    
@app.route('/api/delete_face_image', methods=['DELETE'])
def delete_face_image():
    data = request.get_json()
    image_id = data.get('image_id')
    user_id = data.get('user_id')

    if not image_id or not user_id:
        return jsonify({"message": "image_id and user_id are required"}), 400

    result = faces_collection.delete_one({"_id": ObjectId(image_id), "user_id": user_id})

    if result.deleted_count == 1:
        return jsonify({"message": "Image deleted successfully"}), 200
    else:
        return jsonify({"message": "Image not found"}), 404



@app.route('/api/chat', methods=['GET', 'POST'])
def chat():
    data = request.json
    question = data.get('question')

    client = OpenAI(
        api_key=AIKEY,
        base_url="https://zukijourney.xyzbot.net/v1"
    )

    chat_completion = client.chat.completions.create(
        stream=False,
        model="mistral-medium",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "user",
                "content": f"{question}",
            },
        ],
    )

    response_data = chat_completion.json()
    print("API Response:", response_data)  
    return jsonify(response_data)


def send_email(api_key, api_secret, from_email, from_name, to_email, to_name, subject, text_content, html_content):
    # Initialize the Mailjet client
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')
    
    # Define the email data
    data = {
        'Messages': [
            {
                "From": {
                    "Email": from_email,
                    "Name": from_name
                },
                "To": [
                    {
                        "Email": to_email,
                        "Name": to_name
                    }
                ],
                "Subject": subject,
                "TextPart": text_content,
                "HTMLPart": html_content
            }
        ]
    }
    
    # Send the email
    result = mailjet.send.create(data=data)
    
    # Check the result
    if result.status_code == 200:
        print("Email sent successfully!")
    else:
        print(f"Failed to send email. Status code: {result.status_code}")
        print(result.json())

def send_motion_email(user_id, camera_name, timestamp, motion_image_data):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        print("User not found")
        return

    subject = f"Motion detected at {camera_name}"
    text_content = f"Motion was detected at {camera_name} on {timestamp}."
    html_content = f"""
        <h3>Motion detected at {camera_name}</h3>
        <p>Motion was detected on {timestamp}.</p>
        <img src="data:image/jpeg;base64,{motion_image_data}" alt="Motion Image" />
    """

    for subscriber in user.get("email_subscribers", []):
        send_email(api_key, api_secret, from_email, from_name, subscriber, "Subscriber", subject, text_content, html_content)





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
