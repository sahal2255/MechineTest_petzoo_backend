const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Decoded user:', user); // Log decoded user for debugging

    req.user = user; // Attach user information to req.user
    next(); // Proceed to the next middleware/controller
  });
};

module.exports = authMiddleware;
