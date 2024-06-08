import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  BarController,
  PieController,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  BarController,
  PieController
);

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setError("User not found in local storage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:6969/api/report?user_id=${user.user_id}`);
          setReport(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReport();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="loader">
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
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  if (!report) {
    return <div className="text-center mt-10">No report data available.</div>;
  }

  // Function to aggregate detections per day
  const aggregateDetectionsPerDay = (detections) => {
    return detections.reduce((acc, detection) => {
      const date = new Date(detection.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  const faceDetectionsPerDay = aggregateDetectionsPerDay(report.faces);
  const motionDetectionsPerDay = aggregateDetectionsPerDay(report.motions);

  const labels = Array.from(new Set([...Object.keys(faceDetectionsPerDay), ...Object.keys(motionDetectionsPerDay)]));

  const detectionsPerDayData = {
    labels,
    datasets: [
      {
        label: 'Faces Detected',
        data: labels.map(label => faceDetectionsPerDay[label] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Motions Detected',
        data: labels.map(label => motionDetectionsPerDay[label] || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const totalDetections = report.faces.length + report.motions.length;
  const facePercentage = ((report.faces.length / totalDetections) * 100).toFixed(2);
  const motionPercentage = ((report.motions.length / totalDetections) * 100).toFixed(2);

  const detectionTypeData = {
    labels: ['Faces Detected', 'Motions Detected'],
    datasets: [
      {
        data: [report.faces.length, report.motions.length],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="divide-y divide-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="md:col-span-3 flex items-center space-x-4">
          <img src={user.avatar} alt="User Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-lg text-gray-600">Email: {user.email}</p>
          </div>
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Summary Statistics
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Overview of detected faces, motions, and recordings.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <p>Total Faces Detected: {report.total_faces_detected}</p>
          <p>Total Motions Detected: {report.total_motions_detected}</p>
          <p>Total Recordings: {report.total_recordings}</p>
          <p>Faces Detected Percentage: {facePercentage}%</p>
          <p>Motions Detected Percentage: {motionPercentage}%</p>
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Detections Per Day
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Bar chart of faces and motions detected per day.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <Bar data={detectionsPerDayData} />
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Detection Types
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Pie chart showing the distribution of detection types.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <Pie data={detectionTypeData} />
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Trend Analysis
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Line chart showing trends of detections over time.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <Line data={detectionsPerDayData} />
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Detailed Detections
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            List of all detected faces and motions.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {report.faces.map(face => (
                <tr key={face.timestamp}>
                  <td className="py-2 px-4 border-b">Face</td>
                  <td className="py-2 px-4 border-b">{new Date(face.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {report.motions.map(motion => (
                <tr key={motion.timestamp}>
                  <td className="py-2 px-4 border-b">Motion</td>
                  <td className="py-2 px-4 border-b">{new Date(motion.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:col-span-1 mt-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Recordings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            List of all recorded videos.
          </p>
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded shadow mt-8">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Video URL</th>
              </tr>
            </thead>
            <tbody>
              {report.recordings.map(recording => (
                <tr key={recording.timestamp}>
                  <td className="py-2 px-4 border-b">{new Date(recording.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {recording.video_url ? (
                      <a href={recording.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Watch Recording
                      </a>
                    ) : (
                      'No URL'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
