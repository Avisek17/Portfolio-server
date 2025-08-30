import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide username and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting profile'
    });
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { email, username } = req.body;
    
    const admin = await Admin.findById(req.admin.id);
    
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    // Handle username update (optional)
    if (typeof username === 'string' && username.trim() && username !== admin.username) {
      const cleaned = username.trim();
      // Basic constraints similar to model
      if (cleaned.length < 3 || cleaned.length > 20 || !/^[a-zA-Z0-9_]+$/.test(cleaned)) {
        return res.status(400).json({
          status: 'error',
          message: 'Username must be 3-20 chars and only contain letters, numbers, or underscores'
        });
      }

      // Ensure uniqueness
      const existing = await Admin.findOne({ username: cleaned });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({
          status: 'error',
          message: 'Username is already taken'
        });
      }

      admin.username = cleaned;
    }

    // Handle email update (optional) - allow Mongoose validation to run
    if (email && email !== admin.email) {
      // Prevent duplicate email where possible
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== admin._id.toString()) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is already in use'
        });
      }
      admin.email = email;
    }
    
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error updating profile'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current and new password'
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error changing password'
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      data: {
        admin: {
          id: req.admin.id,
          username: req.admin.username,
          role: req.admin.role
        }
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error verifying token'
    });
  }
};
