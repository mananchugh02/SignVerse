import cv2
import numpy as np
import tensorflow as tf
from object_detection.utils import label_map_util, visualization_utils as viz_utils
from object_detection.utils import config_util
from object_detection.builders import model_builder
import os
from deepface import DeepFace
import time

# Paths
CUSTOM_MODEL_NAME = 'my_ssd_mobnet'
WORKSPACE_PATH = os.path.join('Tensorflow', 'workspace')
ANNOTATION_PATH = os.path.join(WORKSPACE_PATH, 'annotations')
MODEL_PATH = os.path.join(WORKSPACE_PATH, 'models', CUSTOM_MODEL_NAME)
LABEL_MAP_NAME = 'label_map.pbtxt'

def load_model():
    """Load the object detection model and label map."""
    category_index = label_map_util.create_category_index_from_labelmap(
        os.path.join(ANNOTATION_PATH, LABEL_MAP_NAME))

    configs = config_util.get_configs_from_pipeline_file(os.path.join(MODEL_PATH, 'pipeline.config'))
    detection_model = model_builder.build(model_config=configs['model'], is_training=False)

    ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
    ckpt.restore(os.path.join(MODEL_PATH, 'ckpt-2')).expect_partial()

    print("Model loaded successfully! 🎉")
    return detection_model, category_index

@tf.function
def detect_fn(image, detection_model):
    """Run detection on a single image."""
    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)
    return detections


def detect_sign_language_and_emotion(detection_model, category_index):
    """Detect a single sign and emotion and return them immediately."""
    print("Starting sign language and emotion detection...")

    # Open the camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open the camera. Please check your camera connection.")
        return "", ""

    detected_sign = None
    detected_emotion = None

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            continue

        # --- Sign Language Detection ---
        image_np = np.array(frame)
        input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)

        detections = detect_fn(input_tensor, detection_model)

        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy() for key, value in detections.items()}
        detections['num_detections'] = num_detections
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

        for i in range(num_detections):
            if detections['detection_scores'][i] > 0.5:  # Confidence threshold
                detected_sign = category_index[detections['detection_classes'][i] + 1]['name']
                print(f"Detected sign: {detected_sign}")
                break

        # --- Emotion Detection ---
        try:
            emotion_result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            detected_emotion = emotion_result[0]['dominant_emotion']
            print(f"Detected emotion: {detected_emotion}")
        except Exception as e:
            print("Emotion detection failed:", e)

        # If both a sign and emotion are detected, break the loop
        if detected_sign and detected_emotion:
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Detection complete.")
    return detected_sign, detected_emotion

def main():
    # Load the model and category index
    detection_model, category_index = load_model()

    # Example: Detect signs and emotions for 20 seconds
    final_signs, final_emotion = detect_sign_language_and_emotion(detection_model, category_index)
    return final_signs, final_emotion

# import cv2
# import numpy as np
# import tensorflow as tf
# from object_detection.utils import label_map_util, visualization_utils as viz_utils
# from object_detection.utils import config_util
# from object_detection.builders import model_builder
# import os
# from deepface import DeepFace
# import time

# # Paths
# CUSTOM_MODEL_NAME = 'my_ssd_mobnet'
# WORKSPACE_PATH = os.path.join('Tensorflow', 'workspace')
# ANNOTATION_PATH = os.path.join(WORKSPACE_PATH, 'annotations')
# MODEL_PATH = os.path.join(WORKSPACE_PATH, 'models', CUSTOM_MODEL_NAME)
# LABEL_MAP_NAME = 'label_map.pbtxt'

# def load_model():
#     """Load the object detection model and label map."""
#     category_index = label_map_util.create_category_index_from_labelmap(
#         os.path.join(ANNOTATION_PATH, LABEL_MAP_NAME))

#     configs = config_util.get_configs_from_pipeline_file(os.path.join(MODEL_PATH, 'pipeline.config'))
#     detection_model = model_builder.build(model_config=configs['model'], is_training=False)

#     ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
#     ckpt.restore(os.path.join(MODEL_PATH, 'ckpt-2')).expect_partial()

#     print("Model loaded successfully! 🎉")
#     return detection_model, category_index

# @tf.function
# def detect_fn(image, detection_model):
#     """Run detection on a single image."""
#     image, shapes = detection_model.preprocess(image)
#     prediction_dict = detection_model.predict(image, shapes)
#     detections = detection_model.postprocess(prediction_dict, shapes)
#     return detections


# def detect_sign_language_and_emotion(detection_model, category_index):
#     """Detect a single sign and emotion and return them immediately."""
#     print("Starting sign language and emotion detection...")

#     # Open the camera
#     cap = cv2.VideoCapture(0)
#     if not cap.isOpened():
#         print("Error: Could not open the camera. Please check your camera connection.")
#         return "", ""

#     detected_sign = None
#     detected_emotion = None

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             print("Failed to grab frame")
#             continue

#         # --- Sign Language Detection ---
#         image_np = np.array(frame)
#         input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)

#         detections = detect_fn(input_tensor, detection_model)

#         num_detections = int(detections.pop('num_detections'))
#         detections = {key: value[0, :num_detections].numpy() for key, value in detections.items()}
#         detections['num_detections'] = num_detections
#         detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

#         for i in range(num_detections):
#             if detections['detection_scores'][i] > 0.5:  # Confidence threshold
#                 detected_sign = category_index[detections['detection_classes'][i] + 1]['name']
#                 print(f"Detected sign: {detected_sign}")
#                 break

#         # --- Emotion Detection ---
#         try:
#             emotion_result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
#             detected_emotion = emotion_result[0]['dominant_emotion']
#             print(f"Detected emotion: {detected_emotion}")
#         except Exception as e:
#             print("Emotion detection failed:", e)

#         # If both a sign and emotion are detected, break the loop
#         if detected_sign and detected_emotion:
#             break

#     cap.release()
#     cv2.destroyAllWindows()
#     print("Detection complete.")
#     return detected_sign, detected_emotion

# def main():
#     # Load the model and category index
#     detection_model, category_index = load_model()

#     # Example: Detect signs and emotions for 20 seconds
#     final_signs, final_emotion = detect_sign_language_and_emotion(detection_model, category_index)
#     return final_signs, final_emotion
