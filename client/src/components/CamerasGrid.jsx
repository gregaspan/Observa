import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraTile from './CameraTile';
import fetchImage from '../utils/fetchImage';

const App = () => {
    const [cameras, setCameras] = useState([]);
    const [newCameraName, setNewCameraName] = useState('');
    const [newCameraAddress, setNewCameraAddress] = useState('');
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [cameraImages, setCameraImages] = useState({});
    const userId = JSON.parse(localStorage.getItem('user')).user_id;

    useEffect(() => {
        fetchCameras();
    }, []);

    useEffect(() => {
        cameras.forEach(async (camera) => {
            if (!cameraImages[camera.name]) {
                const image = await fetchImage(camera.name);
                setCameraImages((prevImages) => ({
                    ...prevImages,
                    [camera.name]: image,
                }));
            }
        });
    }, [cameras]);

    const fetchCameras = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:6969/api/cameras', {
                params: { user_id: userId }
            });
            setCameras(response.data);
        } catch (error) {
            console.error('Error fetching cameras', error);
        }
    };

    const addCamera = async () => {
        try {
            await axios.post('http://127.0.0.1:6969/api/add_camera', {
                user_id: userId,
                name: newCameraName,
                address: newCameraAddress,
            });
            fetchCameras();
            setNewCameraName('');
            setNewCameraAddress('');
        } catch (error) {
            console.error('Error adding camera', error);
        }
    };

    const removeCamera = async (address) => {
        try {
            await axios.post('http://127.0.0.1:6969/api/remove_camera', {
                user_id: userId,
                address,
            });
            fetchCameras();
        } catch (error) {
            console.error('Error removing camera', error);
        }
    };

    const handleTileClick = (camera) => {
        setSelectedCamera(camera);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">IP Camera Stream</h1>
            <div className="mb-4">
                <input
                    type="text"
                    className="border rounded px-4 py-2 mr-2"
                    value={newCameraName}
                    onChange={(e) => setNewCameraName(e.target.value)}
                    placeholder="Enter camera name"
                />
                <input
                    type="text"
                    className="border rounded px-4 py-2 mr-2"
                    value={newCameraAddress}
                    onChange={(e) => setNewCameraAddress(e.target.value)}
                    placeholder="Enter camera address"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={addCamera}
                >
                    Add Camera
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cameras.map((camera, index) => (
                    <CameraTile
                        key={index}
                        camera={camera}
                        image={cameraImages[camera.name]}
                        onClick={handleTileClick}
                    />
                ))}
            </div>
            {selectedCamera && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">{selectedCamera.name}</h2>
                    <img
                        src={`http://127.0.0.1:6969/camera/${userId}/${cameras.indexOf(selectedCamera)}`}
                        alt={`${selectedCamera.name} Feed`}
                        className="w-full max-w-lg"
                    />
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => removeCamera(selectedCamera.address)}
                    >
                        Remove Camera
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
