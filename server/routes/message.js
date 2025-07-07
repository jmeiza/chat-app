import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Message from '../models/message.js';

const router = express.Router();

router.post('/messages', verifyToken, async (req, res) => {
    const { chatId, content } = req.body;
    
    if (!chatId || !content) {
        return res.status(400).json({ error: 'chatId and content are required.' });
    }

    try {
        const newMessage = await Message.create({
            chat: chatId,
            sender: req.user.id,
            content,
        });
        // Use .execpopulate() when you want to populate a document

        const populatedMessage = await newMessage.populate('sender', '-password').populate('chat').execPopulate();

        res.status(201).json(populatedMessage);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

router.get('/messages/:chatId', verifyToken, async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chat: chatId }).populate('sender', '-password').populate('chat');

        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages'});
    }
})