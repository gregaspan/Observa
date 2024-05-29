import cv2
import datetime
from flask import Flask, Response, jsonify, request
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

video_captures = {}
cameras = [{"name": "Camera 1", "address": "https://164.8.113.108:8080/video"}]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_fullbody.xml")

if not os.path.exists("detected_faces"):
    os.makedirs("detected_faces")
if not os.path.exists("recordings"):
    os.makedirs("recordings")

def init_video_captures():
    global video_captures
    for camera in cameras:
        address = camera["address"]
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
                cv2.imwrite(f"detected_faces/face_{current_datetime}.jpg", face_image)

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
    if camera_id < 0 or camera_id >= len(cameras):
        return "Camera not found", 404
    return Response(generate_frames(cameras[camera_id]["address"]), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/add_camera', methods=['POST'])
def add_camera():
    data = request.json
    name = data.get('name')
    address = data.get('address')
    if name and address:
        cameras.append({"name": name, "address": address})
        video_capture = cv2.VideoCapture(address)
        video_capture.set(cv2.CAP_PROP_FPS, 28)
        frame_size = (int(video_capture.get(3)), int(video_capture.get(4)))
        video_captures[address] = {"capture": video_capture, "frame_size": frame_size}
        return jsonify({"message": "Camera added successfully"}), 201
    return jsonify({"message": "Invalid name or address"}), 400

@app.route('/api/remove_camera', methods=['POST'])
def remove_camera():
    address = request.json.get('address')
    camera_to_remove = next((camera for camera in cameras if camera["address"] == address), None)
    if camera_to_remove:
        cameras.remove(camera_to_remove)
        video_captures[address]["capture"].release()
        del video_captures[address]
        return jsonify({"message": "Camera removed successfully"}), 200
    return jsonify({"message": "Camera not found"}), 404

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    return jsonify(cameras)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Letsgo."})


# OAUTH + BAZA ---------------------------------------------------------------------------------------------------------------------


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969, debug=True)
