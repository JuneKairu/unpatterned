import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { BellIcon, InboxIcon } from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';
import backgroundImage from '../../assets/images/background2.jpg';
import axios from 'axios';

function Admin_dashboard() {
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
            <h1 className="text-2xl font-bold text-gray-800">ADMIN DASHBOARD</h1>
            <div className="flex space-x-4">
              <button 
                className="flex items-center space-x-2 p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors" 
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          </div>

          {/* Sales Section */}
          <div className="w-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales As of Date</h2>
            <p className="text-sm text-gray-500">No Record found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_dashboard;