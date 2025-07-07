import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Chat from '../models/chat.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    try {
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
