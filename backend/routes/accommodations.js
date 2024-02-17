const express = require('express');
const router = express.Router();
const {Accommodation} = require("../models/models")

const {authenticateRequest} = require('../auth_common_library');

function createDateFromString(dateStr) {
    const parts = dateStr.split('-'); // Split the string into parts
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Convert month to 0-indexed
    const year = parseInt(parts[2], 10);
  
    return new Date(year, month, day);
  }

// Accommodation-related routes
  // Fetch accommodations
  router.get('/', authenticateRequest, async (req, res) => {
    try {
      const accommodations = await Accommodation.find();
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/mine', authenticateRequest, async (req, res) => {
    try {
      const accommodations = await Accommodation.find({owner: req.user.id});
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/search', async (req, res) => {
    const { city, country, state, startDate, endDate } = req.query;

  try {
    const query = {};
    // Add city, country, and state to the query if provided
    if (city) query.city = { $regex: city, $options: 'i' };
    if (country) query.country = { $regex: country, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };

    const dateFilter = {};
    if (startDate && endDate) {
      // Construct date range filter for bookings
      dateFilter["bookings.date"] = { $gte: createDateFromString(startDate), $lte: createDateFromString(endDate) };
    }

    const accommodations = await Accommodation.find(query)
      .populate({
        path: 'bookings',
        match: {
          $or: [
            { state: 'completed', ...dateFilter },
            { _id: { $exists: false } } // Match accommodations with no bookings
          ]
        }
      });

    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: 'Error searching accommodations', error: error.message });
  }
  });
  

  // Add a new accommodation
  router.post('/', authenticateRequest, async (req, res) => {
    const accommodation = new Accommodation({
      // Assuming req.body contains all the necessary accommodation fields
      ...req.body,
      owner: req.user.id
    });

    try {
      const newAccommodation = await accommodation.save();
      res.status(201).json(newAccommodation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  module.exports = router;
