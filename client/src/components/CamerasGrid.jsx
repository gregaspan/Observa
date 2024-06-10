import React, { useState, useEffect } from "react";
import axios from "axios";
import CameraTile from "./CameraTile";
import fetchImage from "../utils/fetchImage";

const Loader = () => <div className="loader"></div>;

const App = () => {
  const [cameras, setCameras] = useState([]);
  const [newCameraName, setNewCameraName] = useState("");
  const [newCameraAddress, setNewCameraAddress] = useState("");
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraImages, setCameraImages] = useState({});
  const [loadingCameras, setLoadingCameras] = useState(true);
  const [loadingImages, setLoadingImages] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).user_id;

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    cameras.forEach(async (camera) => {
      if (!cameraImages[camera.name]) {
        setLoadingImages((prevLoadingImages) => ({
          ...prevLoadingImages,
          [camera.name]: true,
        }));
        const image = await fetchImage(camera.name);
        setCameraImages((prevImages) => ({
          ...prevImages,
          [camera.name]: image,
        }));
        setLoadingImages((prevLoadingImages) => ({
          ...prevLoadingImages,
          [camera.name]: false,
        }));
      }
    });
  }, [cameras]);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:6969/api/cameras",
        {
          params: { user_id: userId },
        }
      );
      setCameras(response.data);
      setLoadingCameras(false);
    } catch (error) {
      console.error("Error fetching cameras", error);
      setLoadingCameras(false);
    }
  };

  const addCamera = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:6969/api/add_camera", {
        user_id: userId,
        name: newCameraName,
        address: newCameraAddress + "/video",
      });
      fetchCameras();
      setNewCameraName("");
      setNewCameraAddress("");
    } catch (error) {
      console.error("Error adding camera", error);
    }
  };

  const removeCamera = async (address) => {
    try {
      await axios.post("http://127.0.0.1:6969/api/remove_camera", {
        user_id: userId,
        address,
      });
      fetchCameras();
    } catch (error) {
      console.error("Error removing camera", error);
    }
  };

  const handleTileClick = (camera) => {
    setSelectedCamera(camera);
  };

  const closeQuickView = () => {
    setSelectedCamera(null);
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Add Camera Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add Camera
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the name and address of the camera you want to add.
            <br />
            Trouble setting up camera?{" "}
            <a
              href="/doc"
              target="_blank"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
            >
              Guide
            </a>
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={addCamera}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="cameraName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Camera Name
              </label>
              <div className="mt-2">
                <input
                  id="cameraName"
                  name="cameraName"
                  type="text"
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="cameraAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Camera Address
              </label>
              <div className="mt-2">
                <input
                  id="cameraAddress"
                  name="cameraAddress"
                  type="text"
                  value={newCameraAddress}
                  onChange={(e) => setNewCameraAddress(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Add Camera
            </button>
          </div>
        </form>
      </div>

      {/* Cameras List Section */}
      <div className="max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Cameras List
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            List of all added cameras.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingCameras ? (
            <Loader />
          ) : (
            cameras.map((camera, index) => (
              <CameraTile
                key={index}
                camera={camera}
                image={cameraImages[camera.name]}
                onClick={() => handleTileClick(camera)}
              >
                {loadingImages[camera.name] && <Loader />}
              </CameraTile>
            ))
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedCamera && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedCamera.name}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeQuickView}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <img
              src={`http://127.0.0.1:6969/camera/${userId}/${cameras.indexOf(
                selectedCamera
              )}`}
              alt={`${selectedCamera.name} Feed`}
              className="w-full"
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
              onClick={() => {
                removeCamera(selectedCamera.address);
                closeQuickView();
              }}
            >
              Remove Camera
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .loader {
          display: block;
          --height-of-loader: 4px;
          --loader-color: #0071e2;
          width: 130px;
          height: var(--height-of-loader);
          border-radius: 30px;
          background-color: rgba(0, 0, 0, 0.2);
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
      `}</style>
    </div>
  );
};

export default App;
