import React, { useState, useEffect } from 'react';
import './styles.css';

function FacialRecognition() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:6969/api/images')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  return (
    <div>
      <h1>Facial Recognition Content</h1>
      <div className="image-grid">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <img src={`data:image/jpeg;base64,${image.image_data}`} alt={`Captured face ${image.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacialRecognition;
