import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cameras, setCameras] = useState([]);
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraAddress, setNewCameraAddress] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:6969/login', { email, password });
      setUserId(response.data.user_id);
      fetchCameras(response.data.user_id);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const fetchCameras = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:6969/api/cameras?user_id=${userId}`);
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const addCamera = async () => {
    try {
      await axios.post('http://127.0.0.1:6969/api/add_camera', {
        user_id: userId,
        name: newCameraName,
        address: newCameraAddress,
      });
      fetchCameras(userId);
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  const removeCamera = async (address) => {
    try {
      await axios.post('http://127.0.0.1:6969/api/remove_camera', {
        user_id: userId,
        address,
      });
      fetchCameras(userId);
    } catch (error) {
      console.error('Error removing camera:', error);
    }
  };

  return (
    <div>
      <h1>Camera Surveillance</h1>
      {!userId && (
        <div>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {userId && (
        <div>
          <h2>Your Cameras</h2>
          <ul>
            {cameras.map((camera, index) => (
              <li key={index}>
                {camera.name} - {camera.address}
                <button onClick={() => removeCamera(camera.address)}>Remove</button>
              </li>
            ))}
          </ul>
          <h2>Add Camera</h2>
          <input
            type="text"
            placeholder="Camera Name"
            value={newCameraName}
            onChange={(e) => setNewCameraName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Camera Address"
            value={newCameraAddress}
            onChange={(e) => setNewCameraAddress(e.target.value)}
          />
          <button onClick={addCamera}>Add Camera</button>
        </div>
      )}
    </div>
  );
}

export default App;
