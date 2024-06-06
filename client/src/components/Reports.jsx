import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'tailwindcss/tailwind.css';

// Define the Reports component
const Reports = () => {
  // State to store user data from localStorage
  const [user, setUser] = useState(null);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Set up charts when user data is available
  useEffect(() => {
    if (user) {
      // Extract camera names for chart labels
      const cameraNames = user.cameras.map(camera => camera.name);

      // Dummy data for events detected by each camera
      const eventCounts = user.cameras.map(() => Math.floor(Math.random() * 100));

      // Dummy data for event types detected (face, motion, unknown)
      const faceEvents = user.cameras.map(() => Math.floor(Math.random() * 50));
      const motionEvents = user.cameras.map(() => Math.floor(Math.random() * 50));
      const unknownEvents = user.cameras.map(() => Math.floor(Math.random() * 20));

      // Create a bar chart for events detected by each camera
      const ctx1 = document.getElementById('eventsChart').getContext('2d');
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: cameraNames,
          datasets: [{
            label: 'Events Detected',
            data: eventCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Create a stacked bar chart for types of events detected by each camera
      const ctx2 = document.getElementById('eventTypesChart').getContext('2d');
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: cameraNames,
          datasets: [
            {
              label: 'Face Events',
              data: faceEvents,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Motion Events',
              data: motionEvents,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Unknown Events',
              data: unknownEvents,
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              stacked: true
            },
            y: {
              stacked: true
            }
          }
        }
      });

      // Dummy data for daily events detected over a week
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dailyEvents = days.map(() => Math.floor(Math.random() * 50));

      // Create a line chart for daily events detected
      const ctx3 = document.getElementById('dailyEventsChart').getContext('2d');
      new Chart(ctx3, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Daily Events',
            data: dailyEvents,
            fill: false,
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [user]);

  // Render the component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Report</h1>
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img src={user.avatar} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Events Detected by Each Camera</h3>
            <canvas id="eventsChart" width="400" height="200"></canvas>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Types of Events Detected</h3>
            <canvas id="eventTypesChart" width="400" height="200"></canvas>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Daily Events Detected</h3>
            <canvas id="dailyEventsChart" width="400" height="200"></canvas>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Reports;
