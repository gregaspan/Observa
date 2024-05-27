import React from 'react';

const VideoStream = () => {
  return (
    <div>
      <h1>Camera Stream</h1>
      <video
        src="http://192.168.0.27:8080/video"
        width="640"
        height="480"
        controls
        autoPlay
      />
    </div>
  );
};

export default VideoStream;
