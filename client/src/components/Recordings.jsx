import React, { useState, useEffect } from 'react';

const RecordedVideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:6969/api/recordings?camera_address=https://192.168.8.176:8080/video')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); 
        setVideos(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching recordings:', error); 
        setError(error.message); 
      });
  }, []);

  if (error) {
    return <div>Error fetching recordings: {error}</div>;
  }

  return (
    <div>
      <h1>Recorded Video Gallery</h1>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <video controls>
              <source src={`data:video/mp4;base64,${video.frame_data_base64}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordedVideoGallery;
