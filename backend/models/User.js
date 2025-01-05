const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interests: [{ type: String, trim: true }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
