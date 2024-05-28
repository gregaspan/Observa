import cv2
import datetime
from flask import Flask, Response, jsonify, request, send_file
from flask_cors import CORS
from pymongo import MongoClient
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

video_captures = {}
camera_addresses = ["https://192.168.8.176:8080/video"]

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces
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
    SECONDS_TO_RECORD = 10  
    video_capture = video_captures[camera_address]["capture"]
    frame_size = video_captures[camera_address]["frame_size"]

    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            current_datetime = datetime.datetime.now()

            grayscale_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            if not is_recording:
                is_recording = True
                recording_start_time = datetime.datetime.now()

            if (datetime.datetime.now() - recording_start_time).total_seconds() >= SECONDS_TO_RECORD:
                is_recording = False

            ret, buffer = cv2.imencode('.jpg', frame)
            frame_data_base64 = base64.b64encode(buffer).decode('utf-8')
            
            # Store frame data in MongoDB
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
        frame_data_base64 = recording["frame_data_base64"]
        frame_data_binary = base64.b64decode(frame_data_base64)
        frames.append(frame_data_binary)

    def generate():
        for frame in frames:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
