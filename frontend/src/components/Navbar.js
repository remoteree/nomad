import React, { useState } from 'react';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({isLoggedIn}) => {
  const [role, setRole] = useState('User'); // Example roles: Admin, User, Guest

  const navigate = useNavigate();
  // Dummy functions for handling actions
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload()

  };
  const handleRegister = () => console.log('Register');
  const handleAbout = () => console.log('About');
  const handleAccount = () => console.log('Account settings');

  return (
    <Menu>
      {isLoggedIn ? (
        <>
          {/* Left-aligned items (if any) can go here */}

          {/* Right-aligned items */}
          <Menu.Menu position="right">
            <Dropdown item text={`Role: ${role}`}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRole('User')}>User</Dropdown.Item>
                <Dropdown.Item onClick={() => setRole('Admin')}>Admin</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item as={Link} to="/account">
              Account
            </Menu.Item>
            <Menu.Item>
              <Button primary onClick={handleLogout}>Log Out</Button>
            </Menu.Item>
          </Menu.Menu>
        </>
      ) : (
        <>
          {/* Left-aligned items (if any) can go here */}

          {/* Right-aligned items */}
          <Menu.Menu position="right">
            <Menu.Item as={Link} to="/about">About
            </Menu.Item>
            <Menu.Item as={Link} to="/register">Register
            </Menu.Item>
            <Menu.Item as={Link} to="/login">
              Log In
            </Menu.Item>
          </Menu.Menu>
        </>
      )}
    </Menu>
  );
};

export default Navbar;
