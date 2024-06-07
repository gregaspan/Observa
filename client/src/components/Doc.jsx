import React from 'react';

const CameraSetupTutorial = () => {
  return (
    <div className="tutorial-container">
      <h1>How to Setup Camera</h1>

      {/* Selfhosted Version */}
      <section className="section">
        <h1>Selfhosted Version</h1>
        <h3>You need to be connected to the same Wi-Fi network (Camera and Observa app)!!</h3>
        <h2>Android phone</h2>
        <h2>1. Download and Install IP Webcam</h2>
        <p>Scan the QR code below to download IP Webcam. The download will start automatically.</p>
        <div className="qr-code-placeholder">
          <img src="path/to/qr-code.png" alt="QR Code to download IP Webcam" />
        </div>
      </section>

      <section className="section">
        <h2>2. Open IP Webcam App</h2>
        <p>Open the IP Webcam app that you downloaded in the previous step.</p>
      </section>

      <section className="section">
        <h2>3. Configure IP Webcam</h2>
        <p>Configure your desired settings (resolution, quality, etc.).</p>
      </section>

      <section className="section">
        <h2>4. Start Server</h2>
        <p>Scroll to the bottom and tap on "Start server".</p>
        <div className="image-placeholder">
          <img src="path/to/start-server-image.png" alt="Start Server" />
        </div>
      </section>

<br /><br />
      <section className="section">
        <h2>Observa app</h2>
        <h2>5. Go into Dashboard Tab</h2>
      </section>

      <section className="section">
        <h2>6. Type Your Camera Name</h2>
        <p>Enter the name for your camera (we recommend that you name it after the room in which it is located).</p>
        <div className="image-placeholder">
          <img src="path/to/camera-name-image.png" alt="Type Camera Name" />
        </div>
      </section>

      <section className="section">
        <h2>7. Type Camera Address</h2>
        <p>Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).</p>
        <div className="image-placeholder">
          <img src="path/to/camera-address-image.png" alt="Type Camera Address" />
        </div>
      </section>

      <section className="section">
        <h2>8. Click "Add camera" button</h2>
        <p>Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.</p>
        <div className="image-placeholder">
          <img src="path/to/camera-address-image.png" alt="Type Camera Address" />
        </div>
      </section>

      <section className="section">
        <h2>9. Remove Camera</h2>
        <p>Use the "Remove" button to delete the camera from the list.</p>
        <div className="image-placeholder">
          <img src="path/to/camera-address-image.png" alt="Type Camera Address" />
        </div>
      </section>

      <br /><br /><br /><br />

      {/* Paid Version */}
      <section className="section">
        <h1>Paid Version</h1>
        <h2>Android phone</h2>
        <h2>1. Download and Install IP Webcam</h2>
        <p>Scan the QR code below to download IP Webcam. The download will start automatically.</p>
        <div className="qr-code-placeholder">
          <img src="path/to/qr-code.png" alt="QR Code to download IP Webcam" />
        </div>
      </section>

      <section className="section">
        <h2>2. Open IP Webcam App</h2>
        <p>Open the IP Webcam app that you downloaded in the previous step.</p>
      </section>

      <section className="section">
        <h2>3. Click Cloud Streaming Option</h2>
        <p>Click on the "Cloud streaming" option in the IP Webcam app.</p>
        <div className="image-placeholder">
          <img src="path/to/cloud-streaming-image.png" alt="Cloud Streaming Option" />
        </div>
      </section>
<br /><br /><br />
      <section className="section">
      <h2>Observa app</h2>
        <h2>4. Go into Dashboard Tab</h2>
        <p>Navigate to the Dashboard tab in the IP Webcam app.</p>
      </section>

      <section className="section">
        <h2>6. Type Your Camera Name</h2>
        <p>Enter the name for your camera (we recommend that you name it after the room in which it is located).</p>
        <div className="image-placeholder">
          <img src="path/to/camera-name-image.png" alt="Type Camera Name" />
        </div>
      </section>

      <section className="section">
        <h2>7. Type Camera Address</h2>
        <p>Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).</p>
        <div className="image-placeholder">
          <img src="path/to/camera-address-image.png" alt="Type Camera Address" />
        </div>
      </section>

      <section className="section">
        <h2>8. Click "Add camera" button</h2>
        <p>Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.</p>
        <div className="image-placeholder">
          <img src="path/to/camera-name-image.png" alt="Type Camera Name" />
        </div>
      </section>

      <section className="section">
        <h2>9. Remove Camera</h2>
        <p>Use the "Remove" button to delete the camera from the list.</p>
        <div className="image-placeholder">
          <img src="path/to/camera-name-image.png" alt="Type Camera Name" />
        </div>
        </section>
    </div>
  );
};

export default CameraSetupTutorial;
