import cv2
import datetime
from flask import Flask, Response, jsonify, request, send_file
from flask_cors import CORS
from pymongo import MongoClient
import base64
from io import BytesIO
from PIL import Image
from bson import ObjectId

app = Flask(__name__)
CORS(app)

video_captures = {}
camera_addresses = ["https://164.8.113.108:8080/video"]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces
motion_collection = db.detected_motion
recordings_collection = db.recordings_collection  

def init_video_captures():
    global video_captures
    for address in camera_addresses:
        video_capture = cv2.VideoCapture(address, cv2.CAP_FFMPEG)
        video_capture.set(cv2.CAP_PROP_FPS, 28) 
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[address] = {"capture": video_capture, "frame_size": frame_size}

init_video_captures()

def generate_frames(camera_address):
    global video_captures
    is_recording = False
    recording_start_time = None
    SECONDS_TO_RECORD = 3
    video_capture = video_captures[camera_address]["capture"]
    frame_size = video_captures[camera_address]["frame_size"]
    last_frame = None

    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            current_datetime = datetime.datetime.now()
            grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            #Face Detection
            faces = face_cascade.detectMultiScale(grayscale_frame, 1.3, 5)
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

            #Motion Detection
            if last_frame is None:
                last_frame = grayscale_frame
                continue

            frame_diff = cv2.absdiff(last_frame, grayscale_frame)
            _, threshold_frame = cv2.threshold(frame_diff, 30, 255, cv2.THRESH_BINARY)
            dilated_frame = cv2.dilate(threshold_frame, None, iterations=2)
            contours, _ = cv2.findContours(dilated_frame, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            for contour in contours:
                if cv2.contourArea(contour) < 100000:
                    continue
                (x, y, w, h) = cv2.boundingRect(contour)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                motion_image = frame[y:y+h, x:x+w]
                _, buffer = cv2.imencode('.jpg', motion_image)
                motion_image_data = base64.b64encode(buffer).decode('utf-8')
                motion_collection.insert_one({
                    "camera_address": camera_address,
                    "timestamp": current_datetime,
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

            recordings_collection.insert_one({
                "camera_address": camera_address,
                "timestamp": current_datetime,
                "frame_data_base64": frame_data_base64
            })

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

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

@app.route('/api/motion_images', methods=['GET'])
def get_motion_images():
    motions = motion_collection.find().sort("timestamp", -1)
    image_list = []
    for motion in motions:
        image_list.append({
            "id": str(motion["_id"]),
            "image_data": motion["image_data"]
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
