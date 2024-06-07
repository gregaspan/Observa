import React from 'react';

const CameraTile = ({ camera, image, onClick }) => {
    return (
        <div 
            className="border border-gray-300 p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 ease-in-out"
            onClick={() => onClick(camera)}
        >
            <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
            <div className="mt-2">
                {image ? (
                    <img 
                        src={image} 
                        alt={camera.name} 
                        className="w-full h-32 object-cover rounded" 
                    />
                ) : (
                    <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraTile;
