# Observa - Video Surveillance System!

   ![LogoObserva](https://github.com/gregaspan/Observa/assets/156235797/a415ce99-9aed-4b8d-b2a8-072a7a263867)






Observa web app, is designed to use old/rejected android phones as a video surveillance system. Our goal was to provide security to everyone without any hassle.  

This file will serve as a project presentation, instructions for installing the application locally, using the application online and documentation for the Observa application. 

**Team members**
- Gregor Špan
- Gal Dvoršak
- Miha Čakš

# Contents of the project
1. Overview
   - Detailed description of the project
2. Documentation
- Functionalities
- Technology stack
- Organisation and method of work
- Data structure design
- Testing
3. Installation instructions 
   - Selfhosted version
   - Paid version
4. Use of the application
   - User guide
   - Final look of the app
5. Landing page
6. Presentation

# 1. Overview
**Detailed description of the project**

  The Observa Video Surveillance App is designed to provide comprehensive security monitoring with a user-friendly interface which, allow easy navigation through the feed. Whether you need to monitor your home, office, or any other property, Observa offers an array of advanced features to ensure your peace of mind.

  Imagine you're away from home and your kids are home alone. With Observa, you can have everything under control and be calm, knowing you can monitor them in real-time. You can check live feeds to see that they're safe, receive instant notifications if any motion is detected, and even talk with our AI security specialist for any concerns.

# 2. Documentation
Here is presented the entire process of working on this project and all the necessary tools and software that were used in the development. 

**Functionalities**
- Remote Access - Access the system via web app
  - Live Observation - Real time video streaming for instant monitoring
  - Multi device support - Connect and monitor multiple cameras simultaneously 
  - Multi camera support - Access the system from multiple devicesReports
  - Motion Detection - You can also download and delete captured image.
  - Facial Recognition - You can also download and delete captured image.
  - Video Playback - View recorded videos stored in the database. 
  - Email notifications - Receive notifications about detected motion via email. 
  - SMS notifications - Receive notifications about detected motion sms. 
  - Observa Chat - Talk with our AI security specialist.
  - Reports - Detailed reports generated from detected faces and motion events
 
**Technology stack**

**Backend** for this app is made with Python. We used Flask framework. For database we went with NoSQL database MongoDB and Amazon S3 for video storage. For testing of APIs we used Postman. 
**Frontend** of the app is made with React library, using javascript.  

**Organisation and method of work**

During the execution of the project, we held two in-person meetings each week (Monday and Thursday). The purpose of these meetings was to present the progress made, exchange experiences, problem-solving and assigning new tasks.
For remote communication and collaboration, we utilized Discord.

![sprintiObserva](https://github.com/gregaspan/Observa/assets/156235797/811eb9a6-e705-4497-a841-fbd811a88b35)

We adopted the SCRUM methodology to manage our project work, which is structured around sprints. Each sprint lasted for one week. The whole project consisted of 5 sprints.The project lasted from 13.05.2024 to 10.06.2024. Before starting a new sprint, we created new tasks, and set goals to be done in the next sprint. 

We also chose the principles of the Kanban method for managing the project work, where we first tackled tasks with the highest priority. New tasks were assigned at the end of each in-person meeting, ensuring continuous development. 
To track work and create new tasks, we used Trello, which allowed us to review the work and use use board for better visibility. 


<img width="1440" alt="TrelloObserva" src="https://github.com/gregaspan/Observa/assets/156235797/a5611282-b35b-4486-9ef6-eff289eead34">

**Data structure design**

For storing videos, we used Amazon's S3 cloud-based service, which allowed us to store up to 5GB of data for free. This helped us avoid database overcrowding and maintained better and faster performance. 

We used MongoDB to store the data about users and images. Images are encoded using Base64 format for efficient storage and retrieval.. We used different collections. 4 collections to be exact:

detected_faces -> a collection that records the ip address of the camera, the time, the user id and the captured image.
detected_motion-> collection that records the camera ip address, time, user id and captured image.
recordings_collection -> collection that records recorded videos
users-> collection that records user name, email, password, profile picture, camera name, camera ip address, phone subscribers and email subscribers.

![ObservashemaPB](https://github.com/gregaspan/Observa/assets/156235797/cda1fa55-5f2a-4ba9-9982-e450c071f0b3)

**Testing**

For testing, we used manual tests, which we performed continuously after each added functionality. This way, we addressed errors promptly and avoided major shortcomings that could have become difficult to manage over time. 


# 3. Installation instructions
- **Selfhosted version**
  
   **You need to be connected to the same Wi-Fi network (Camera and Observa app)!!**
  
  **Android**
  
**1. Download and Install IP Webcam**

Scan the QR code below to download IP Webcam. The download will start automatically.

![ObservaQR 2](https://github.com/gregaspan/Observa/assets/156235797/e9206bba-12aa-45c0-91c7-17947baee7d8)


**2. Open IP Webcam App**

Open the IP Webcam app that you downloaded in the previous step.

**3. Configure IP Webcam**

Configure your desired settings (resolution, quality, etc.).

**4. Start Server**

Scroll to the bottom and tap on "Start server"

        
**Observa app**

**5. Go into Dashboard Tab**

**6. Type Your Camera Name**

Enter the name for your camera (we recommend that you name it after the room in which it is located).

**7. Type Camera Address**

Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).

**8. Click "Add camera"** 

button Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.

**9. Remove Camera**

Use the "Remove" button to delete the camera from the list.



- **Paid version** 

**Android**

**1. Download and Install IP Webcam**

Scan the QR code below to download IP Webcam. The download will start automatically.

![ObservaQR 2](https://github.com/gregaspan/Observa/assets/156235797/e9206bba-12aa-45c0-91c7-17947baee7d8)

**2. Open IP Webcam App**

Open the IP Webcam app that you downloaded in the previous step.

**3. Click Cloud Streaming Option**

Click on the "Cloud streaming" option in the IP Webcam app.

**4. Start Server**

Scroll to the bottom and tap on "Start server"

**Observa app**

**5. Go into Dashboard Tab**

**6. Type Your Camera Name**

Enter the name for your camera (we recommend that you name it after the room in which it is located).

**7. Type Camera Address**

Enter the IP address shown by the IP Webcam app (e.g., http://192.168.x.x:8080).

**8. Click "Add camera"** 

button Camera will be added to the list. If you click on the selected camera, you should see the live stream from your Android device.

**9. Remove Camera**

Use the "Remove" button to delete the camera from the list.

# 4. Use of the application

**User guide**

The User Guide is designed for new users to familiarise themselves with how the app works.
   It contains all the functionalities of the app that can be used by the user, in 10 categories. 


The categories are as follows:

   -Login/Registration,
   
   -Live Observation, 
   
   -Multi camera support, 
   
   -Motion Detection,
   
   -Facial Recognition,
   
   -Video Playback,  
   
   -Email notifications,
   
   -SMS notifications,
   
   -Observa Chat,
   
   -Reports.

   The categories contain step-by-step guide that explain in detail what the user needs to do and what the conditions are for the action to be successful. The User Guide can be found here ....LINK DO PDF.....

**Final look of the app**

![Multicamera support](https://github.com/gregaspan/Observa/assets/156235797/386d42fa-2e54-44cd-9195-9e73e742a7cf)

Dashboard

![expenses](https://github.com/gregaspan/Observa/assets/156235797/c36b185a-c949-48a1-831a-ea1843c98c76)

Live stream and Multicamera support


![inventory](https://github.com/gregaspan/Observa/assets/156235797/64b7aa07-ab54-422b-ab08-7466a8a39979)

Reports

Motion detection

Facial recognition 

<img width="1680" alt="VideoPlayback" src="https://github.com/gregaspan/Observa/assets/156235797/e390d88d-6b93-46da-916b-f68b68b21216">

Video playback

![contacts](https://github.com/gregaspan/Observa/assets/156235797/bc1ffb35-ccae-44f8-9f4e-f975c15ce1ef)

Observa chat

![ProfileObserva](https://github.com/gregaspan/Observa/assets/156235797/bc61790d-d28e-48f8-8b75-666281fa5be5)

Settings

# 5. Landing page

Landing page can be found here: https://observa-lp.vercel.app/


# 6. Presentation

You can find the presentation here: ==…………….……………………………………………………………………………………==





