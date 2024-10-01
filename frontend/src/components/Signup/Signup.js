import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate(); 

  // Update state when form fields change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // function to conect backend to send to sql 
    axios.post('http://localhost:8081/Signup', {
      email: values.email,
      password: values.password
    })
    .then((res) => {
      alert("Registration successful!");
      navigate('/'); 
    })
    .catch((err) => {
      console.error(err);
      alert("An error occurred during signup.");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-white/30 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">SIGN UP</h2>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white/80"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
        
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/" className="text-indigo-600 hover:text-indigo-700">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
