const jwt = require('jsonwebtoken');

// Checks if a valid token was sent with the request
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // looks like "Bearer eyJhbGc..."

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // splits "Bearer <token>" and grabs just the token part

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { id, role } to the request so later code can use it
    next(); // token is valid, let the request continue to the actual route
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Checks if the logged-in user has one of the allowed roles
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
}


module.exports = { verifyToken, requireRole };