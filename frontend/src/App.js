import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
// import Signup from './components/Signup/Signup';
import Home from './components/Home';
import Inventory from './components/Inventory/Inventory';
// import backgroundImage from './assets/images/background2.jpg';
import Dashboard from './components/Admin_dashboard/Admin_dashboard';
import Delivery from './components/Delivery/Delivery';

function App() {
  return (
    <Router>
      {/* <div className="flex min-h-screen">
        <div 
          className="w-1/2" 
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </div> */}

        {/* <div className="w-1/2 flex justify-center items-center"> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/delivery" element={<Delivery />} />
          </Routes>
        {/* </div> */}
      {/* </div> */}
    </Router>
  );
}

export default App;
