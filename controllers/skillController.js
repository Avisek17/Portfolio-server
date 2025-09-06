import Skill from '../models/Skill.js';
import { validationResult } from 'express-validator';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (req, res) => {
  try {
    const { 
      category, 
      featured,
      sort = '-priority -proficiency'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const skills = await Skill.find(filter)
      .populate('projects', 'title category')
      .sort(sort);

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      data: { 
        skills,
        groupedSkills,
        totalCount: skills.length
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting skills'
    });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('projects', 'title description category links');

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { skill }
    });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting skill'
    });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    // Check validation errors (temporarily disabled)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: 'Validation failed',
    //     errors: errors.array()
    //   });
    // }

    const skill = await Skill.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Skill created successfully',
      data: { skill }
    });

  } catch (error) {
    console.error('Create skill error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Skill with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error creating skill'
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    // Check validation errors (temporarily disabled)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: 'Validation failed',
    //     errors: errors.array()
    //   });
    // }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Skill updated successfully',
      data: { skill }
    });

  } catch (error) {
    console.error('Update skill error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Skill with this name already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error updating skill'
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        status: 'error',
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting skill'
    });
  }
};

// @desc    Get featured skills
// @route   GET /api/skills/featured
// @access  Public
export const getFeaturedSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ 
      featured: true, 
      isActive: true 
    })
    .sort('-priority -proficiency')
    .limit(8);

    res.status(200).json({
      status: 'success',
      data: { skills }
    });

  } catch (error) {
    console.error('Get featured skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting featured skills'
    });
  }
};

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
export const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const skills = await Skill.find({ 
      category, 
      isActive: true 
    })
    .sort('-priority -proficiency');

    res.status(200).json({
      status: 'success',
      data: { 
        skills,
        category,
        count: skills.length
      }
    });

  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting skills by category'
    });
  }
};