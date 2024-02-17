import React, { useState } from 'react';
import { Button, Card, Input, Dropdown, Modal } from 'semantic-ui-react';
import { stateOptions } from '../state_options'; // Assuming this import path is correct
import { DateInput } from 'semantic-ui-calendar-react';

function createDateFromString(dateStr) {
    const parts = dateStr.split('-'); // Split the string into parts
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Convert month to 0-indexed
    const year = parseInt(parts[2], 10);
  
    return new Date(year, month, day);
  }

const SearchAccommodations = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [selectedState, setSelectedState] = useState(''); // State for selected state
  const [searchResults, setSearchResults] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [bookingDateError, setBookingDateError] = useState('');
  const [searchDateError, setSearchDateError] = useState('');
  const [accommodationToBook, setAccommodationToBook] = useState(null);

  const handleSearch = async () => {
    try {
        const queryString = new URLSearchParams({
            city: encodeURIComponent(city),
            country: encodeURIComponent(country),
            state: encodeURIComponent(selectedState),
            startDate: encodeURIComponent(searchStartDate),
            endDate: encodeURIComponent(searchEndDate),
        }).toString();
    
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/accommodations/search?${queryString}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the auth token if your API requires authentication
            },
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setSearchResults(data);
        } catch (error) {
        console.error('Error fetching search results:', error);
        }
  };

        // Handlers for date changes
    const handleSearchStartDateChange = (event, { value }) => {
        const selectedDate = createDateFromString(value);
        const today = new Date()
    
        if (selectedDate < today) {
            setSearchDateError('Start date cannot be earlier than today');
            setSearchStartDate(''); // Optionally reset the bookingStartDate
        } else {
            setSearchStartDate(value);
            setSearchDateError(''); // Clear any existing error messages
        }
        };

        const handleSearchEndDateChange = (event, { value }) => {
            const start = createDateFromString(bookingStartDate);
            const end = createDateFromString(value);
        
            if (start && end <= start) {
              setSearchDateError('End date must be later than start date');
              setSearchEndDate(''); // Optionally reset the bookingEndDate
            } else {
                setSearchEndDate(value);
                setSearchDateError(''); // Clear the error if the date range is valid
            }
          };

  const handleBookingStartDateChange = (event, { value }) => {
    const selectedDate = createDateFromString(value);
    const today = new Date()

    if (selectedDate < today) {
      setBookingDateError('Start date cannot be earlier than today');
      setBookingStartDate(''); // Optionally reset the bookingStartDate
    } else {
      setBookingStartDate(value);
      setBookingDateError(''); // Clear any existing error messages
    }
  };

  const handleBookingEndDateChange = (event, { value }) => {
    const start = createDateFromString(bookingStartDate);
    const end = createDateFromString(value);

    if (start && end <= start) {
      setBookingDateError('End date must be later than start date');
      setBookingEndDate(''); // Optionally reset the bookingEndDate
    } else {
      setBookingEndDate(value);
      setBookingDateError(''); // Clear the error if the date range is valid
    }
  };


  const handleBooking = async (accommodationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/bookings/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Assuming you store your token in localStorage
        },
        body: JSON.stringify({
          accommodation: accommodationId,
          startDate: bookingStartDate,
          endDate: bookingEndDate
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const bookingData = await response.json();
      console.log('Booking successful:', bookingData);
      // Handle successful booking here (e.g., show a confirmation message)
      setBookingModalOpen(false); // Close the booking modal
    } catch (error) {
      console.error('Error making booking:', error);
      // Handle booking error here (e.g., show an error message)
    }
  };
  return (
    <div>
      <div>
        <Input 
          placeholder="City" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
        />
        <Input 
          placeholder="Country" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
        />
        {/* State Dropdown */}
        <Dropdown
          placeholder="Select State"
          fluid
          search
          selection
          options={stateOptions}
          value={selectedState}
          onChange={(e, data) => setSelectedState(data.value)}
        />
         <DateInput
            name="searchStartDate"
            placeholder="Start Date"
            value={searchStartDate}
            iconPosition="left"
            onChange={handleSearchStartDateChange}
          />
           <DateInput
            name="searchEndDate"
            placeholder="End Date"
            value={searchEndDate}
            iconPosition="left"
            onChange={handleSearchEndDateChange}
          />
          {searchDateError && <div style={{ color: 'red' }}>{searchDateError}</div>}
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div>
        {searchResults.map((accommodation, index) => (
          <Card key={index}>
            <Card.Content>
              <Card.Header>{accommodation.type}</Card.Header>
              <Card.Meta>{accommodation.city}, {accommodation.state}, {accommodation.country}</Card.Meta>
              <Card.Description>
                {accommodation.address}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button onClick={() => {setBookingModalOpen(true); setAccommodationToBook(accommodation);}}>Book Accommodation</Button>
            </Card.Content>
          </Card>
        ))}
      </div>
      <Modal open={bookingModalOpen} onClose={() => setBookingModalOpen(false)}>
        <Modal.Header>Select Your Dates</Modal.Header>
        <Modal.Content>
            <p>Booking accommodation at: {accommodationToBook && accommodationToBook.address}</p>
          <DateInput
            name="bookingStartDate"
            placeholder="Start Date"
            value={bookingStartDate}
            iconPosition="left"
            onChange={handleBookingStartDateChange}
          />
          <DateInput
            name="bookingEndDate"
            placeholder="End Date"
            value={bookingEndDate}
            iconPosition="left"
            onChange={handleBookingEndDateChange}
          />
           {bookingDateError && <div style={{ color: 'red' }}>{bookingDateError}</div>}
          <Button onClick={() => handleBooking(accommodationToBook._id)}>Confirm Booking</Button>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default SearchAccommodations;
