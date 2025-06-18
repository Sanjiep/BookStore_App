import express from 'express';
import User from '../models/User.js';
import generateToken from '../lib/jwt.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ $or: [{ username }] });

        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ $or: [{ email }] });

        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // generating random user profile image
        const profileImage = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;

        // Create a new user
        const newUser = new User({
            username,
            email,
            password,
            profileImage,
        });

        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage
            },
        });

    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Generate JWT token
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
        });

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
})

export default router;