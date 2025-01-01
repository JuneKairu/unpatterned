import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePasswordResetRequest = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/password-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@gmail.com',
          request_date: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit password reset request');
      }

      alert('Password reset request submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit password reset request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              value="user@gmail.com"
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <button
            onClick={handlePasswordResetRequest}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Request Password Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;