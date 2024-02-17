import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Grid, Input, Modal, Dropdown } from 'semantic-ui-react';
import { stateOptions } from '../state_options';

const MyAccommodations = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [open, setOpen] = useState(false); // For modal control
    const [newAccommodation, setNewAccommodation] = useState({
      address: '',
      zipCode: '',
      city: '',
      state: '',
      country: '',
      type: '',
    });

    useEffect(() => {
        // Replace this URL with your actual endpoint to fetch accommodations
        const fetchAccommodations = async () => {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND}/api/accommodations/mine`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
              }
            );
          const data = await response.json();
          setAccommodations(data);
        };
    
        fetchAccommodations();
      }, []);
    
      const handleChange = (e, { name, value }) => setNewAccommodation({ ...newAccommodation, [name]: value });
    
      const handleTypeChange = (e, { value }) => setNewAccommodation({ ...newAccommodation, type: value });
    
      const handleSubmit = async () => {
        // Replace this URL with your actual endpoint to add a new accommodation
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/accommodations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(newAccommodation),
        });
    
        if (response.ok) {
          const addedAccommodation = await response.json();
          setAccommodations([...accommodations, addedAccommodation]);
          setOpen(false); // Close the modal
        }
      };
    
      const accommodationTypes = [
        { key: 'couch', text: 'Couch', value: 'couch' },
        { key: 'air mattress', text: 'Air Mattress', value: 'air mattress' },
        { key: 'room', text: 'Room', value: 'room' },
        { key: 'entire place', text: 'Entire Place', value: 'entire place' },
      ];

       return (
        <Grid.Row>
          <Grid container>
            <Grid.Row>
              <Button primary onClick={() => setOpen(true)}>Add Accommodation</Button>
            </Grid.Row>
            <Grid.Row columns={3}>
              {accommodations.map((acc, index) => (
                <Grid.Column key={index}>
                  <Card>
                    <Card.Content>
                      <Card.Header>{acc.type}</Card.Header>
                      <Card.Meta>{acc.address}</Card.Meta>
                      <Card.Description>
                        {`${acc.city}, ${acc.state}, ${acc.zipCode}, ${acc.country}`}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
          
          <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Add a New Accommodation</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field
              control={Input}
              label='Address'
              name='address'
              placeholder='Address'
              value={newAccommodation.address}
              onChange={handleChange}
            />
            <Form.Field
              control={Input}
              label='Zip Code'
              name='zipCode'
              placeholder='Zip Code'
              value={newAccommodation.zipCode}
              onChange={handleChange}
            />
            <Form.Field>
              <label>City</label>
              <Input
                placeholder='City'
                name='city'
                value={newAccommodation.city}
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>State</label>
              <Dropdown
                placeholder='Select State'
                fluid
                search
                selection
                options={stateOptions}
                name='state'
                value={newAccommodation.state}
                onChange={handleChange}
              />
              </Form.Field>
            <Form.Field
              control={Input}
              label='Country'
              name='country'
              placeholder='Country'
              value={newAccommodation.country}
              onChange={handleChange}
            />
            <Form.Field>
              <label>Type</label>
              <Dropdown
                placeholder='Select Type'
                fluid
                selection
                options={accommodationTypes}
                value={newAccommodation.type}
                onChange={handleTypeChange}
              />
            </Form.Field>
            <Form.Button content='Submit' />
          </Form>
        </Modal.Content>
      </Modal>
        </Grid.Row>
        )
              };
export default MyAccommodations;