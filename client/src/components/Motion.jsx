import React, { useState, useEffect } from 'react';

const Motion = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.user_id;

  useEffect(() => {
    fetchMotionImages();
  }, [userId]);

  const fetchMotionImages = () => {
    fetch(`http://127.0.0.1:6969/api/motion_images?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        setLoading(false);
      });
  };

  const handleDropdownToggle = (id) => {
    const dropdown = document.getElementById(`dropdownDots-${id}`);
    dropdown.classList.toggle('hidden');
  };

  const handleSave = (id) => {
    fetch(`http://127.0.0.1:6969/display_motion_image/${id}`)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `motion_image_${id}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error fetching image:', error));
  };

  const handleShare = (imageData) => {
    fetch(imageData)
      .then(response => response.blob())
      .then(blob => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        alert('Image copied to clipboard');
      })
      .catch(error => console.error('Error copying image to clipboard:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:6969/api/delete_motion_image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_id: id, user_id: userId }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Image deleted successfully") {
        setImages(images.filter(image => image.id !== id));
      } else {
        console.error('Error deleting image:', data.message);
      }
    })
    .catch(error => console.error('Error deleting image:', error));
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Gallery Header */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-base font-semibold leading-7 text-gray-900">Motion Detected Content</h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Here are the images captured during motion detection.
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
        /* Image Grid */
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {images.map(image => (
            <div key={image.id} className="relative border rounded-lg shadow-sm overflow-hidden">
              <img
                src={`data:image/jpeg;base64,${image.image_data}`}
                alt={`Captured motion ${image.id}`}
                className="w-full h-48 object-cover"
              />
              <button
                id={`dropdownMenuIconButton-${image.id}`}
                onClick={() => handleDropdownToggle(image.id)}
                className="absolute top-2 right-2 inline-flex items-center p-2 text-sm font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                type="button"
              >
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                  <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
              </button>

              <div id={`dropdownDots-${image.id}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600 absolute top-10 right-2">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleSave(image.id)}>Download</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleShare(`data:image/jpeg;base64,${image.image_data}`)}>Copy to Clipboard</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => handleDelete(image.id)}>Delete</a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Motion;
