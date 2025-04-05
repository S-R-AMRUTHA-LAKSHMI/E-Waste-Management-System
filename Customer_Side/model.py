from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define class labels (same as in your model)
class_labels = ['Keyboard', 'Mobile', 'mouse', 'TV', 'Camera', 'laptop', 'MicroWave', 'SmartWatch']

# Load the model once when the app starts
model = None

def load_model():
    global model
    try:
        model = tf.keras.models.load_model("model/electronic_gadget_classifier_fine_tuned.keras")
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        
# Call load_model when the app starts
load_model()

# Function to preprocess the image
def preprocess_image(img_data):
    # Convert bytes to image
    img = Image.open(io.BytesIO(img_data))
    
    # Resize to match model input size
    img = img.resize((224, 224))
    
    # Convert to array and normalize
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    
    return img_array

@app.route('/api/predict-ewaste', methods=['POST'])
def predict_ewaste():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in request'}), 400

    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
        
    try:
        # Read image data
        img_data = file.read()
        
        # Preprocess the image
        processed_image = preprocess_image(img_data)
        
        # Ensure model is loaded
        if model is None:
            load_model()
            if model is None:
                return jsonify({'error': 'Failed to load model'}), 500
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions[0])
        predicted_label = class_labels[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index]) * 100
        
        return jsonify({
            'predicted_label': predicted_label,
            'confidence': confidence,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Use a different port from your location API