const express = require('express');
const router = express.Router();
const {Booking} = require("../models/models")

const {authenticateRequest} = require('../auth_common_library');

function createDateFromString(dateStr) {
    const parts = dateStr.split('-'); // Split the string into parts
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Convert month to 0-indexed
    const year = parseInt(parts[2], 10);
  
    return new Date(year, month, day);
  }

router.get('/pastBookings', authenticateRequest, async (req, res) => {
    try {
      const pastBookings = await Booking.find({
        guest: req.user.id,
        date: { $lt: new Date() },
      }).populate(['host', 'accommodation']);
      res.json(pastBookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Fetch future bookings
  router.get('/futureBookings', authenticateRequest, async (req, res) => {
    try {
      const futureBookings = await Booking.find({
        guest: req.user.id,
        startDate: { $gte: new Date() },
      }).populate(['accommodation']);
      res.json(futureBookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

    // Make a new booking
    router.post('/new', authenticateRequest, async (req, res) => {
        try {
            const { accommodation, startDate, endDate } = req.body;
          
            const newBooking = new Booking({
              guest: req.user.id,
              accommodation,
              startDate: createDateFromString(startDate),
              endDate: createDateFromString(endDate),
              state: 'pending'
            });
            const savedBooking = await newBooking.save();
            res.status(201).json(savedBooking);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      });
  
  // Rate a booking
  // TODO: should add rating by user
  router.post('/rateBooking', authenticateRequest, async (req, res) => {
    const { bookingId, rating } = req.body;
    try {
      // Assuming you have a field for ratings in your Booking model
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { $push: { ratings: rating } },
        { new: true }
      );
      res.json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  module.exports = router;
