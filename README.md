
# AR House Design Web App

“Where Augmented Reality Meets Interior Design”  
Experience interior designing like never before — right from your browser.

## Demo 

Try it here: https://practice-iitisoc.vercel.app/


## Team SD_007

* Team Leader: Sahiba Joshi
* Team Members: Devanshi Kawlani, Sohil Dangi, Disha Dange

## Project Overview

AR House Design is a full-stack web-based Augmented Reality (AR) application that allows users to visualize and design home interiors or exteriors in real time. It brings 3D furniture and décor to your own space using immersive technologies — no app download required.

Developed as part of IITISoC 2025 at IIT Indore.

## Features 
### Core Functionality

* AR Visualization (Live AR View Mode): Place and view 3D objects in real spaces using your mobile camera (powered by Model Viewer and WebXR).

* Object Library: A dashboard with a variety of furniture, decor, and architectural 3D models, sourced from Sketchfab and rendered via Blender.

* Customization Tools: Rotate, drag, zoom in/out objects to fit them into your room layout.

* Room Planner Mode: Upload a room image and drag/drop furniture on it to plan your layout virtually.

### Camera + AR Integration
* Markerless AR using live camera feed.

* Real-time scene capture and video recording in AR mode.

### Responsive UI
* Seamless experience on both mobile and desktop (AR features available on mobile/tablets).

## Tech Stack

| Category         | Tech Used                     |
|------------------|-------------------------------|
| Frontend         | React.js, JavaScript, AOS     |
| Styling          | CSS, Bootstrap                |
| Build Tool       | Create React App              |
| AR Engine        | Model Viewer, WebXR, Three.js |
| 3D Models        | Sketchfab, Blender            |
| Deployment       | Vercel                        |
| Backend          | Node.js, Express.js           |
| Database         | MongoDB                       |
| Authentication   | JWT, bcrypt, Joi              |

## Additional Features

* AR Measurement Tool: Measure room dimensions in real-time using immersive AR with WebXR + Hit Test API.

* E-Commerce Integration: Users can purchase products directly via Stripe-powered secure payment flow.

* Design Export & Sharing: Save and share your designs via image capture or video export.

* Login/Signup: JWT-secured user authentication with hashed passwords and input validation.

## How to run the project?

* Clone the github repo
* Open it in any code editor, say VS Code
* In terminal run the command npm install to install necessary packages
* Once installation is completed, run the project by npm start command

