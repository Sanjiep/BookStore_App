import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {

    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MongoDB connected successfully');
        // You can add additional configurations or initializations here if needed
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}
