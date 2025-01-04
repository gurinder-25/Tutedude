const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/auth');


router.get('/mutual-friends', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends');
    const mutualFriends = {}; // Store mutual friends and their counts

    for (const friend of user.friends) {
      const friendDetails = await User.findById(friend._id).populate('friends');

      friendDetails.friends.forEach((mutual) => {
        if (!mutual._id.equals(user._id) && !user.friends.includes(mutual._id)) {
          mutualFriends[mutual.username] = (mutualFriends[mutual.username] || 0) + 1;
        }
      });
    }

    res.json(mutualFriends);
  } catch (err) {
    res.status(400).send('Error retrieving mutual friends');
  }
});

module.exports = router;
