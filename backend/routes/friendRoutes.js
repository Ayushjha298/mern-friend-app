const express = require('express');
const {
    sendFriendRequest,
    manageFriendRequest,
    getFriendRequests,
    getFriendsList, 
    removeFriend, 
    getFriendRecommendations 
} = require('../controllers/friendController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/send', protect, sendFriendRequest); 
router.post('/manage', protect, manageFriendRequest);
router.get('/', protect, getFriendRequests);

router.get('/list', protect, getFriendsList);
router.post('/remove', protect, removeFriend);

router.get('/recommendations', protect, getFriendRecommendations);

module.exports = router;
