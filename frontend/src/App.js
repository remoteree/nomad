import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
// import Account from './Account';
// import Profile from './components/Profile';
// import Projects from './Projects';
import 'semantic-ui-css/semantic.min.css';
import UserSegment from './components/UserSegment';

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
      <div>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/register" element={<Register isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} />} />
          {/* <Route path="/account" element={<Account />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/" element={<UserSegment isLoggedIn={isLoggedIn}/>} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
