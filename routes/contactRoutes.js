import express from 'express';
import { 
  createContactMessage, 
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage 
} from '../controllers/contactController.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit a contact form with validation
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 140 }).withMessage('Subject too long'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message too long')
], validate, createContactMessage);

// Protected routes - admin only
router.get('/', protect, getContactMessages);
router.patch('/:id/read', protect, markMessageAsRead);
router.delete('/:id', protect, deleteContactMessage);

export default router;
