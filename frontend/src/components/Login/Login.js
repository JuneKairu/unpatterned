import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/background2.jpg';
import logo from '../../assets/images/logo.png';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const res = await axios.post('http://localhost:8081/api/Login', { email, password });
        if (email === 'admin@gmail.com' && password === '123') {
            navigate('/admin');
        } else {
            navigate('/Home');
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("Invalid email or password.");
        } else {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");
        }
    }
};

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </div>
      
      <div className="w-1/2 flex justify-center items-center bg-[#1565C0]">
      <div className="flex items-center justify-end p-4">
    <form onSubmit={handleSubmit} className="w-96 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
        <img src={logo} alt="LCCB Bookstore Logo" className="mx-auto mb-4 h-20 w-20" />
        <h2 className='text-3xl font-bold mb-4 text-center text-[#03045e]'>LCCB BOOKSTORE</h2>
        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1565C0] focus:border-[#1565C0] sm:text-sm"
            />
        </div>
        <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1565C0] focus:border-[#1565C0] sm:text-sm"
            />
        </div>
        <button
            type="submit"
            className="w-full py-2 px-4 bg-[#1565C0] text-white font-semibold rounded-lg shadow-md hover:bg-[#0D47A1] focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
        >
            Login
        </button>
    </form>
</div>

      </div>
    </div>
  );
}

export default Login;
