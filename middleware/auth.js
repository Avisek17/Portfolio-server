import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.error('Auth middleware: no token provided');
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Debug log: token decoded
      console.debug('Auth middleware: token decoded, admin id=', decoded && decoded.id);

      // Get admin from token
      const admin = await Admin.findById(decoded.id);

      if (!admin) {
        console.error(`Auth middleware: token valid but admin not found (id=${decoded && decoded.id})`);
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but admin not found'
        });
      }

      if (!admin.isActive) {
        console.error(`Auth middleware: admin account deactivated (id=${decoded && decoded.id})`);
        return res.status(401).json({
          status: 'error',
          message: 'Admin account is deactivated'
        });
      }

      // Add admin to request object
      req.admin = admin;
      next();

    } catch (tokenError) {
      // Surface the jwt verify error message without printing the token
      console.error('Auth middleware: token verification failed:', tokenError && tokenError.message);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};