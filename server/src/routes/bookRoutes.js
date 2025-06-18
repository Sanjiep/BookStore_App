import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        if (!title || !caption || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // save image url to mongoDB

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save();

        res.status(201).json({ message: 'Book created successfully', book: newBook });

    } catch (error) {
        console.error('Error in book route:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
})

export default router;