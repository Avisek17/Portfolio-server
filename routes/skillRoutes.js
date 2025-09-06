import express from 'express';
import { body } from 'express-validator';
import {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getFeaturedSkills,
  getSkillsByCategory
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Skill validation rules
const skillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 50 })
    .withMessage('Skill name cannot exceed 50 characters'),
  body('category')
    .isIn(['frontend', 'backend', 'database', 'tools', 'languages', 'frameworks', 'other'])
    .withMessage('Invalid skill category'),
  body('proficiency')
    .isInt({ min: 1, max: 100 })
    .withMessage('Proficiency must be between 1 and 100'),
  body('yearsOfExperience')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
  body('priority')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Priority must be between 0 and 10'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex code')
];

// Public routes
router.get('/', getAllSkills);
router.get('/featured', getFeaturedSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/:id', getSkill);

// Admin routes (temporarily without authentication)
router.post('/', createSkill);  // Removed validation temporarily
router.put('/:id', updateSkill);  // Removed validation temporarily
router.delete('/:id', deleteSkill);

export default router;