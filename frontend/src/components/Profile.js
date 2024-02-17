import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', credits: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace '/api/myProfile' with your actual endpoint that returns the current user's profile
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/api/myProfile`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile({ name: data.name, credits: data.credits });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Credits: {profile.credits}</p>
    </div>
  );
};

export default Profile;
