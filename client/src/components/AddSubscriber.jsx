import React, { useState, useEffect } from "react";

export default function ManageSubscribers() {
  const [emailSubscriber, setEmailSubscriber] = useState("");
  const [phoneSubscriber, setPhoneSubscriber] = useState("");
  const [emailSubscribers, setEmailSubscribers] = useState([]);
  const [phoneSubscribers, setPhoneSubscribers] = useState([]);
  const [notification, setNotification] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setEmailSubscribers(user.email_subscribers || []);
      setPhoneSubscribers(user.phone_subscribers || []);
    }
  }, [user]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "https://observa-api.onrender.com/api/add_email_subscriber",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          email_subscriber: emailSubscriber,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      setEmailSubscribers((prevSubscribers) => [
        ...prevSubscribers,
        emailSubscriber,
      ]);
      const updatedUser = {
        ...user,
        email_subscribers: [...emailSubscribers, emailSubscriber],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showNotification("Email subscriber added successfully");
    } else {
      const result = await response.json();
      showNotification(`Failed to add email subscriber: ${result.message}`, "error");
    }

    setEmailSubscriber("");
  };

  const handlePhoneSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "https://observa-api.onrender.com/api/add_phone_subscriber",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          phone_subscriber: phoneSubscriber,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      setPhoneSubscribers((prevSubscribers) => [
        ...prevSubscribers,
        phoneSubscriber,
      ]);
      const updatedUser = {
        ...user,
        phone_subscribers: [...phoneSubscribers, phoneSubscriber],
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showNotification("Phone subscriber added successfully");
    } else {
      const result = await response.json();
      showNotification(`Failed to add phone subscriber: ${result.message}`, "error");
    }

    setPhoneSubscriber("");
  };

  const handleRemoveEmailSubscriber = async (subscriber) => {
    const response = await fetch(
      "https://observa-api.onrender.com/api/remove_email_subscriber",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          email_subscriber: subscriber,
        }),
      }
    );

    if (response.ok) {
      setEmailSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub !== subscriber)
      );
      const updatedUser = {
        ...user,
        email_subscribers: emailSubscribers.filter((sub) => sub !== subscriber),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showNotification("Email subscriber removed successfully");
    } else {
      const result = await response.json();
      showNotification(`Failed to remove email subscriber: ${result.message}`, "error");
    }
  };

  const handleRemovePhoneSubscriber = async (subscriber) => {
    const response = await fetch(
      "https://observa-api.onrender.com/api/remove_phone_subscriber",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          phone_subscriber: subscriber,
        }),
      }
    );

    if (response.ok) {
      setPhoneSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub !== subscriber)
      );
      const updatedUser = {
        ...user,
        phone_subscribers: phoneSubscribers.filter((sub) => sub !== subscriber),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showNotification("Phone subscriber removed successfully");
    } else {
      const result = await response.json();
      showNotification(`Failed to remove phone subscriber: ${result.message}`, "error");
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {notification && (
        <div
          className={`fixed top-0 right-0 mt-4 mr-4 p-4 rounded shadow-lg z-50 ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
          style={{ zIndex: 9999 }}
        >
          {notification.message}
        </div>
      )}
      {/* Add Email Subscriber Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add Email Subscriber
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the email address of the subscriber you want to add.
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={handleEmailSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="emailSubscriber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Subscriber
              </label>
              <div className="mt-2">
                <input
                  id="emailSubscriber"
                  name="emailSubscriber"
                  type="email"
                  value={emailSubscriber}
                  onChange={(e) => setEmailSubscriber(e.target.value)}
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
              Add Email Subscriber
            </button>
          </div>
        </form>
      </div>

      {/* Add Phone Subscriber Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add Phone Subscriber
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter the phone number of the subscriber you want to add.
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={handlePhoneSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="phoneSubscriber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Subscriber
              </label>
              <div className="mt-2">
                <input
                  id="phoneSubscriber"
                  name="phoneSubscriber"
                  type="tel"
                  value={phoneSubscriber}
                  onChange={(e) => setPhoneSubscriber(e.target.value)}
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
              Add Phone Subscriber
            </button>
          </div>
        </form>
      </div>

      {/* Subscribers List Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Subscribers List
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            List of all email and phone subscribers.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="space-y-2">
            {emailSubscribers.map((sub, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-gray-200 text-sm leading-6 text-gray-700"
              >
                {sub}
                <button
                  onClick={() => handleRemoveEmailSubscriber(sub)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {phoneSubscribers.map((sub, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-gray-200 text-sm leading-6 text-gray-700"
              >
                {sub}
                <button
                  onClick={() => handleRemovePhoneSubscriber(sub)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
