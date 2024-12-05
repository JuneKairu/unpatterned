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
    <div className="flex flex-col w-64 h-100vh bg-[#0442b1] shadow-md p-4">
      <div className="flex items-center mb-8 ml-4">
        <img src={logo} alt="LCCB Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-2xl font-bold ml-2 text-white">LCCB BOOKSTORE</h1>
      </div>
      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => navigate('/admin')}
          className="text-white hover:bg-[#3e6ab6] py-2 px-4 rounded transition duration-200 font-semibold"
        >
          ADMIN DASHBOARD
        </button>
        
        <button
          onClick={() => navigate('/account')}
          className="text-white hover:bg-[#3e6ab6] py-2 px-4 rounded transition duration-200 font-semibold"
        >
          ACCOUNT MANAGEMENT
        </button>

        <button
          onClick={() => navigate('/inventory')}
          className="text-white hover:bg-[#3e6ab6] py-2 px-4 rounded transition duration-200 font-semibold"
        >
          INVENTORY
        </button>

        <button
          onClick={() => navigate('/delivery')}
          className="text-white hover:bg-[#3e6ab6] py-2 px-4 rounded transition duration-200 font-semibold"
        >
          DELIVERY
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
