import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import backgroundImage from './assets/images/background2.jpg';
// import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import Home from './components/Home';
import Inventory from './components/Inventory/Inventory';
import Dashboard from './components/Admin_dashboard/Admin_dashboard';
import Delivery from './components/Delivery/Delivery';
import Account from './components/Account_management/Account_management';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/account" element={<Account />} />
          </Routes>
    </Router>
  );
}

export default App;
