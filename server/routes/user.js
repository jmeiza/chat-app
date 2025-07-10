import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (error){
        res.status(500).json({ error: 'Failed to fetch the user info' });
    }
});

export default router;