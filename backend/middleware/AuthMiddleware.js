const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "belowisasecretkey";
require('dotenv').config();  // ✅ Load environment variables

/**
 * Verify JWT Token Middleware
 * Extracts token from Authorization header and verifies it
 * Sets req.user with userId and role
 */
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('[Auth] Missing or invalid token format');
        return res.status(401).json({ message: 'Access denied, missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        console.error('[Auth] JWT Verification Error:', error.message);
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

// Alias for backward compatibility
const verifyToken = authenticate;

/**
 * Admin Role Check Middleware
 * Must be used after authenticate middleware
 * Checks if user has admin role
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.warn('[Auth] Admin access denied for user:', req.user?.userId);
        res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
};

module.exports = { authenticate, verifyToken, isAdmin };
