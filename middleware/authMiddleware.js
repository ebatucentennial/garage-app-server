const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

exports.protect = async (req, res, next) => {
    let token;

    // Check for the Authorization header and ensure it starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract token after "Bearer"

            // Decode token to get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Seller.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token validation error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};
