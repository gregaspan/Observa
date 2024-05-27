// CameraTile.js
import React from 'react';

const CameraTile = ({ camera, image, onClick }) => {
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => onClick(camera)}>
            <h3 className="text-lg font-semibold">{camera.name}</h3>
            {image && <img src={image} alt={camera.name} className="w-full h-32 object-cover rounded mt-2" />}
            <p className="text-sm text-gray-500">{camera.address}</p>
        </div>
    );
};

export default CameraTile;
