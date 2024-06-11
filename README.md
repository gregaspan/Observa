# Observa - Video Surveillance System 📹

![LandingPage-Mockup](https://github.com/gregaspan/Observa/assets/126577387/42e1203a-b01d-4c2f-8ded-e35d643fd04a)

Observa web app is designed to use old/rejected Android phones 📱 as a video surveillance system. Our goal is to provide security to everyone without any hassle 🔒.

This file will serve as a project presentation 📄, instructions for installing the application locally 🛠️, using the application online 🌐, and documentation for the Observa application 📚.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Setup and Usage](#setup-and-usage)
   - [Local Setup](#local-setup)
   - [User Guide](#user-guide)
   - [Video Tutorials](#video-tutorials)
5. [Links](#links)
6. [Shortcomings & Possible Improvements](#shortcomings--possible-improvements)
7. [Contact](#contact)

## Overview

🔍 **Detailed description of the project**

The Observa Video Surveillance App is designed to provide comprehensive security monitoring with a user-friendly interface, allowing easy navigation through the feed. Whether you need to monitor your home 🏠, office 🏢, or any other property, Observa offers an array of advanced features to ensure your peace of mind.

Imagine you're away from home and your kids are home alone. With Observa, you can have everything under control and be calm 😌, knowing you can monitor them in real-time. You can check live feeds to see that they're safe, receive instant notifications 📬 if any motion is detected, and even talk with our AI security specialist for any concerns.

## Features

### 🔧 Functionalities

- **Remote Access** 🌐 - Access the system via web app
- **Live Observation** 👀 - Real-time video streaming for instant monitoring
- **Multi-Device Support** 📱💻 - Connect and monitor multiple cameras simultaneously 
- **Motion Detection** 🚶‍♂️ - Download and delete captured images
- **Facial Recognition** 😃 - Download and delete captured images
- **Video Playback** 🎥 - View recorded videos stored in the database
- **Email Notifications** 📧 - Receive notifications about detected motion via email
- **SMS Notifications** 📲 - Receive notifications about detected motion via SMS
- **Observa Chat** 💬 - Talk with our AI security specialist
- **Reports** 📊 - Detailed reports generated from detected faces and motion events

## Technology Stack

**Backend**: Python with Flask framework 🐍. NoSQL database MongoDB and Amazon S3 for video storage ☁️. API testing with Postman.  
**Frontend**: React library using JavaScript 💻.

## Setup and Usage

### Local Setup 🛠️

For a detailed guide on how to set up the project locally, please refer to our [Notion Documentation](https://gregaspan.notion.site/Local-Setup-Observa-4b83a746359241d8b0ddc2b7680bb0ed?pvs=4).

You can also watch this [video tutorial](https://www.loom.com/share/9080241f495c495498f6d545997eb17b) on how to launch the project using the terminal.

### User Guide 📖

The User Guide is designed for new users to familiarize themselves with how the app works. It contains all the functionalities of the app that can be used by the user, in 10 categories:

- Login/Registration
- Live Observation
- Multi-Camera Support
- Motion Detection
- Facial Recognition
- Video Playback
- Email Notifications
- SMS Notifications
- Observa Chat
- Reports

The categories contain a step-by-step guide that explains in detail what the user needs to do and what the conditions are for the action to be successful. The User Guide can be found here: [User Guide](https://gregaspan.notion.site/Observa-User-Guide-62795490cad849138f18ddbffb571da4?pvs=4)

### Video Tutorials 🎥

- [How to Setup Camera](https://www.loom.com/share/28ed28adc1d54dbea241cfd848b5a156?sid=2f3af98f-52cc-4ede-b3ff-6c5beff17b66)
- [View Motion Detection and Facial Recognition Images](https://www.loom.com/share/66bc7033eacb4272a9411a4f66472306?sid=07bf22a6-91e7-4aef-b596-080094a1f376)
- [Edit Your Profile and AI Chatbot](https://www.loom.com/share/6401af6fe9c54083a7749fc1834e8834?sid=d6967511-c713-4d47-88b3-5e35d53a6929)

## Links 🔗

- **Landing Page**: [Landing Page](https://observa-lp.vercel.app/)
- **Frontend (App)**: [Frontend](https://app-observa.onrender.com/)
- **Backend**: [Backend](https://observa-api.onrender.com/)

## Shortcomings & Possible Improvements

Our application has shown some areas where improvements are needed to enhance user experience and functionality. These include:

- **Copy to Clipboard Functionality**: Needs optimization to ensure seamless copying of data across all devices and platforms.
- **Inconsistent Live Feed Loading Time**: Users have reported variations in the loading time of live feeds, which need to be addressed for a smoother and more reliable experience.
- **Intermittent Camera Loading Issues**: There have been instances where the camera fails to load properly. Resolving this issue is crucial for uninterrupted usage of camera-related features.
- **General Slow Loading Speed**: The overall loading speed of the application needs improvement to enhance user satisfaction and efficiency, especially during peak usage times.
- **Video Loading Limit on Deployment**: Adjustments are required to ensure seamless video playback without restrictions.
- **Security Concerns with High-Risk Data**: Implementing robust security measures is necessary to protect sensitive user information and maintain trust.

Addressing these shortcomings will not only improve the user experience but also strengthen the reliability and security of our application, leading to higher user satisfaction and trust.

## Contact

Get in touch 👉 [Contact Us](https://gozenforms.com/3XcCLycZXs5N5HdMqZbC)

## Additional Images and Diagrams

### 📅 Organisation and Method of Work

During the execution of the project, we held two in-person meetings each week (Mondays and Thursdays) 📆. The purpose of these meetings was to present the progress made, exchange experiences, problem-solving, and assigning new tasks. For remote communication and collaboration, we utilized Discord 🗣️.

![Sprint](https://github.com/gregaspan/Observa/assets/156235797/811eb9a6-e705-4497-a841-fbd811a88b35)

We adopted the SCRUM methodology to manage our project work, structured around sprints 🏃‍♂️. Each sprint lasted for one week, with the whole project consisting of 5 sprints, from May 13, 2024 to June 13, 2024. Before starting a new sprint, we created new tasks and set goals for the next sprint.

We also chose the principles of the Kanban method for managing the project work, tackling tasks with the highest priority first 📋. New tasks were assigned at the end of each in-person meeting, ensuring continuous development. To track work and create new tasks, we used Trello 📌, allowing us to review the work and use boards for better visibility.

<img width="1440" alt="TrelloObserva" src="https://github.com/gregaspan/Observa/assets/156235797/a5611282-b35b-4486-9ef6-eff289eead34">

### 📂 Data Structure Design

For storing videos, we used Amazon's S3 cloud-based service, allowing us to store up to 5GB of data for free, avoiding database overcrowding and maintaining better and faster performance ⚡.

We used MongoDB to store data about users and images. Images are encoded using Base64 format for efficient storage and retrieval 🗄️. We used four collections:

- `detected_faces`: records the IP address of the camera, the time, the user ID, and the captured image.
- `detected_motion`: records the camera IP address, time, user ID, and captured image.
- `recordings_collection`: records recorded videos.
- `users`: records user name, email, password, profile picture, camera name, camera IP address, phone subscribers, and email subscribers.

![Observa Schema](https://github.com/gregaspan/Observa/assets/156235797/cda1fa55-5f2a-4ba9-9982-e450c071f0b3)

### 🎨 Final Look of the App

![1USE-THIS](https://github.com/gregaspan/Observa/assets/126577387/7529285b-3179-49bc-975d-fe8fb7d0ee6a)

<img width="1680" alt="Motion Detection1" src="https://github.com/gregaspan/Observa/assets/156235797/08c39170-0e9e-4094-a840-a8ac87cbd9eb">


More wireframes: [Wireframes](https://gregaspan.notion.site/Observa-User-Guide-62795490cad849138f18ddbffb571da4?pvs=4)
