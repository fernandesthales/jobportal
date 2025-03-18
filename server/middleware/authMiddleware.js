import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

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


//Clerk Middleware for User
export const protectUser = ClerkExpressWithAuth({
    onAuthSuccess: (req, res, next) => {
        console.log("✅ Clerk Token Verified Successfully");
        console.log("Decoded Token Data:", req.auth);

        // Extract the user ID from `sub`
        req.auth = { userId: req.auth.sub };
        next();
    },
    onAuthFailed: (req, res) => {
        console.error("❌ Clerk Token Verification Failed");
        res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }
});

