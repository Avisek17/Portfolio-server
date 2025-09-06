import express from 'express';
import { 
  createContactMessage, 
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage 
} from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can submit a contact form
router.post('/', createContactMessage);

// Protected routes - admin only
router.get('/', protect, getContactMessages);
router.patch('/:id/read', protect, markMessageAsRead);
router.delete('/:id', protect, deleteContactMessage);

export default router;