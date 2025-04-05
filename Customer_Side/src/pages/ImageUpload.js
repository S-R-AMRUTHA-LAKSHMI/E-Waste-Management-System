import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ onClassify }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setPrediction(response.data);
      onClassify(response.data.predicted_gadget); // Send data to parent component
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload an Image for Classification</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Classify"}
      </button>

      {prediction && (
        <div>
          <h3>Prediction:</h3>
          <p>Gadget: {prediction.predicted_gadget}</p>
          <p>Confidence: {prediction.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
