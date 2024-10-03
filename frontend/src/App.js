import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home';
import backgroundImage from './assets/images/background2.jpg';
import Admin_dashboard from './components/Admin_dashboard/Admin_dashboard';


function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Admin_dashboard />} />

            
          </Routes>
        </div>
    </Router>
  );
}

export default App;
