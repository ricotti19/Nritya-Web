import cv2
import numpy as np
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

import mediapipe as mp

# 1. DEFINE THE APP FIRST
app = Flask(__name__)
CORS(app)

# Initialize directly from the solutions module
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360 - angle if angle > 180 else angle

def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    feedback_log = []
    scores = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break
        frame_count += 1
        
        if frame_count % 10 != 0: continue # Process every 10th frame for speed

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            
            # 1. Check Left Arm (Aramandi/Mudra Position)
            ls = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
            le = [lm[mp_pose.PoseLandmark.LEFT_ELBOW].x, lm[mp_pose.PoseLandmark.LEFT_ELBOW].y]
            lw = [lm[mp_pose.PoseLandmark.LEFT_WRIST].x, lm[mp_pose.PoseLandmark.LEFT_WRIST].y]
            l_angle = calculate_angle(ls, le, lw)

            # 2. Scoring Logic (Target 90 degrees for square arm position)
            diff = abs(90 - l_angle)
            frame_score = max(0, 100 - diff)
            scores.append(frame_score)

            if diff > 20:
                feedback_log.append(f"At {round(frame_count/30, 1)}s: Adjust your Mudra (Current: {int(l_angle)}°)")

    cap.release()
    
    # Clean up: Remove unique feedback to keep it brief
    unique_feedback = list(set(feedback_log))[:3] 
    avg_score = int(sum(scores) / len(scores)) if scores else 0

    return {
        "score": avg_score,
        "feedback": unique_feedback,
        "status": "Success"
    }

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'video' not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
        
    file = request.files['video']
    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", file.filename)
    file.save(path)
    
    try:
        result = analyze_video(path)
        # Optional: Delete file after analysis to save space
        # os.remove(path) 
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)