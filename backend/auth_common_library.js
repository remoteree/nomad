const jwt = require('jsonwebtoken');

// JSON web-token auth
const getTokenFromHeader = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Split 'Bearer <token>'
    return token;
  };
  
  const verifyAndDecodeToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  };
  
  const authenticateRequest = (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const decoded = verifyAndDecodeToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
  
    // Attach user details to the request
    req.user = decoded; // Assuming your payload includes user details
  
    next();
  };

  module.exports = {authenticateRequest};