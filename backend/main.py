from flask import Flask, request, jsonify
import threading
import stoc, vtoc

app = Flask(__name__)

# Global variable to store detection results
detection_results = {"detected_signs": None, "dominant_emotion": None}

def run_detection():
    """Run the detection process and store the results."""
    print("[Backend] Loading model...")
    global detection_results
    detection_model, category_index = vtoc.load_model()
    final_signs, final_emotion = vtoc.detect_sign_language_and_emotion(detection_model, category_index)
    detection_results["detected_signs"] = final_signs
    detection_results["dominant_emotion"] = final_emotion

# from flask import Flask, request, jsonify
from flask_cors import CORS
# import stoc

# app = Flask(_name_)
CORS(app)  # Enables CORS for all routes

@app.route('/stot', methods=['POST', 'OPTIONS'])
def handle_stot():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight request

    data = request.get_json()
    action = data.get('action')

    if action == 'start':
        print('[Backend] Received "start" request.')
        return jsonify({"message": "Recording session started."})

    elif action == 'stop':
        print('[Backend] Received "stop" request. Starting transcription...')
        result = stoc.main()
        if result:
            return jsonify({"text": result})
        else:
            return jsonify({"text": "Could not understand audio."}), 200

    else:
        return jsonify({"error": "Invalid action"}), 400

@app.route('/vtot', methods=['GET'])
def detect_sign_and_emotion():
    global detection_results
    print("[Backend] Starting detection process...")
    # Start the detection process in a separate thread
    detection_thread = threading.Thread(target=run_detection)
    detection_thread.start()

    # Return an immediate response to Postman
    return jsonify({
        "message": "Detection process started. Check the results later."
    })

@app.route('/vtot/results', methods=['GET'])
def get_detection_results():
    """Endpoint to fetch the detection results."""
    return jsonify(detection_results)

if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, request, jsonify
# import threading
# import stoc, vtoc

# app = Flask(__name__)

# # Global variable to store detection results
# detection_results = {"detected_signs": None, "dominant_emotion": None}

# def run_detection():
#     """Run the detection process and store the results."""
#     global detection_results
#     detection_model, category_index = vtoc.load_model()
#     final_signs, final_emotion = vtoc.detect_sign_language_and_emotion(detection_model, category_index)
#     detection_results["detected_signs"] = final_signs
#     detection_results["dominant_emotion"] = final_emotion

# @app.route('/stot', methods=['GET'])
# def hello():
#     message = stoc.main()
#     return jsonify({
#         "message": f"{message}!"
#     })

# @app.route('/vtot', methods=['GET'])
# def detect_sign_and_emotion():
#     global detection_results

#     # Start the detection process in a separate thread
#     detection_thread = threading.Thread(target=run_detection)
#     detection_thread.start()

#     # Return an immediate response to Postman
#     return jsonify({
#         "message": "Detection process started. Check the results later."
#     })

# @app.route('/vtot/results', methods=['GET'])
# def get_detection_results():
#     """Endpoint to fetch the detection results."""
#     return jsonify(detection_results)

# if __name__ == '__main__':
#     app.run(debug=True)