import cv2
import datetime
from flask import Flask, Response, jsonify, request
import os
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
camera_addresses = ["https://192.168.8.176:8080/video"]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces
recordings_collection = db.recordings_collection  
users_collection = db.users 


def init_video_captures():
    global video_captures
    for address in camera_addresses:
        video_capture = cv2.VideoCapture(address, cv2.CAP_FFMPEG)
        video_capture.set(cv2.CAP_PROP_FPS, 28) 
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[user_id][camera["address"]] = {"capture": video_capture, "frame_size": frame_size}
    return True

def generate_frames(user_id, camera_address):
    global video_captures
    is_recording = False
    video_writer = None
    recording_start_time = None
    SECONDS_TO_RECORD = 3
    video_capture = video_captures[camera_address]["capture"]
    frame_size = video_captures[camera_address]["frame_size"]

    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(grayscale_frame, 1.3, 5)
            bodies = body_cascade.detectMultiScale(grayscale_frame, 1.3, 5)

            #shrani zaznan obraz
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                face_image = frame[y:y+h, x:x+w]
                _, buffer = cv2.imencode('.jpg', face_image)
                face_image_data = base64.b64encode(buffer).decode('utf-8')
                faces_collection.insert_one({
                    "camera_address": camera_address,
                    "timestamp": current_datetime,
                    "image_data": face_image_data
                })

                if not is_recording:
                    is_recording = True
                    recording_start_time = datetime.datetime.now()
                    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
                    video_writer = cv2.VideoWriter(f"recordings/recording_{current_datetime}.mp4", fourcc, 28.0, frame_size)

            for (x, y, w, h) in bodies:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            if is_recording:
                video_writer.write(frame)
                if (datetime.datetime.now() - recording_start_time).total_seconds() >= SECONDS_TO_RECORD:
                    is_recording = False
                    video_writer.release()

            ret, buffer = cv2.imencode('.jpg', frame)
            frame_data_base64 = base64.b64encode(buffer).decode('utf-8')
            
            recordings_collection.insert_one({
                "camera_address": camera_address,
                "timestamp": current_datetime,
                "frame_data_base64": frame_data_base64
            })

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/camera/<int:camera_id>')
def index(camera_id):
    if camera_id < 0 or camera_id >= len(camera_addresses):
        return "Camera not found", 404
    return Response(generate_frames(camera_addresses[camera_id]), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/add_camera', methods=['POST'])
def add_camera():
    address = request.json.get('address')
    if address:
        camera_addresses.append(address)
        video_capture = cv2.VideoCapture(address, cv2.CAP_FFMPEG)
        video_capture.set(cv2.CAP_PROP_FPS, 28) 
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[address] = {"capture": video_capture, "frame_size": frame_size}
        return jsonify({"message": "Camera added successfully"}), 201
    return jsonify({"message": "Invalid address"}), 400

@app.route('/api/remove_camera', methods=['POST'])
def remove_camera():
    user_id = request.json.get('user_id')
    address = request.json.get('address')
    if address in camera_addresses:
        camera_addresses.remove(address)
        video_captures[address]["capture"].release()
        del video_captures[address]
        return jsonify({"message": "Camera removed successfully"}), 200
    return jsonify({"message": "Camera not found"}), 404

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    return jsonify(camera_addresses)

@app.route('/api/recordings', methods=['GET'])
def get_recordings():
    camera_address = request.args.get('camera_address')
    if not camera_address:
        return jsonify({"message": "camera_address parameter is required"}), 400

    recordings = recordings_collection.find({"camera_address": camera_address}).sort("timestamp", 1)
    frames = []

    for recording in recordings:
        frames.append({
            "id": str(recording["_id"]),
            "frame_data_base64": recording["frame_data_base64"]
        })

    return jsonify(frames), 200

@app.route('/api/images', methods=['GET'])
def get_images():
    faces = faces_collection.find().sort("timestamp", -1)  
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
    # Get the JSON data from the request
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    
    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password using PBKDF2
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    # Create new user
    new_user = {
        'name': name,
        'email': email,
        'password': hashed_password
    }

    # Insert the user into the database
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    # Get the JSON data from the request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid email or password"}), 400

    return jsonify({"message": "Login successful"}), 200
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
