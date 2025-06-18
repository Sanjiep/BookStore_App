import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new book
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

// Get all books
router.get('/', protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .skip(skip)
            .limit(limit)
            .populate('user', 'name email'); // Populate user details

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.error('Error in fetching book:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
})

// delete a book
router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const bookId = await Book.findById(req.params.id);
        if (!bookId) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the user is authorized to delete the book
        if (bookId.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this book' });
        }

        // Delete the image from cloudinary
        if (bookId.image && bookId.image.includes('cloudinary')) {
            try {
                const publicId = bookId.image.split('/').pop().split('.')[0]; // Extract public ID from the URL
                await cloudinary.uploader.destroy(publicId);

            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
            }
        }

        await bookId.deleteOne();

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error in deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// get  books by logged in user
router.get('/user', protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
        res.status(200).json(books);
    } catch (error) {
        console.error('Error in fetching user books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default router;