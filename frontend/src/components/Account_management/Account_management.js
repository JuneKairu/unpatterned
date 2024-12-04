import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8081'
});

function Account_management() {

  return (
    <div 
      className="flex"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <div className="flex-1 p-4">
        <div className="flex flex-col h-full bg-white/80 rounded-lg shadow-md p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">ACCOUNT MANAGEMENT</h1>
            <div className="flex space-x-4">
              <button 
                className="flex items-center space-x-2 p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors" 
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex space-x-4">
            <button 
              className="bg-green-500 text-white py-1.5 px-3 rounded hover:bg-green-600 transition-colors text-sm"
            //   onClick={() => setShowAddProductForm(true)}
            //   disabled={loading}
            >
              Add Account
            </button>

            <button 
              className="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-600 transition-colors text-sm"
            //   onClick={() => setShowAddCategoryForm(true)}
            //   disabled={loading}
            >
              Delete Account
            </button>

            <button 
              className="bg-blue-700 text-white py-1.5 px-3 rounded hover:bg-blue-800 transition-colors text-sm"
            //   onClick={() => setShowAddCategoryForm(true)}
            //   disabled={loading}
            >
              Update Account
            </button>
          </div>




        </div>
      </div>
    </div>
  );
}

export default Account_management;