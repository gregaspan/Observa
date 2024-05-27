from flask import Flask, Response, jsonify, request, send_file
from bson import ObjectId
from pymongo import MongoClient
import base64
from PIL import Image
from io import BytesIO
import cv2
import datetime

app = Flask(__name__)

client = MongoClient('mongodb+srv://admin:adminadmin@cluster0.4v8pcrv.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0')
db = client.video_surveillance
faces_collection = db.detected_faces

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

video_captures = {}
camera_addresses = ["https://164.8.113.108:8080/video"]

def init_video_captures():
    global video_captures
    for address in camera_addresses:
        video_capture = cv2.VideoCapture(address)
        video_capture.set(cv2.CAP_PROP_FPS, 28) 
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[address] = {"capture": video_capture, "frame_size": frame_size}

init_video_captures()

def generate_frames(camera_address):
    global video_captures
    is_recording = False
    video_writer = None
    recording_start_time = None
    SECONDS_TO_RECORD = 10  
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

            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
                face_image = frame[y:y+h, x:x+w]
                _, buffer = cv2.imencode('.jpg', face_image)
                face_image_data = base64.b64encode(buffer).decode('utf-8')
                faces_collection.insert_one({
                    "timestamp": datetime.datetime.now(),
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
            frame = buffer.tobytes()

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
        video_capture = cv2.VideoCapture(address)
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

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Letsgo."})

@app.route('/display_image/<string:document_id>')
def display_image(document_id):

    document = faces_collection.find_one({'_id': ObjectId(document_id)})
    if document is None:
        return jsonify({"message": "Document not found"}), 404

    image_data_base64 = document['image_data']

    #decode base64 string to binary data
    image_data_binary = base64.b64decode(image_data_base64)

    #convert binary data to image
    image = Image.open(BytesIO(image_data_binary))

    #display the image
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f'<img src="data:image/jpeg;base64,{img_str}">'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)