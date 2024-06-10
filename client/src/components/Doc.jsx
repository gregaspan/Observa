import React, { useState } from 'react';
import ObservaQR from '../img/ObservaQR.png'; // Adjust the path accordingly



const CameraSetupTutorial = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="divide-y divide-gray-200">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            How to Setup Camera
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
          Step-by-step installation guide how to set up camera.
          </p>
        </div>
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-6 gap-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="md:col-span-2">
          <h2
            className="text-lg font-semibold leading-7 text-gray-900 cursor-pointer"
            onClick={() => toggleSection('selfhosted')}
          >
            Selfhosted Version
          </h2>
          {openSection === 'selfhosted' && (
            <div className="mt-4">
               <p className="mt-1 text-sm leading-6 text-gray-600">
               You need to be connected to the same Wi-Fi network (Camera and Observa app)!!
          </p>
        
              <br />
              <h3 className="text-base font-semibold leading-7 text-gray-900 mt-6">Android phone</h3>
              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-2">1. Download and Install IP Webcam</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Scan the QR code below to download IP Webcam. The download will start automatically.</p>
              <div className="mt-2">
              <img src={ObservaQR} alt="QR Code to download IP Webcam" className="w-full rounded-md" style={{ width: '200px', height: '240px' }} />


              </div>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">2. Open IP Webcam App</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Open the IP Webcam app that you downloaded in the previous step.</p>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">3. Configure IP Webcam</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Configure your desired settings (resolution, quality, etc.).</p>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">4. Start Server</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Scroll to the bottom and tap on "Start server".</p>
             <br /><br />

              <h3 className="text-lg font-semibold leading-7 text-gray-900 mt-6">Observa app</h3>
              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-2">5. Go into Dashboard Tab</h4>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">6. Type Your Camera Name</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Enter the name for your camera (we recommend that you name it after the room in which it is located).</p>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">7. Type Camera Address</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).</p>
              

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">8. Click "Add camera" button</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.</p>
              

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">9. Remove Camera</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Use the "Remove" button to delete the camera from the list.</p>
          
            </div>
          )}

          <h2
            className="text-lg font-semibold leading-7 text-gray-900 cursor-pointer mt-6"
            onClick={() => toggleSection('paid')}
          >
            Paid Version
          </h2>
          {openSection === 'paid' && (
            <div className="mt-4">
              <br />
              <h3 className="text-base font-semibold leading-7 text-gray-900">Android phone</h3>
              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-2">1. Download and Install IP Webcam</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Scan the QR code below to download IP Webcam. The download will start automatically.</p>
              <div className="mt-2">
              <img src={ObservaQR} alt="QR Code to download IP Webcam" className="w-full rounded-md" style={{ width: '200px', height: '240px' }} />
              </div>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">2. Open IP Webcam App</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Open the IP Webcam app that you downloaded in the previous step.</p>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">3. Click Cloud Streaming Option</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Click on the "Cloud streaming" option in the IP Webcam app.</p>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">4. Start server</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Scroll to the bottom and tap on "Start server".</p>
<br /><br />
              <h3 className="text-lg font-semibold leading-7 text-gray-900 mt-6">Observa app</h3>
              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-2">5. Go into Dashboard Tab</h4>

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">6. Type Your Camera Name</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Enter the name for your camera (we recommend that you name it after the room in which it is located).</p>
            

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">7. Type Camera Address</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).</p>
             

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">8. Click "Add camera" button</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.</p>
              

              <h4 className="text-base font-semibold leading-7 text-gray-900 mt-6">9. Remove Camera</h4>
              <p className="mt-1 text-sm leading-6 text-gray-600">Use the "Remove" button to delete the camera from the list.</p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraSetupTutorial;
