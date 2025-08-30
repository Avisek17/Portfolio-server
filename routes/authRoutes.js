import express from 'express';
import { body } from 'express-validator';
import {
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Login validation rules
const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Profile update validation rules
const profileValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Password change validation rules
const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase, one uppercase, and one number')
];

// Public routes
router.post('/login', loginValidation, login);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/profile', getProfile);
router.put('/profile', profileValidation, updateProfile);
router.put('/change-password', passwordValidation, changePassword);
router.get('/verify', verifyToken);

export default router;
