const express = require('express');
const { searchUsers, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchUsers); 
router.get('/:id', protect, getUserProfile); 

module.exports = router;
