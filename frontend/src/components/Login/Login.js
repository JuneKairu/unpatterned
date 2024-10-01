import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; 


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', { email, password })
      .then(res => {
        if (res.data.length > 0) {
          navigate('/Home');
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Login Failed.");
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700">Sign up</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
