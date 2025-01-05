const mongoose = require('mongoose');
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

exports.sendFriendRequest = async (req, res) => {
    try {
        const { to } = req.body; 
        const from = req.user.id; 

        if (!mongoose.Types.ObjectId.isValid(to)) {
            return res.status(400).json({ error: 'Invalid recipient ID' });
        }

        const toObjectId = new mongoose.Types.ObjectId(to);

        const existingRequest = await FriendRequest.findOne({ from, to: toObjectId });
        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        const newRequest = new FriendRequest({ from, to: toObjectId });
        await newRequest.save();
        res.status(201).json({ message: 'Friend request sent' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.manageFriendRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; 

        const request = await FriendRequest.findById(requestId);
        if (!request) return res.status(404).json({ error: 'Friend request not found' });

        const fromUser = await User.findById(request.from);
        const toUser = await User.findById(request.to);

        if (!fromUser || !toUser) {
            return res.status(404).json({ error: 'User(s) not found' });
        }

        if (!fromUser.friends) fromUser.friends = [];
        if (!toUser.friends) toUser.friends = [];

        if (action === 'accept') {
            fromUser.friends.push(toUser._id);
            toUser.friends.push(fromUser._id);
            await fromUser.save();
            await toUser.save();

            request.status = 'accepted';
        } else if (action === 'reject') {
            await FriendRequest.findByIdAndDelete(requestId);
            return res.json({ message: 'Friend request rejected and deleted' });
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await request.save();

        res.json({ message: `Friend request ${action}ed successfully` });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await FriendRequest.find({ to: userId }).populate('from', 'username');
        const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
        res.json({ requests, pendingRequestsCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friends', 'username email');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getFriendRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

 
        const user = await User.findById(userId).populate('friends', 'friends interests');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const friendIds = user.friends.map((friend) => friend._id.toString());

        const potentialFriends = new Set();
        for (const friend of user.friends) {
            for (const potential of friend.friends) {
                if (
                    !friendIds.includes(potential.toString()) &&
                    potential.toString() !== userId
                ) {
                    potentialFriends.add(potential.toString());
                }
            }
        }

        const interestBasedUsers = await User.find({
            _id: { $nin: [...friendIds, userId] }, 
            interests: { $in: user.interests },
        }).select('username interests');


        const combinedRecommendations = Array.from(new Set([
            ...Array.from(potentialFriends),
            ...interestBasedUsers.map((user) => user._id.toString()),
        ]));

 
        const recommendedUsers = await User.find({
            _id: { $in: combinedRecommendations },
        }).select('username interests');

        res.json(recommendedUsers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateInterests = async (req, res) => {
    try {
        const userId = req.user.id;
        const { interests } = req.body;

        const user = await User.findByIdAndUpdate(userId, { interests }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getFriendsList = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('friends', 'username email');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user.friends);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body; 
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

        res.json({ message: 'Friend removed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


