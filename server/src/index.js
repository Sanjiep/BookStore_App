import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js'
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';

job.start(); // Start the cron job
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);   
    connectDB();
})