const express = require('express');
const router = express.Router();
const {User, FriendRequest} = require("../models/models")

const {authenticateRequest} = require('../auth_common_library');

router.get('/', authenticateRequest, async (req, res) => {
    // Assuming a user ID is provided, for example, in req.user
    try {
      const user = await User.findById(req.user.id).populate('friends');
      res.json(user.friends);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Fetch friend requests
  router.get('/friendRequests', authenticateRequest, async (req, res) => {
    try {
      const requests = await FriendRequest.find({ receiver: req.user.id }).populate('sender');
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Search friends
  router.get('/searchFriends', async (req, res) => {
    const { query } = req.query;
    try {
      const results = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
        ],
      });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Send a friend request
  router.post('/sendFriendRequest', authenticateRequest, async (req, res) => {
    const { receiverId } = req.body;
    const friendRequest = new FriendRequest({
      sender: req.user.id,
      receiver: receiverId,
      status: 'pending',
    });
  
    try {
      const newRequest = await friendRequest.save();
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

  module.exports = router;
