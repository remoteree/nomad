import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Accommodations from './components/Accommodations';
import Bookings from './components/Bookings';
import Friends from './components/Friends';
import Profile from './components/Profile';
import 'semantic-ui-css/semantic.min.css';

const checkTokenValidity = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/validateToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) throw new Error('Token validation failed');

    const data = await response.json();
    return data.isValid; // Assuming the response contains a boolean indicating token validity
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkTokenValidity();
      setIsLoggedIn(isValid);
    };

    validateToken();
  }, []);


  return (
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard child={<Accommodations />} isLoggedIn={isLoggedIn} />} />
          <Route path="/accommodations" element={<Dashboard child={<Accommodations />} />} />
          <Route path="/profile" element={<Dashboard child={<Profile />} />} />
          <Route path="/bookings" element={<Dashboard child={<Bookings />}/>} />
          <Route path="/friends" element={<Dashboard child={<Friends />} />} />
        </Routes>
      </Router>
    );
}

export default App;
