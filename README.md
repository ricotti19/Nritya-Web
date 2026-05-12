## 🌟 Vision

NrityaWeb is a web application designed to democratize classical dance education. By bridging traditional art with modern AI technology, the platform aims to provide students with a "Digital Guru" that offers real-time feedback on form, mudras (hand gestures), biomechanical alignment, posture, etc.

*In progress; frontend and backend not integrated or deployed yet (currently as two separate, functioning modules)*

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

### 🚀 Installation & Setup
Clone the repo: `git clone https://github.com/ricotti19/NrityaWeb.git`

Backend: Type `cd server`, run: `.\venv\Scripts\activate` and then: `python app.py`

Frontend: Type `cd client`, run `npm install`, then: `npm install -D tailwindcss postcss autoprefixer` (if for some reason Tailwind is finnicky) and then: `npm run dev`

Environment: Create a .env file in the server directory and add your MONGO_URI.

### 🛠️ Setup Instructions

1. Clone the repo: `git clone https://github.com/ricotti19/NrityaWeb.git`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
<img width="1872" height="1162" alt="NrityaWebScreen" src="https://github.com/user-attachments/assets/6df70d4e-f206-4c84-aa11-eff4d09748ae" />

