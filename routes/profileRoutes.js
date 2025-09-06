import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile
} from '../controllers/profileController.js';

const router = express.Router();

// Profile validation rules
const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters'),
  
  body('email')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.includes('@')) {
        throw new Error('Please enter a valid email');
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone cannot exceed 20 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('website')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      // Basic URL validation
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('Website URL must start with http:// or https://');
      }
      return true;
    })
    .isLength({ max: 200 })
    .withMessage('Website URL cannot exceed 200 characters'),
  
  body('github')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('GitHub URL must start with http:// or https://');
      }
      return true;
    })
    .isLength({ max: 200 })
    .withMessage('GitHub URL cannot exceed 200 characters'),
  
  body('linkedin')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('LinkedIn URL must start with http:// or https://');
      }
      return true;
    })
    .isLength({ max: 200 })
    .withMessage('LinkedIn URL cannot exceed 200 characters'),
  
  body('twitter')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('Twitter URL must start with http:// or https://');
      }
      return true;
    })
    .isLength({ max: 200 })
    .withMessage('Twitter URL cannot exceed 200 characters'),
  
  body('instagram')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('Instagram URL must start with http:// or https://');
      }
      return true;
    })
    .isLength({ max: 200 })
    .withMessage('Instagram URL cannot exceed 200 characters'),
  
  body('profileImage')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('Profile image URL must start with http:// or https://');
      }
      return true;
    }),
  
  body('resume')
    .optional()
    .trim()
    .custom((value) => {
      if (value === '' || !value) return true; // Allow empty string
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('Resume URL must start with http:// or https://');
      }
      return true;
    }),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value')
];

// Routes
router.get('/', getProfile);
router.put('/', updateProfile);  // Temporarily removed validation

export default router;