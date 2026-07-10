import os
import cv2
import numpy as np
import mediapipe as mp

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

DESIRED_LANDMARKS = [
    mp_pose.PoseLandmark.LEFT_SHOULDER,   mp_pose.PoseLandmark.RIGHT_SHOULDER,
    mp_pose.PoseLandmark.LEFT_ELBOW,      mp_pose.PoseLandmark.RIGHT_ELBOW,
    mp_pose.PoseLandmark.LEFT_WRIST,      mp_pose.PoseLandmark.RIGHT_WRIST,
    mp_pose.PoseLandmark.LEFT_HIP,        mp_pose.PoseLandmark.RIGHT_HIP,
    mp_pose.PoseLandmark.LEFT_KNEE,       mp_pose.PoseLandmark.RIGHT_KNEE,
    mp_pose.PoseLandmark.LEFT_ANKLE,      mp_pose.PoseLandmark.RIGHT_ANKLE,
    mp_pose.PoseLandmark.LEFT_HEEL,       mp_pose.PoseLandmark.RIGHT_HEEL,
    mp_pose.PoseLandmark.LEFT_FOOT_INDEX, mp_pose.PoseLandmark.RIGHT_FOOT_INDEX
]

def extract_features_from_image(image_path):
    """Loads an image, processes landmarks, and returns an 18-element list of coordinates."""
    image = cv2.imread(image_path)
    if image is None:
        return None
        

    # convert OpenCV's BGR byte format into RGB format
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    if not results.pose_landmarks:
        return None # Skip images where a human body isn't detected
        
    landmarks = []
    for lm_id in DESIRED_LANDMARKS:
        lm = results.pose_landmarks.landmark[lm_id]
        # Append normalized X and Y coordinates
        landmarks.extend([lm.x, lm.y])
        
    return landmarks

def build_dataset():
    X_data = []
    y_data = []
    
    # Mapping folders to structural ML targets
    categories = {'bad_form': 0, 'good_form': 1}
    base_dir = 'dataset'
    
    print("[Data Pipeline] Parsing image directories...")
    
    for folder, label in categories.items():
        folder_path = os.path.join(base_dir, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path, exist_ok=True)
            print(f"Created empty folder: '{folder_path}'. Drop images here!")
            continue
            
        for img_name in os.listdir(folder_path):
            img_path = os.path.join(folder_path, img_name)
            features = extract_features_from_image(img_path)
            
            if features is not None:
                X_data.append(features)
                y_data.append(label)
                
    if len(X_data) == 0:
        print("[Warning] No images processed. Drop real pictures into 'dataset/' folders.")
        return False
        
    # Save extracted numerical features directly to disk
    np.save('X_features.npy', np.array(X_data, dtype=np.float32))
    np.save('y_labels.npy', np.array(y_data, dtype=np.int64))
    print(f"[Success] Processed {len(X_data)} images. Features serialized to disk.")
    return True

if __name__ == "__main__":
    build_dataset()