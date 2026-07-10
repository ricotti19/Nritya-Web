import cv2
import numpy as np
import os
import mediapipe as mp
import torch
import torch.nn as nn
import math
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─── PYTORCH MODEL ARCHITECTURE ───
class AramandiClassifier(nn.Module):
    def __init__(self, input_dim=32, hidden_dim=128, output_dim=2):
        super(AramandiClassifier, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim)
        )

    def forward(self, x):
        return self.network(x)

MODEL_PATH = "uploads/aramandi_classifier.pth"
pytorch_model = AramandiClassifier()
has_trained_weights = False

# for terminal
if os.path.exists(MODEL_PATH):
    try:
        pytorch_model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
        pytorch_model.eval()
        has_trained_weights = True
        print("[AI Core] Production PyTorch weights loaded successfully.")
    except Exception as e:
        print(f"[AI Core Warning] Model structural mismatch: {e}. Defaulting to hybrid heuristics.")
else:
    print("[AI Core Info] No pre-trained .pth found.")


# ─── KINEMATIC GEOMETRY PIPELINE ───
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

def calculate_angle(a, b, c):
    try:
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        if angle > 180.0:
            angle = 360.0 - angle
        return angle
    except Exception:
        return 0.0

def calculate_distance(a, b):
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

def extract_landmarks(lm):
    """Centralised landmark extraction — single source of truth for all rules."""
    return {
        "left_shoulder":  [lm[mp_pose.PoseLandmark.LEFT_SHOULDER].x,   lm[mp_pose.PoseLandmark.LEFT_SHOULDER].y],
        "right_shoulder": [lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].x,  lm[mp_pose.PoseLandmark.RIGHT_SHOULDER].y],
        "left_elbow":     [lm[mp_pose.PoseLandmark.LEFT_ELBOW].x,      lm[mp_pose.PoseLandmark.LEFT_ELBOW].y],
        "right_elbow":    [lm[mp_pose.PoseLandmark.RIGHT_ELBOW].x,     lm[mp_pose.PoseLandmark.RIGHT_ELBOW].y],
        "left_wrist":     [lm[mp_pose.PoseLandmark.LEFT_WRIST].x,      lm[mp_pose.PoseLandmark.LEFT_WRIST].y],
        "right_wrist":    [lm[mp_pose.PoseLandmark.RIGHT_WRIST].x,     lm[mp_pose.PoseLandmark.RIGHT_WRIST].y],
        "left_hip":       [lm[mp_pose.PoseLandmark.LEFT_HIP].x,        lm[mp_pose.PoseLandmark.LEFT_HIP].y],
        "right_hip":      [lm[mp_pose.PoseLandmark.RIGHT_HIP].x,       lm[mp_pose.PoseLandmark.RIGHT_HIP].y],
        "left_knee":      [lm[mp_pose.PoseLandmark.LEFT_KNEE].x,       lm[mp_pose.PoseLandmark.LEFT_KNEE].y],
        "right_knee":     [lm[mp_pose.PoseLandmark.RIGHT_KNEE].x,      lm[mp_pose.PoseLandmark.RIGHT_KNEE].y],
        "left_ankle":     [lm[mp_pose.PoseLandmark.LEFT_ANKLE].x,      lm[mp_pose.PoseLandmark.LEFT_ANKLE].y],
        "right_ankle":    [lm[mp_pose.PoseLandmark.RIGHT_ANKLE].x,     lm[mp_pose.PoseLandmark.RIGHT_ANKLE].y],
        "left_heel":      [lm[mp_pose.PoseLandmark.LEFT_HEEL].x,       lm[mp_pose.PoseLandmark.LEFT_HEEL].y],
        "right_heel":     [lm[mp_pose.PoseLandmark.RIGHT_HEEL].x,      lm[mp_pose.PoseLandmark.RIGHT_HEEL].y],
        "left_toes":      [lm[mp_pose.PoseLandmark.LEFT_FOOT_INDEX].x, lm[mp_pose.PoseLandmark.LEFT_FOOT_INDEX].y],
        "right_toes":     [lm[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX].x,lm[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX].y],
    }

# ─── SAFETY CHECKS — ALWAYS RUN, NEVER SKIPPED BY MODEL ───
def run_safety_checks(pts, shoulder_width_norm):
    safety = []

    left_knee  = pts["left_knee"]
    right_knee = pts["right_knee"]
    left_toes  = pts["left_toes"]
    right_toes = pts["right_toes"]

    # ── RULE J: Knee lateral overshoot past toe line (X-axis, front-facing camera) ──
    left_overshoot  = abs(left_knee[0]  - left_toes[0])
    right_overshoot = abs(right_knee[0] - right_toes[0])
    knee_threshold  = shoulder_width_norm * 0.30

    if left_overshoot > knee_threshold or right_overshoot > knee_threshold:
        safety.append(
            "Knees appear to pushed too far past toes. "
            "Pull back your stance."
        )
    return safety


# ─── GEOMETRIC EVALUATION — RUNS ON SUB-OPTIMAL FORMS ───
def run_geometric_evaluation(pts, shoulder_width_norm, l_angle, r_angle, left_knee_angle, right_knee_angle):
    """
    Geometric form rules for borderline/bad form.
    Safety checks (Rule J) are excluded here — they live in run_safety_checks().
    """
    feedback_log = []

    left_shoulder  = pts["left_shoulder"]
    right_shoulder = pts["right_shoulder"]
    left_elbow     = pts["left_elbow"]
    right_elbow    = pts["right_elbow"]
    left_hip       = pts["left_hip"]
    right_hip      = pts["right_hip"]
    left_knee      = pts["left_knee"]
    right_knee     = pts["right_knee"]
    left_ankle     = pts["left_ankle"]
    right_ankle    = pts["right_ankle"]
    left_heel      = pts["left_heel"]
    right_heel     = pts["right_heel"]
    left_toes      = pts["left_toes"]
    right_toes     = pts["right_toes"]
    left_wrist     = pts["left_wrist"] 
    right_wrist    = pts["right_wrist"]


# ─── RULE A & B: INTENT-AWARE NATYARAMBHAM EVALUATION ───
    # Calculate horizontal distance from wrist to hip to determine arm extension
    left_hand_extension  = abs(left_wrist[0] - left_hip[0])
    right_hand_extension = abs(right_wrist[0] - right_hip[0])

    # Threshold definition: If wrists are further out than 35% of shoulder width, 
    # we assume they are attempting Natyarambham. If closer, hands are likely on waist
    EXTENSION_THRESHOLD = shoulder_width_norm * 0.35

    # Check Left Arm (Only flag if Natyarambham is explicitly attempted)
    if left_hand_extension > EXTENSION_THRESHOLD or right_hand_extension > EXTENSION_THRESHOLD:
        if left_elbow[1] > left_shoulder[1] + (shoulder_width_norm * 0.25) or right_elbow[1] > right_shoulder[1] + (shoulder_width_norm * 0.25):
            feedback_log.append("Elbows seem to be drooping; maintain an upright upper Natyarambham framework.")
    
    # Rule B: Symmetrical Arm Extension (Only validate symmetry if BOTH arms are extended out)
    if left_hand_extension > EXTENSION_THRESHOLD and right_hand_extension > EXTENSION_THRESHOLD:
        left_arm_span  = abs(left_elbow[0]  - left_shoulder[0])
        right_arm_span = abs(right_shoulder[0] - right_elbow[0])
        if abs(left_arm_span - right_arm_span) > (shoulder_width_norm * 0.3):
            feedback_log.append("Uneven arm extension; balance your left and right structural space.")
            
    # Rule C: Shoulder Horizon Alignment
    if abs(left_shoulder[1] - right_shoulder[1]) > (shoulder_width_norm * 0.05):
        feedback_log.append("The shoulders do not look aligned; try to make lines more crisp and geometric.")

    # Rule D: Lateral Spine Drift
    mid_shoulder_x = (left_shoulder[0] + right_shoulder[0]) / 2
    mid_hip_x      = (left_hip[0]      + right_hip[0])      / 2
    if abs(mid_shoulder_x - mid_hip_x) > (shoulder_width_norm * 0.18):
        feedback_log.append("Spine is leaning; keep your torso vertically centered.")

    # Rule E: Knee Angulation (depth check)
    if left_knee_angle > 155 or right_knee_angle > 155:
        feedback_log.append("Squat deeper; your legs are too straight for a solid Aramandi.")

    # Rule F: Knee Inward Collapse
    if left_knee[0] > left_toes[0] and left_knee[0] > left_hip[0] or right_knee[0] < right_toes[0] and right_knee[0] < right_hip[0]:
        feedback_log.append("Knees appear to be caving inward; push them out to the side.")

    # Rule G: Hip Level Symmetry
    if abs(left_hip[1] - right_hip[1]) > (shoulder_width_norm * 0.15):
        feedback_log.append("Hips are uneven; distribute your weight equally on both feet.")

    # Rule H: Heel Lift Probability
    left_foot_angle   = calculate_angle(left_knee,  left_ankle,  left_toes)
    right_foot_angle  = calculate_angle(right_knee, right_ankle, right_toes)
    MIN_SAFE_FOOT_ANGLE = 145 

    # If a heel's Y-coordinate is significantly higher up the screen than the toes, it's a lift.
    LIFT_THRESHOLD = shoulder_width_norm * 0.12  

    # 1. Evaluate Left Foot Stability
    left_heel_lift = left_toes[1] - left_heel[1]  # Positive value means heel is lifting higher than toes
    if left_heel_lift > LIFT_THRESHOLD:
        feedback_log.append("Left foot is lifting; to balance pressure across foot, keep your foot firmly glued to the floor.")
    elif left_foot_angle > 185:
        feedback_log.append("Left foot placement tracking looks unstable. Ensure your foot is flat on the floor.")

    # 2. Evaluate Right Foot Stability
    right_heel_lift = right_toes[1] - right_heel[1]
    if right_heel_lift > LIFT_THRESHOLD:
        feedback_log.append("Right foot is lifting; to balance pressure across foot, keep your foot firmly glued to the floor.")
    elif right_foot_angle > 185:
        feedback_log.append("Right foot placement tracking looks unstable. Ensure your foot is flat on the floor.")

    # Rule I: Ankle Pronation
    if right_ankle[0] < right_heel[0] - (shoulder_width_norm * 0.10) or left_ankle[0]  > left_heel[0]  + (shoulder_width_norm * 0.10):
        feedback_log.append("Arches seem to be rolling inward; pull your weight to the outer edge of the foot to minimize strain.")

    heel_distance = abs(left_heel[0] - right_heel[0])
    ratio = heel_distance / max(shoulder_width_norm, 1e-6)

    if ratio < 0.15:
        feedback_log.append("Heels are too cramped. Widen your base for a proper Aramandi stance.")
    elif ratio > 0.35:
        feedback_log.append("Heels are too wide. Bring your feet slightly closer together.")

    # Always return the unified feedback_log containing ALL geometric issues
    return feedback_log

# ─── MAIN ANALYSIS FUNCTION ───
def analyze_photo(image_path, targets):
    print("ANALYZE PHOTO CALLED")
    frame = cv2.imread(image_path)
    if frame is None:
        return {"error": "Invalid image file matrix", "status": "Rejected"}

    image   = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    if not results.pose_landmarks:
        return {
            "score": "N/A",
            "telemetry": {"mean_left_angle": 0, "mean_right_angle": 0, "mean_posture_angle": 0},
            "feedback": ["Validation Failure: No human aramandi profile detected."],
            "status": "Rejected"
        }

    lm  = results.pose_landmarks.landmark
    pts = extract_landmarks(lm)

    # ── Angle calculations ──
    l_angle             = calculate_angle(pts["left_shoulder"],  pts["left_elbow"],  pts["left_wrist"])
    r_angle             = calculate_angle(pts["right_shoulder"], pts["right_elbow"], pts["right_wrist"])
    left_knee_angle     = calculate_angle(pts["left_hip"],       pts["left_knee"],   pts["left_ankle"])
    right_knee_angle    = calculate_angle(pts["right_hip"],      pts["right_knee"],  pts["right_ankle"])
    lower_posture_angle = (left_knee_angle + right_knee_angle) / 2

    shoulder_width_norm = calculate_distance(pts["left_shoulder"], pts["right_shoulder"])
    # ── Safety checks — unconditional, always run first ──
    safety_flags = run_safety_checks(pts, shoulder_width_norm)

    # ── Model inference ──
    model_prediction_good = False
    is_actually_aramandi  = True
    final_precision_score = 0
    feedback_log          = []

    if has_trained_weights:
        feature_list = (
            pts["left_shoulder"]  + pts["right_shoulder"] +
            pts["left_elbow"]     + pts["right_elbow"]    +
            pts["left_wrist"]     + pts["right_wrist"]    +
            pts["left_hip"]       + pts["right_hip"]      +
            pts["left_knee"]      + pts["right_knee"]     +
            pts["left_ankle"]     + pts["right_ankle"]    +
            pts["left_heel"]      + pts["right_heel"]     +
            pts["left_toes"]      + pts["right_toes"]
        )
        features_tensor = torch.FloatTensor(feature_list).unsqueeze(0)

        with torch.no_grad():
            outputs       = pytorch_model(features_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            prob_bad      = probabilities[0][0].item()
            prob_good     = probabilities[0][1].item()

        # ── 1. Hard rejection: not an aramandi at all ──
        if lower_posture_angle > 165.0 or (prob_good < 0.30 and prob_bad < 0.30):
            is_actually_aramandi = False
            feedback_log = [
                "Stance Validation Error: No aramandi detected. Try again"
            ]

        # ── 2. Model says good form ──
        elif prob_good >= 0.50:
            if safety_flags:
                # Safety issues override the good verdict
                model_prediction_good = False
                final_precision_score = 55
                feedback_log          = safety_flags
            else:
                model_prediction_good = True
                base_score            = 75 + (prob_good * 20)
                final_precision_score = max(70, min(98, int(base_score)))
                feedback_log          = ["Excellent execution! Your posture framework lines are balanced and clear."]

        # ── 3. Model says bad/borderline form ──
        else:
            model_prediction_good = False
            final_precision_score = max(35, min(68, int(prob_good * 100)))
            geometric_flags  = run_geometric_evaluation(pts, shoulder_width_norm, l_angle, r_angle, left_knee_angle, right_knee_angle)
            # Merge safety + geometric, safety flags go first
            feedback_log = safety_flags + geometric_flags
            if not feedback_log:
                feedback_log.append("Adjust your posture. Double-check your core framework lines.")

    else:
        # ── Fallback: no trained weights ──
        if lower_posture_angle > 165.0:
            is_actually_aramandi = False
            feedback_log = ["Stance Validation Error: Your legs are straight."]
        else:
            geometric_flags = run_geometric_evaluation(pts, shoulder_width_norm, l_angle, r_angle, left_knee_angle, right_knee_angle)
            feedback_log          = safety_flags + geometric_flags
            target_left           = targets.get("target_left_arm", 90)
            target_right          = targets.get("target_right_arm", 90)
            total_deviation       = (abs(target_left - l_angle) + abs(target_right - r_angle)) / 2
            final_precision_score = max(45, int(100 - (total_deviation * 0.7)))
            if final_precision_score >= 70 and not feedback_log:
                model_prediction_good = True

    # ── Status resolution ──
    if not is_actually_aramandi:
        status_label = "Invalid Pose"
        score_output = "N/A"
    else:
        score_output = final_precision_score
        status_label = "Good Form" if model_prediction_good else "Bad Form"

    return {
        "score": score_output,
        "telemetry": {
            "mean_left_angle":    int(l_angle),
            "mean_right_angle":   int(r_angle),
            "mean_posture_angle": int(lower_posture_angle)
        },
        "feedback": feedback_log,
        "status":   status_label
    }


@app.route("/analyze", methods=["POST"])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    target_metrics = {
        "target_left_arm":    float(request.form.get("target_left_arm",    90)),
        "target_right_arm":   float(request.form.get("target_right_arm",   90)),
        "target_posture":     float(request.form.get("target_posture",     145)),
        "allowed_variance":   float(request.form.get("allowed_variance",    20))
    }

    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", file.filename)
    file.save(path)
 
    try:
        result = analyze_photo(path, target_metrics)
        result["image_url"] = f"http://127.0.0.1:5000/uploads/{file.filename}"
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/uploads/<filename>')
def serve_video(filename):
    return send_from_directory('uploads', filename)

if __name__ == "__main__":
    app.run(port=5000, debug=True) 