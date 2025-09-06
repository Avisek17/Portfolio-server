import express from 'express';
import { body } from 'express-validator';
import {
  getAllCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getFeaturedCertificates,
  getCertificatesByCategory
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Certificate validation rules
const certificateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Certificate title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Certificate issuer is required')
    .isLength({ max: 100 })
    .withMessage('Issuer cannot exceed 100 characters'),
  body('issueDate')
    .isISO8601()
    .withMessage('Issue date must be a valid date'),
  body('expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  body('category')
    .isIn(['technical', 'professional', 'academic', 'language', 'other'])
    .withMessage('Invalid certificate category'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid certificate level'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('credentialUrl')
    .optional()
    .isURL()
    .withMessage('Credential URL must be a valid URL')
];

// Public routes
router.get('/', getAllCertificates);
router.get('/featured', getFeaturedCertificates);
router.get('/category/:category', getCertificatesByCategory);
router.get('/:id', getCertificate);

// Admin routes (temporarily without authentication)
router.post('/', createCertificate);  // Removed validation temporarily
router.put('/:id', updateCertificate);  // Removed validation temporarily
router.delete('/:id', deleteCertificate);

export default router;