import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const protectCompany = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.company = await Company.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.json({ success: false, message: 'Not Authorized' });
    }
}


export const protectUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("❌ No token found in headers");
        return res.status(401).json({ success: false, message: 'Not Authorized - No Token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Ensure it's a user token
        if (decoded.type !== 'user') {
            return res.status(403).json({ success: false, message: 'Invalid token type for user' });
        }

        console.log("✅ Decoded Token in Middleware:", decoded);

        req.auth = { userId: decoded.id };

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;  // Optional: Attach full user data
        next();
    } catch (error) {
        console.error("❌ JWT Error:", error.message);
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

