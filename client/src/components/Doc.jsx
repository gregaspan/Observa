import React from 'react';

const CameraSetupTutorial = () => {
  return (
    <div className="divide-y divide-gray-200">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            How to Setup Camera
          </h2>
        </div>
      </div>

      {/* Selfhosted Version */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Selfhosted Version
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            You need to be connected to the same Wi-Fi network (Camera and Observa app)!!
          </p>
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">Android phone</h2>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">1. Download and Install IP Webcam</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Scan the QR code below to download IP Webcam. The download will start automatically.
          </p>
          <div className="mt-2">
            <img src="path/to/qr-code.png" alt="QR Code to download IP Webcam" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">2. Open IP Webcam App</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Open the IP Webcam app that you downloaded in the previous step.
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">3. Configure IP Webcam</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Configure your desired settings (resolution, quality, etc.).
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">4. Start Server</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Scroll to the bottom and tap on "Start server".
          </p>
          <div className="mt-2">
            <img src="path/to/start-server-image.png" alt="Start Server" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">Observa app</h3>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">5. Go into Dashboard Tab</h3>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">6. Type Your Camera Name</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the name for your camera (we recommend that you name it after the room in which it is located).
          </p>
          <div className="mt-2">
            <img src="path/to/camera-name-image.png" alt="Type Camera Name" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">7. Type Camera Address</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080/video).
          </p>
          <div className="mt-2">
            <img src="path/to/camera-address-image.png" alt="Type Camera Address" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">8. Click "Add camera" button</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.
          </p>
          <div className="mt-2">
            <img src="path/to/camera-address-image.png" alt="Type Camera Address" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">9. Remove Camera</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use the "Remove" button to delete the camera from the list.
          </p>
          <div className="mt-2">
            <img src="path/to/camera-address-image.png" alt="Type Camera Address" className="w-full rounded-md"/>
          </div>
        </div>
      </div>

      {/* Paid Version */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Paid Version
          </h2>
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">Android phone</h2>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">1. Download and Install IP Webcam</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Scan the QR code below to download IP Webcam. The download will start automatically.
          </p>
          <div className="mt-2">
            <img src="path/to/qr-code.png" alt="QR Code to download IP Webcam" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">2. Open IP Webcam App</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Open the IP Webcam app that you downloaded in the previous step.
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">3. Click Cloud Streaming Option</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Click on the "Cloud streaming" option in the IP Webcam app.
          </p>
          <div className="mt-2">
            <img src="path/to/cloud-streaming-image.png" alt="Cloud Streaming Option" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">Observa app</h3>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">4. Go into Dashboard Tab</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Navigate to the Dashboard tab in the IP Webcam app.
          </p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">5. Type Your Camera Name</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the name for your camera (we recommend that you name it after the room in which it is located).
          </p>
          <div className="mt-2">
            <img src="path/to/camera-name-image.png" alt="Type Camera Name" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">6. Type Camera Address</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).
          </p>
          <div className="mt-2">
            <img src="path/to/camera-address-image.png" alt="Type Camera Address" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">7. Click "Add camera" button</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.
          </p>
          <div className="mt-2">
            <img src="path/to/camera-name-image.png" alt="Type Camera Name" className="w-full rounded-md"/>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-base font-semibold leading-7 text-gray-900">8. Remove Camera</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use the "Remove" button to delete the camera from the list.
          </p>
          <div className="mt-2">
            <img src="path/to/camera-name-image.png" alt="Type Camera Name" className="w-full rounded-md"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraSetupTutorial;
