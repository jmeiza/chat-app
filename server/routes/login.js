import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post('/login', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all the required fields.'});
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
           return res.status(409).json({ message: 'Could not find email '});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(409).json({ message: 'Wrong password '});
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ 
            message: 'Login successful',
            token: token
        });
    }
    catch (error){
        console.error('Login error', error);
        res.status(500).json({ message: 'Server error. Please try again later'});
    }
})


export default router;