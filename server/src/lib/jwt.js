import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '15d' } // Token will expire in 15 days
    )
}

export default generateToken;