import express from 'express';
import { body } from 'express-validator';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getAdminProjects,
  getFeaturedProjects
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Project validation rules
const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  body('category')
    .isIn(['web', 'mobile', 'desktop', 'other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['completed', 'in-progress', 'planned'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10'),
  body('links.github')
    .optional()
    .isURL()
    .withMessage('GitHub link must be a valid URL'),
  body('links.live')
    .optional()
    .isURL()
    .withMessage('Live link must be a valid URL'),
  body('links.demo')
    .optional()
    .isURL()
    .withMessage('Demo link must be a valid URL')
];

// Public routes
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProject);
router.get('/featured', getFeaturedProjects);

// Admin routes (temporarily without authentication)
router.get('/admin/projects', getAdminProjects);
router.post('/projects', createProject);  // Removed validation temporarily
router.put('/projects/:id', updateProject);  // Removed validation temporarily
router.delete('/projects/:id', deleteProject);

export default router;