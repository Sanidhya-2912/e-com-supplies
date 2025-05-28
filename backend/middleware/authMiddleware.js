const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  try {
    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token with the same fallback as in generateToken.js
        const secret = process.env.JWT_SECRET || 'abc123def456ghi789jkl012mno345pqr';
        const decoded = jwt.verify(token, secret);

        // Get user from the token
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          console.error('JWT valid but user not found:', decoded.id);
          return res.status(401).json({ 
            message: 'User associated with this token no longer exists'
          });
        }

        // Set user in request object
        req.user = user;
        return next();
      } catch (error) {
        console.error('JWT verification error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Session expired, please log in again' });
        }
        
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Invalid token, please log in again' });
        }
        
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    // Check for token in query string (for API key style authentication)
    if (req.query.token) {
      try {
        token = req.query.token;
        const secret = process.env.JWT_SECRET || 'abc123def456ghi789jkl012mno345pqr';
        const decoded = jwt.verify(token, secret);
        req.user = await User.findById(decoded.id).select('-password');
        return next();
      } catch (error) {
        console.error('Query token verification error:', error.message);
        return res.status(401).json({ message: 'Not authorized, query token failed' });
      }
    }

    // If no token found in headers or query
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  } catch (error) {
    console.error('Unexpected auth error:', error);
    return res.status(500).json({ message: 'Server authentication error' });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin }; 