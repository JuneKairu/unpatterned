import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/background2.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post('http://localhost:8081/api/Login', { email, password })
      .then(res => {
        if (res.data.length > 0) {
          if (email === 'admin@gmail.com' && password === '123') {
            navigate('/admin');
          } else {
            navigate('/Home');
          }
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Invalid email or password.");
      });
  }

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
      <div className="w-1/2 flex justify-center items-center">

      <div className="flex items-center justify-end p-4">
        <form onSubmit={handleSubmit} className="w-96 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h2 className='text-3xl font-bold mb-4 text-center'>LCCB BOOKSTORE</h2>
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
