import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Message from '../models/message.js';
import Chat from '../models/chat.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { chatId, content } = req.body;
    
    if (!chatId || !content) {
        return res.status(400).json({ error: 'chatId and content are required.' });
    }

    try {
        const chatExists= await Chat.findById(chatId);
        if (!chatExists) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        
        const newMessage = await Message.create({
            chat: chatId,
            sender: req.user.id,
            content,
        });
        
        try {
            await newMessage.populate('sender', '-password');
            await newMessage.populate('chat');
            const populatedMessage = newMessage;
                
            res.status(201).json(populatedMessage);
        }
        catch (populateError) {
            console.error('Populate error:', popErr);
            res.status(201).json(newMessage);
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

router.get('/:chatId', authMiddleware, async (req, res) => {
    const { chatId } = req.params;

    try {
        const chatExists = await Chat.findById(chatId);
        if (!chatExists) {
        return res.status(404).json({ error: 'Chat not found.' });
        }
        
        const messages = await Message.find({ chat: chatId }).populate('sender', '-password').populate('chat');
        console.log('Fetched messages:', messages);
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages'});
    }
})

export default router;