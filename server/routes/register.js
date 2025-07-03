import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all the required fields.'});
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email or username is taken'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: 'Registered successfuly!' });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error. Please try again later'});
    }
})


export default router;