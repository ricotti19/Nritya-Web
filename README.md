## 🌟 Vision

NrityaWeb is a web application designed to democratize classical dance education. By bridging traditional art with modern AI technology, the platform aims to provide students with a "Digital Guru" that offers real-time feedback on form, mudras (hand gestures), biomechanical alignment, posture, etc.

⚠️ Note: The custom image dataset and trained PyTorch model weights (.pt / .pth files) are excluded from this public repository due to GitHub file size limits and data privacy.

Because these core assets are omitted, this repository serves as a code portfolio and architecture showcase rather than a locally runnable project. Please refer to the demo video above to see the full system in action!


## 🛠️ Technical Stack

### 💻 Frontend
* **React (Vite):** Handles the user interface and application state.
* **Tailwind CSS:** Manages the styling and responsive layout.
* **Axios:** Executes HTTP requests to the backend services.

### ⚙️ Backend (Node.js / Express)
* **Express:** Acts as the primary API for user and session data.
* **Mongoose:** (MongoDB): Handles data persistence (saving dance scores and timestamps).
* **Dotenv:** Manages environment variables for secure database connections.

* **Design Language:** Cinematic Dark Mode / Glassmorphism
* **Backend Core:** Python (Flask) for AI/Video processing
* **API Management:** Axios for secure multipart file handling
