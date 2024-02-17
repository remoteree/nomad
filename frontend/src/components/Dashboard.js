import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const Dashboard = ({child}) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('accommodations');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    switch (name) {
      case 'profile':
        navigate('/profile');
        break;
      case 'accommodations':
        navigate('/accommodations');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'friends':
        navigate('/friends');
        break;
      default:
        // handle default case or show an error
    }
  };

  return (
    <div>
      <Menu pointing secondary>
        <Menu.Item
          name='profile'
          active={activeItem === 'profile'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='accommodations'
          active={activeItem === 'accommodations'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='bookings'
          active={activeItem === 'bookings'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='friends'
          active={activeItem === 'friends'}
          onClick={handleItemClick}
        />
      </Menu>

      {child}
    </div>
  );
};

export default Dashboard;
