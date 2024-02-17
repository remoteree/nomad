const express = require('express');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config()
const { User, Accommodation, Booking, FriendRequest } = require('./models/models');

const { authenticateRequest } = require("./auth_common_library")

const cors = require('cors')

const app = express();
app.use(cors({origin: '*'}));
const PORT = process.env.PORT || 8000;

// Database connection (ensure to hide sensitive details using environment variables)
mongoose.connect(process.env.DB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Passport session setup.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Session and Passport configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'changeThisSecret', // Use a more secure secret in production
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  
  // Passport configuration setup
  const initialize = require('./passport-config');
  initialize(
    passport
  );

  const accommodationRoutes = require('./routes/accommodations');

  app.use('/api/accommodations', accommodationRoutes)

// Auth Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/auth/linkedin',
  passport.authenticate('linkedin')
);

app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// Route for login using Local Strategy and issuing a JWT
app.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
  
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
  
        // Generate a signed JWT with the contents of user object
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    })(req, res);
  });

  app.post('/register', async (req, res) => {
    try {
      const { email, password, name, roles } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send('Email is already in use');
      }
  
      const user = new User({ email, password, name, roles });
      await user.save();
  
      res.status(201).json({message: "User registered successfully"});
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred during registration');
    }
  });  


  app.post('/validateToken', (req, res) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
    if (token == null) return res.sendStatus(401); // No token provided
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token is not valid or expired
  
      // The token is valid, you can optionally return additional information here
      // For simplicity, we're just returning a success status
      res.status(200).json({ isValid: true });
    });
  });

  // Friends components
  // Fetch current friends

  const friendsRoutes = require('./routes/friends');

  app.use('/api/friends', friendsRoutes)

const bookingRoutes = require('./routes/bookings');

app.use('/api/bookings', bookingRoutes)

app.get('/api/myProfile', authenticateRequest, async (req, res) => {
  if (!req.user) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    // Assuming req.user.id contains the authenticated user's ID
    const userProfile = await User.findById(req.user.id, 'name credits');
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});


// Test
app.get('/api/add-mock-data', async (req, res) => {
  try {
    // Mock User Data
    const user1 = new User({
      email: 'john.doe@example.com',
      password: 'password123', // Make sure to hash passwords in your User model's pre-save middleware
      name: 'John Doe',
      company: 'Example Inc',
    });

    const user2 = new User({
      email: 'jane.doe@example.com',
      password: 'password123',
      name: 'Jane Doe',
      company: 'Example Corp',
    });

    await user1.save();
    await user2.save();

    // Mock Accommodation Data
    const accommodation = new Accommodation({
      address: '123 Main St',
      zipCode: '12345',
      state: 'NY',
      country: 'USA',
      private: true,
      type: 'room',
    });

    await accommodation.save();

    // Mock Booking Data
    const booking = new Booking({
      host: user1._id,
      guest: user2._id,
      date: new Date(),
      state: 'confirmed',
    });

    await booking.save();

    // Mock FriendRequest Data
    const friendRequest = new FriendRequest({
      sender: user1._id,
      receiver: user2._id,
      status: 'pending',
    });

    await friendRequest.save();

    res.json({ message: 'Mock data added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
