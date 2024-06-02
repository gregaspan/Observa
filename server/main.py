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

app = Flask(__name__)
CORS(app)

video_captures = {}

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces
recordings_collection = db.recordings_collection  
users_collection = db.users 

# Users data
users = [
    {
        "name": "User1",
        "email": "user1@example.com",
        "password": generate_password_hash("password1", method='pbkdf2:sha256'),
        "cameras": [
            {"name": "User1_Camera1", "address": "https://192.168.8.176:8080/video"},
            {"name": "User1_Camera2", "address": "https://192.168.8.177:8080/video"}
        ]
    },
    {
        "name": "User2",
        "email": "user2@example.com",
        "password": generate_password_hash("password2", method='pbkdf2:sha256'),
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

    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            current_datetime = datetime.datetime.now()

            grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(grayscale_frame, 1.3, 5)

            # Save detected face
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                face_image = frame[y:y+h, x:x+w]
                _, buffer = cv2.imencode('.jpg', face_image)
                face_image_data = base64.b64encode(buffer).decode('utf-8')
                faces_collection.insert_one({
                    "user_id": user_id,
                    "camera_address": camera_address,
                    "timestamp": current_datetime,
                    "image_data": face_image_data
                })

            if not is_recording:
                is_recording = True
                recording_start_time = datetime.datetime.now()

            if (datetime.datetime.now() - recording_start_time).total_seconds() >= SECONDS_TO_RECORD:
                is_recording = False

            ret, buffer = cv2.imencode('.jpg', frame)
            frame_data_base64 = base64.b64encode(buffer).decode('utf-8')
            
            recordings_collection.insert_one({
                "user_id": user_id,
                "camera_address": camera_address,
                "timestamp": current_datetime,
                "frame_data_base64": frame_data_base64
            })

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
    if not user_id:
        return jsonify({"message": "user_id parameter is required"}), 400

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
        'cameras': []
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

    # Include all relevant user data
    user_data = {
        "message": "Login successful",
        "user_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "cameras": user.get("cameras", [])
    }

    return jsonify(user_data), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
