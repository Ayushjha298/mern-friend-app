const User = require('../models/User');

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query; 
        const users = await User.find({
            username: { $regex: query, $options: 'i' },
        }).select('-password'); 
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friends', 'username');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


