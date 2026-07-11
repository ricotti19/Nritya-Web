## **Link to Demo Video**: https://youtu.be/OTxF3_6NjHs

<img width="800" height="468" alt="NrityaWeb-ezgif com-livephoto-to-gif-converter (1)" src="https://github.com/user-attachments/assets/df57085c-f750-4b57-a160-6be6499f9f6e" />

## 📖 Project Overview
**NrityaWeb** is a full-stack web application designed to democratize classical dance education. By bridging traditional art with modern artificial intelligence, the platform aims to provide students with a "Digital Guru" that offers real-time feedback on alignment and posture. 

The core feature leverages a computer vision pipeline to evaluate the strict geometry of the foundational **Aramandi (half-squat)** stance, prioritizing dancer longevity through automated biomechanical feedback and tracking historical practice metrics over time.

## 💡 What is Bharatanatyam & the Aramandi Stance?
**Bharatanatyam** is a major Indian classical dance form characterized by its sharp, geometric lines, rhythmic footwork, and precise structural alignments. 

At the absolute structural foundation of this dance form is the **Aramandi** (a deep half-squat position). 

### The Biomechanical Challenge:
* **The Stance:** The dancer must lower their torso while keeping their knees turned strictly outward, creating a perfect diamond shape with the legs while keeping the heels firmly planted and the spine vertical.
* **The Injury Risk:** Incorrect alignment—such as letting the knees cave inward (*valgus collapse*) or lifting the heels—creates severe, repetitive rotational torque on the knee joints. This frequently leads to career-shortening orthopedic issues like meniscus tears and lateral shearing.
* **The AI Solution:** **NrityaWeb** acts as a real-time safety layer, checking the exact geometry of this foundational stance to protect a dancer's joint health and form integrity.

NrityaWeb is a web application designed to democratize classical dance education. By bridging traditional art with modern AI technology, the platform aims to provide students with a "Digital Guru" that offers real-time feedback on form, mudras (hand gestures), biomechanical alignment, posture, etc.

⚠️ Note: The custom image dataset and trained PyTorch model weights (.pt / .pth files) are excluded from this public repository due to GitHub file size limits and data privacy.

Because these core assets are omitted, this repository serves as a code portfolio and architecture showcase rather than a locally runnable project. Please refer to the demo video above to see the full system in action!

📷 Image Credits: Sample images (in hidden /assets) used for model testing and form comparison are sourced from public domains and Google Images for educational and demonstration purposes only.

## 🛠️ Technical Stack

### 💻 Frontend
* **React (Vite):** Handles the user interface and application state.
* **Tailwind CSS:** Manages the styling and responsive layout.
* **Axios:** Executes HTTP requests to the backend services.

### ⚙️ Backend (Node.js / Express)
* **Express:** Acts as the primary API for user and session data.
* **Mongoose:** (MongoDB): Handles data persistence (saving dance scores and session IDs).
* **Dotenv:** Manages environment variables for secure database connections.

* **Design Language:** Cinematic Dark Mode / Glassmorphism
* **Backend Core:** Python (Flask) for AI/Video processing
* **API Management:** Axios for secure multipart file handling
