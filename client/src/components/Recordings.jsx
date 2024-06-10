import React, { useState, useEffect } from 'react';

const RecordedVideoGallery2 = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.user_id) {
      const userId = user.user_id;

      fetch(`https://observa-api.onrender.com/api/recordings/dva/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setVideos(data);
          setLoading(false); // Set loading to false when data is fetched
          setError(null);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false); // Set loading to false on error
        });
    } else {
      setError('User not logged in or user ID not found');
      setLoading(false); // Set loading to false if user is not found
    }
  }, []);

  if (error) {
    return <div className="text-red-500">Error fetching recordings: {error}</div>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Gallery Header */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-base font-semibold leading-7 text-gray-900">Recorded Video Gallery</h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Here are the recorded videos.
        </p>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
          <style>
            {`
              .loader {
                display: block;
                --height-of-loader: 4px;
                --loader-color: #0071e2;
                width: 130px;
                height: var(--height-of-loader);
                border-radius: 30px;
                background-color: rgba(0,0,0,0.2);
                position: relative;
              }

              .loader::before {
                content: "";
                position: absolute;
                background: var(--loader-color);
                top: 0;
                left: 0;
                width: 0%;
                height: 100%;
                border-radius: 30px;
                animation: moving 1s ease-in-out infinite;
              }

              @keyframes moving {
                50% {
                  width: 100%;
                }

                100% {
                  width: 0;
                  right: 0;
                  left: unset;
                }
              }
            `}
          </style>
        </div>
      ) : (
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {videos.map((video, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md flex justify-center items-center">
              <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {`Video ${index + 1}`}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordedVideoGallery2;
