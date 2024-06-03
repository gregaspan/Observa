import React, { useState, useEffect } from 'react';

const AccountSettings = () => {
  const [user, setUser] = useState({ user_id: '', name: '', email: '', avatar: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({ user_id: storedUser.user_id, name: storedUser.name, email: storedUser.email, avatar: storedUser.avatar });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:6969/api/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('user', JSON.stringify(result));
        alert('Profile updated successfully');
      } else {
        const error = await response.json();
        alert('Error updating profile: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:6969/api/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        }),
      });

      if (response.ok) {
        alert('Password updated successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert('Error updating password: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://127.0.0.1:6969/api/delete_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      if (response.ok) {
        localStorage.removeItem('user');
        alert('Account deleted successfully');
        // Redirect or perform additional cleanup
      } else {
        const error = await response.json();
        alert('Error deleting account: ' + error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAvatarChange = async () => {
    const avatarUrl = prompt('Enter the URL of the new avatar:');
    if (avatarUrl) {
      setUser((prevUser) => ({
        ...prevUser,
        avatar: avatarUrl,
      }));
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Personal Information Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt=""
                className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
              />
              <div>
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                  Change avatar
                </button>
                <p className="mt-2 text-xs leading-5 text-gray-600">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="janesmith"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Change password</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Update your password associated with your account.
          </p>
        </div>

        <form className="md:col-span-2" onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-900">
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-900">
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 bg-gray-50 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Delete account</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            No longer want to use our service? You can delete your account here. This action is not reversible.
            All information related to this account will be deleted permanently.
          </p>
        </div>

        <div className="md:col-span-2">
          <button
            onClick={handleDeleteAccount}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          >
            Yes, delete my account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
