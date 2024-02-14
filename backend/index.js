const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config()
const {User} = require('./models/models');
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

// Routes
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
      const { email, password, fullname, roles } = req.body;
  
      // Validate roles (optional)
      const validRoles = ['developer', 'project_manager', 'architect', 'stakeholder'];
      if (roles.some(role => !validRoles.includes(role))) {
        return res.status(400).send('Invalid role(s) provided');
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send('Email is already in use');
      }
  
      const user = new User({ email, password, fullname, roles });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
