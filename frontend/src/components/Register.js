import React, { useState } from 'react';
import { Button, Form, Segment, Divider, Message, Dropdown } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';  

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/login');
      // Redirect the user or show a success message
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = () => {
    // Redirect the user to your backend route that initiates Facebook authentication
    window.location.href = `${process.env.REACT_APP_BACKEND}/auth/facebook`;
  };

  return (
    <Segment padded>
      <Form onSubmit={handleSubmit} error={!!error}>
        <Form.Field>
          <label>Email</label>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Confirm Password</label>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Full Name</label>
          <input
            placeholder="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Field>
        {error && <Message error content={error} />}
        <Button type="submit" primary fluid loading={isLoading}>
          Register
        </Button>
        <Divider horizontal>Or</Divider>
        <Button color="facebook" fluid onClick={handleFacebookSignUp}>
          <i className="facebook icon"></i>
          Sign Up with Facebook
        </Button>
      </Form>
    </Segment>
  );
};

export default Register;
