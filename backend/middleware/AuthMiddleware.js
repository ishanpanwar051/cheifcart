const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "belowisasecretkey";
require('dotenv').config();  // ✅ Load environment variables

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied, missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: 'Invalid token', error: error.message });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, admin privileges required' });
    }
};

module.exports = { verifyToken, isAdmin };
