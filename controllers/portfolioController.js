import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

// @desc    Get all projects
// @route   GET /api/portfolio/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const { 
      featured, 
      category, 
      status, 
      page = 1, 
      limit = 10,
      sort = '-priority,-createdAt'
    } = req.query;

    // Build filter object
    const filter = { isPublic: true };
    
    if (featured !== undefined) filter.featured = featured === 'true';
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get projects with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Project.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting projects'
    });
  }
};

// @desc    Get single project
// @route   GET /api/portfolio/projects/:id
// @access  Public
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      isPublic: true 
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { project }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting project'
    });
  }
};

// @desc    Create new project
// @route   POST /api/portfolio/projects
// @access  Private
export const createProject = async (req, res) => {
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

    const project = await Project.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: { project }
    });

  } catch (error) {
    console.error('Create project error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error creating project'
    });
  }
};

// @desc    Update project
// @route   PUT /api/portfolio/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
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

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: { project }
    });

  } catch (error) {
    console.error('Update project error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error updating project'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/portfolio/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting project'
    });
  }
};

// @desc    Get all projects for admin
// @route   GET /api/portfolio/admin/projects
// @access  Private
export const getAdminProjects = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get all projects (including private ones)
    const projects = await Project.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Project.countDocuments();

    res.status(200).json({
      status: 'success',
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting projects'
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/portfolio/featured
// @access  Public
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 
      featured: true, 
      isPublic: true 
    })
    .sort('-priority -createdAt')
    .limit(6);

    res.status(200).json({
      status: 'success',
      data: { projects }
    });

  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting featured projects'
    });
  }
};