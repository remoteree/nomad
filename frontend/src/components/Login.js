import React, {useState} from 'react';
import { Button, Form, Segment, Divider, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const handleGoogleLogin = () => {
    // Integrate with Google Sign-In API
  };

  const handleLinkedInLogin = () => {
    // Integrate with LinkedIn API
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Assuming the response includes the user data or a token
      // You might want to save this data in the global state or local storage
      const data = await response.json();
      handleLoginSuccess(data.token)

      // Redirect to a protected route or home page after login
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Segment padded>
      <Button color="google plus" fluid onClick={handleGoogleLogin}>
        Login with Google
      </Button>
      <Divider horizontal>Or</Divider>
      <Button color="linkedin" fluid onClick={handleLinkedInLogin}>
        Login with LinkedIn
      </Button>
      <Divider horizontal>Or</Divider>

      <Form onSubmit={handleLoginSubmit}>
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
        <Button type="submit" primary fluid>Login with Email</Button>
      </Form>
      {error && <Message error content={error} />}
    </Segment>
  );
};

export default Login;
