import React, { useState, useEffect } from 'react';
import { Tab, Card, Button, Modal, Rating } from 'semantic-ui-react';

const Bookings = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Fetch past bookings
    const fetchPastBookings = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/bookings/pastBookings`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
      const data = await response.json();
      setPastBookings(data);
    };

    // Fetch future bookings
    const fetchFutureBookings = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/bookings/futureBookings`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
      const data = await response.json();
      setFutureBookings(data);
    };

    fetchPastBookings();
    fetchFutureBookings();
  }, []);

  const openRatingModal = (booking) => {
    setSelectedBooking(booking);
    setRatingModalOpen(true);
  };

  const handleRateBooking = async () => {
    // Replace with your API endpoint and include necessary booking and rating data
    await fetch(`${process.env.REACT_APP_BACKEND}/api/bookings/rateBooking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ bookingId: selectedBooking.id, rating }),
    });
    setRatingModalOpen(false);
    // Optionally, update the UI to reflect the new rating
  };

  const panes = [
    {
      menuItem: 'Past Bookings',
      render: () => (
        <Tab.Pane>
          {pastBookings.map((booking) => (
            <Card key={booking.id}>
              <Card.Content>
                <Card.Header>{booking.accommodation.type}</Card.Header>
                <Card.Meta>{booking.date}</Card.Meta>
                <Card.Description>
                  Hosted by {booking.host.name}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic color='green' onClick={() => openRatingModal(booking)}>
                  Rate Booking
                </Button>
              </Card.Content>
            </Card>
          ))}
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Future Bookings',
      render: () => (
        <Tab.Pane>
          {futureBookings.map((booking) => (
            <Card key={booking.id}>
              <Card.Content>
                <Card.Header>{booking.accommodation.type}</Card.Header>
                <Card.Meta>{booking.date}</Card.Meta>
                <Card.Description>
                  Hosted by {booking.host.name}
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Tab panes={panes} />

      <Modal
        open={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        size='small'
      >
        <Modal.Header>Rate Your Booking</Modal.Header>
        <Modal.Content>
          <Rating icon='star' maxRating={5} onRate={(e, { rating }) => setRating(rating)} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setRatingModalOpen(false)}>Cancel</Button>
          <Button onClick={handleRateBooking} color='green'>Submit</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Bookings;
