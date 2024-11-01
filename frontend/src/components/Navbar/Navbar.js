import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // Ensure this path is correct for your logo image

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clearing tokens, redirecting)
    alert('Logged out successfully');
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-blue-700 shadow-md p-4">
      <div className="flex items-center mb-8 ml-4">
        <img src={logo} alt="LCCB Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-2xl font-bold ml-2 text-white">LCCB BOOKSTORE</h1>
      </div>
      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => navigate('/admin')}
          className="text-white hover:bg-blue-600 py-2 px-4 rounded transition duration-200 font-semibold"
        >
          ADMIN DASHBOARD
        </button>
        
        <button
          onClick={() => navigate('/home')}
          className="text-white hover:bg-blue-600 py-2 px-4 rounded transition duration-200 font-semibold"
        >
          HOME
        </button>

        <button
          onClick={() => navigate('/inventory')}
          className="text-white hover:bg-blue-600 py-2 px-4 rounded transition duration-200 font-semibold"
        >
          INVENTORY
        </button>
        
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded transition duration-200"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
