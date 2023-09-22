// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import Login from './components/Login';
import Register from './components/Register'; // Import the Register component
import HomePage from './components/Home'

function App() {
  return (
    <Router> {/* Wrap Routes in a Router component */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add the Register route */}
        <Route path="/home" element={<HomePage username="User123" />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  
  );
}

export default App;

