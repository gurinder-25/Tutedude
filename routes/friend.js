const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/auth');




router.get('/search', authenticate, async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.json(users);
  } catch (err) {
    res.status(400).send('Error searching users');
  }
});

router.post('/send-request', authenticate, async (req, res) => {
  const { recipientId } = req.body;
  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).send('User not found');

    recipient.friendRequests.push(req.user.id);
    await recipient.save();
    res.send('Friend request sent');
  } catch (err) {
    res.status(400).send('Error sending friend request');
  }
});


router.post('/respond-request', authenticate, async (req, res) => {
  const { senderId, accept } = req.body;

  try {
    const user = await User.findById(req.user.id); // Recipient
    const sender = await User.findById(senderId); // Sender

    if (!user || !sender) {
      return res.status(404).send('User not found');
    }

    if (accept) {
      // Add each other's IDs to their friends arrays
      user.friends.push(senderId);
      sender.friends.push(req.user.id);
    }

    // Remove the friend request from the recipient's list
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== senderId
    );

    // Save both users
    await user.save();
    await sender.save();

    res.send('Friend request processed');
  } catch (err) {
    res.status(400).send('Error responding to friend request');
  }
});


module.exports = router;
