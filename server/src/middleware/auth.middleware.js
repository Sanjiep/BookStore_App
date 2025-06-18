import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectRoute = async (req, res, next) => {
    try {
       const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the user by ID from the token
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protectRoute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default protectRoute;