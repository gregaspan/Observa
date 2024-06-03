import React, { useState, useEffect } from 'react';

export default function AddSubscriber() {
  const [emailSubscriber, setEmailSubscriber] = useState('');
  const [phoneSubscriber, setPhoneSubscriber] = useState('');
  const [emailSubscribers, setEmailSubscribers] = useState([]);
  const [phoneSubscribers, setPhoneSubscribers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      setEmailSubscribers(user.email_subscribers || []);
      setPhoneSubscribers(user.phone_subscribers || []);
    }
  }, [user]);

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:6969/api/add_email_subscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.user_id, email_subscriber: emailSubscriber }),
    });

    if (response.ok) {
      const result = await response.json();
      setEmailSubscribers((prevSubscribers) => [...prevSubscribers, emailSubscriber]);
      // Update the user data in local storage
      const updatedUser = { ...user, email_subscribers: [...emailSubscribers, emailSubscriber] };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Email subscriber added successfully');
    } else {
      const result = await response.json();
      alert(`Failed to add email subscriber: ${result.message}`);
    }

    setEmailSubscriber('');
  };

  const handlePhoneSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://127.0.0.1:6969/api/add_phone_subscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.user_id, phone_subscriber: phoneSubscriber }),
    });

    if (response.ok) {
      const result = await response.json();
      setPhoneSubscribers((prevSubscribers) => [...prevSubscribers, phoneSubscriber]);
      // Update the user data in local storage
      const updatedUser = { ...user, phone_subscribers: [...phoneSubscribers, phoneSubscriber] };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Phone subscriber added successfully');
    } else {
      const result = await response.json();
      alert(`Failed to add phone subscriber: ${result.message}`);
    }

    setPhoneSubscriber('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Notification Subscribers</h2>
      
      <form onSubmit={handleEmailSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="emailSubscriber" className="block text-gray-700 text-sm font-bold mb-2">
            Email Subscriber
          </label>
          <input
            id="emailSubscriber"
            name="emailSubscriber"
            type="email"
            value={emailSubscriber}
            onChange={(e) => setEmailSubscriber(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Email Subscriber
          </button>
        </div>
      </form>

      <form onSubmit={handlePhoneSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="phoneSubscriber" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Subscriber
          </label>
          <input
            id="phoneSubscriber"
            name="phoneSubscriber"
            type="tel"
            value={phoneSubscriber}
            onChange={(e) => setPhoneSubscriber(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Phone Subscriber
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-2">Email Subscribers</h3>
      <ul className="list-disc pl-5">
        {emailSubscribers.map((sub, index) => (
          <li key={index}>{sub}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2 mt-4">Phone Subscribers</h3>
      <ul className="list-disc pl-5">
        {phoneSubscribers.map((sub, index) => (
          <li key={index}>{sub}</li>
        ))}
      </ul>
    </div>
  );
}
