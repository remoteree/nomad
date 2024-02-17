import React, { useState, useEffect } from 'react';
import { Tab, List, Input, Button } from 'semantic-ui-react';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch current friends
    const fetchFriends = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/friends`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
        );
      const data = await response.json();
      setFriends(data);
    };

    // Fetch friend requests
    const fetchFriendRequests = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/friends/friendRequests`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
      const data = await response.json();
      setFriendRequests(data);
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Optionally debounce this call to limit requests during typing
    searchFriends(e.target.value);
  };

  const searchFriends = async (query) => {
    if (!query) return;
    // Replace with your API endpoint and add query parameters as needed
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND}/api/friends/searchFriends?query=${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
    const data = await response.json();
    setSearchResults(data);
  };

  const sendFriendRequest = async (friendId) => {
    // Replace with your API endpoint
    await fetch(`${process.env.REACT_APP_BACKEND}/api/friends/sendFriendRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ friendId }),
    });
    // Optionally update UI to reflect the sent request
  };

  const panes = [
    {
      menuItem: 'Current Friends',
      render: () => (
        <Tab.Pane>
          <List>
            {friends.map((friend) => (
              <List.Item key={friend.id}>
                {friend.name} - {friend.location}
              </List.Item>
            ))}
          </List>
          <h4>Friend Requests</h4>
          <List>
            {friendRequests.map((request) => (
              <List.Item key={request.id}>
                {request.senderName} - <Button onClick={() => {/* Handle accept/reject friend request */}}>Accept</Button>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Search Friends',
      render: () => (
        <Tab.Pane>
          <Input
            icon='search'
            placeholder='Search by name or location...'
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <List>
            {searchResults.map((result) => (
              <List.Item key={result.id}>
                {result.name} - {result.location} - <Button onClick={() => sendFriendRequest(result.id)}>Add Friend</Button>
              </List.Item>
            ))}
          </List>
        </Tab.Pane>
      ),
    },
  ];

  return <Tab panes={panes} />;
};

export default Friends;
