const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  // Use a hardcoded secret if environment variable is not available
  const secret = process.env.JWT_SECRET || 'abc123def456ghi789jkl012mno345pqr';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = generateToken; 