import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Chat from '../models/chat.js';
import User from '../models/user.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { username } = req.body;
    const currentUserId = req.user.id;

    try {
        //Find the user by their username
        const targetUser = await User.findOne({ username });

        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = targetUser._id;

        // Prevent chatting with yourself
        if (userId.toString() === currentUserId) {
            return res.status(400).json({ error: "You can't chat with yourself" });
        }

        // Check if the chat exists
        let chat = await Chat.findOne({
            isGroupChat: false,
            members: { $all: [currentUserId, userId], $size: 2}
        }).populate('members', '-password');

    
        if (!chat) {
            chat = await Chat.create({ members: [currentUserId, userId] });
            await chat.populate('members', '-password');
        }

        res.status(200).json(chat);
    }
    catch (err) {
        console.error('Chat creation error:', err);
        res.status(500).json({ error: 'Chat error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({
            members: {$in: [req.user.id] }
        }).populate('members', '-password').sort({ updateAt: -1 });

        res.status(200).json(chats);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

export default router;
