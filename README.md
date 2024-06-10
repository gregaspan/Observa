# Observa - Video Surveillance System

![LogoObserva](https://github.com/gregaspan/Observa/assets/156235797/a415ce99-9aed-4b8d-b2a8-072a7a263867)

Observa web app is designed to use old/rejected android phones as a video surveillance system. Our goal was to provide security to everyone without any hassle.

This file will serve as a project presentation, instructions for installing the application locally, using the application online, and documentation for the Observa application.

**Team members**
- Gregor Špan
- Gal Dvoršak
- Miha Čakš

## Table of Contents

1. [Overview](#1-overview)
2. [Documentation](#2-documentation)
   - [Functionalities](#functionalities)
   - [Technology Stack](#technology-stack)
   - [Organisation and Method of Work](#organisation-and-method-of-work)
   - [Data Structure Design](#data-structure-design)
   - [Testing](#testing)
3. [Use of the Application](#3-use-of-the-application)
   - [User Guide](#user-guide)
   - [Final Look of the App](#final-look-of-the-app)
4. [Links](#4-links)
5. [Shortcomings & Possible Improvements](#5-shortcomings--possible-improvements)
6. [Local Setup](#6-local-setup)

## 1. Overview

**Detailed description of the project**

The Observa Video Surveillance App is designed to provide comprehensive security monitoring with a user-friendly interface, allowing easy navigation through the feed. Whether you need to monitor your home, office, or any other property, Observa offers an array of advanced features to ensure your peace of mind.

Imagine you're away from home and your kids are home alone. With Observa, you can have everything under control and be calm, knowing you can monitor them in real-time. You can check live feeds to see that they're safe, receive instant notifications if any motion is detected, and even talk with our AI security specialist for any concerns.

## 2. Documentation

Here is presented the entire process of working on this project and all the necessary tools and software that were used in the development.

### Functionalities

- **Remote Access** - Access the system via web app
- **Live Observation** - Real-time video streaming for instant monitoring
- **Multi-Device Support** - Connect and monitor multiple cameras simultaneously 
- **Motion Detection** - Download and delete captured images
- **Facial Recognition** - Download and delete captured images
- **Video Playback** - View recorded videos stored in the database
- **Email Notifications** - Receive notifications about detected motion via email
- **SMS Notifications** - Receive notifications about detected motion via SMS
- **Observa Chat** - Talk with our AI security specialist
- **Reports** - Detailed reports generated from detected faces and motion events

### Technology Stack

**Backend**: Python with Flask framework. NoSQL database MongoDB and Amazon S3 for video storage. API testing with Postman.  
**Frontend**: React library using JavaScript.

### Organisation and Method of Work

During the execution of the project, we held two in-person meetings each week (Monday and Thursday). The purpose of these meetings was to present the progress made, exchange experiences, problem-solving, and assigning new tasks. For remote communication and collaboration, we utilized Discord.

![Sprint](https://github.com/gregaspan/Observa/assets/156235797/811eb9a6-e705-4497-a841-fbd811a88b35)

We adopted the SCRUM methodology to manage our project work, structured around sprints. Each sprint lasted for one week, with the whole project consisting of 5 sprints, from 13.05.2024 to 10.06.2024. Before starting a new sprint, we created new tasks and set goals for the next sprint.

We also chose the principles of the Kanban method for managing the project work, tackling tasks with the highest priority first. New tasks were assigned at the end of each in-person meeting, ensuring continuous development. To track work and create new tasks, we used Trello, allowing us to review the work and use boards for better visibility.

<img width="1440" alt="TrelloObserva" src="https://github.com/gregaspan/Observa/assets/156235797/a5611282-b35b-4486-9ef6-eff289eead34">

### Data Structure Design

For storing videos, we used Amazon's S3 cloud-based service, allowing us to store up to 5GB of data for free, avoiding database overcrowding and maintaining better and faster performance.

We used MongoDB to store data about users and images. Images are encoded using Base64 format for efficient storage and retrieval. We used four collections:

- `detected_faces`: records the IP address of the camera, the time, the user ID, and the captured image.
- `detected_motion`: records the camera IP address, time, user ID, and captured image.
- `recordings_collection`: records recorded videos.
- `users`: records user name, email, password, profile picture, camera name, camera IP address, phone subscribers, and email subscribers.

![Observa Schema](https://github.com/gregaspan/Observa/assets/156235797/cda1fa55-5f2a-4ba9-9982-e450c071f0b3)

### Testing

For testing, we used manual tests, performed continuously after each added functionality. This way, we addressed errors promptly and avoided major shortcomings that could have become difficult to manage over time.

## 3. Use of the Application

### User Guide

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

The categories contain a step-by-step guide that explains in detail what the user needs to do and what the conditions are for the action to be successful. The User Guide can be found here: https://gregaspan.notion.site/Observa-User-Guide-62795490cad849138f18ddbffb571da4?pvs=4

### Final Look of the App

![Multicamera Support](https://github.com/gregaspan/Observa/assets/156235797/386d42fa-2e54-44cd-9195-9e73e742a7cf)

Dashboard

![Expenses](https://github.com/gregaspan/Observa/assets/156235797/c36b185a-c949-48a1-831a-ea1843c98c76)

Live stream and Multicamera support

![Inventory](https://github.com/gregaspan/Observa/assets/156235797/64b7aa07-ab54-422b-ab08-7466a8a39979)

Reports

<img width="1680" alt="Motion Detection1" src="https://github.com/gregaspan/Observa/assets/156235797/08c39170-0e9e-4094-a840-a8ac87cbd9eb">


Motion detection

<img width="1680" alt="FacialRecognition1" src="https://github.com/gregaspan/Observa/assets/156235797/fb795b1e-7327-4261-9ea9-233c84a465f5">


Facial recognition

<img width="1680" alt="Video Playback" src="https://github.com/gregaspan/Observa/assets/156235797/e390d88d-6b93-46da-916b-f68b68b21216">

Video playback

![Contacts](https://github.com/gregaspan/Observa/assets/156235797/bc1ffb35-ccae-44f8-9f4e-f975c15ce1ef)

Observa chat

![Profile](https://github.com/gregaspan/Observa/assets/156235797/bc61790d-d28e-48f8-8b75-666281fa5be5)

Settings

## 4. Links

- **Landing Page**: https://observa-lp.vercel.app/
- **Frontend (App)**: https://app-observa.onrender.com/
- **Backend**: https://observa-api.onrender.com/

## 5. Shortcomings & Possible Improvements

Our application has shown some areas where improvements are needed to enhance user experience and functionality. These include:

- **Copy to Clipboard Functionality**: Needs optimization to ensure seamless copying of data across all devices and platforms.
- **Inconsistent Live Feed Loading Time**: Users have reported variations in the loading time of live feeds, which need to be addressed for a smoother and more reliable experience.
- **Intermittent Camera Loading Issues**: There have been instances where the camera fails to load properly. Resolving this issue is crucial for uninterrupted usage of camera-related features.
- **General Slow Loading Speed**: The overall loading speed of the application needs improvement to enhance user satisfaction and efficiency, especially during peak usage times.
- **Video Loading Limit on Deployment**: Adjustments are required to ensure seamless video playback without restrictions.
- **Security Concerns with High-Risk Data**: Implementing robust security measures is necessary to protect sensitive user information and maintain trust.

Addressing these shortcomings will not only improve the user experience but also strengthen the reliability and security of our application, leading to higher user satisfaction and trust.

## 6. Local Setup

For a detailed guide on how to set up the project locally, please refer to our [Notion Documentation](https://gregaspan.notion.site/Local-Setup-Observa-4b83a746359241d8b0ddc2b7680bb0ed?pvs=4).

You can also watch this [video tutorial](https://www.loom.com/share/9080241f495c495498f6d545997eb17b) on how to launch the project using the terminal.
