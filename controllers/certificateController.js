import Certificate from '../models/Certificate.js';
import { validationResult } from 'express-validator';

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getAllCertificates = async (req, res) => {
  try {
    const { 
      category, 
      featured,
      level,
      sort = '-priority -issueDate'
    } = req.query;

    // Build filter object
    const filter = { isValid: true };
    
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (level) filter.level = level;

    const certificates = await Certificate.find(filter)
      .sort(sort);

    res.status(200).json({
      status: 'success',
      data: { 
        certificates,
        totalCount: certificates.length
      }
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting certificates'
    });
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      isValid: true 
    });

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { certificate }
    });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting certificate'
    });
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private
export const createCertificate = async (req, res) => {
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

  const certificate = await Certificate.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Certificate created successfully',
      data: { certificate }
    });

  } catch (error) {
    console.error('Create certificate error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error creating certificate'
    });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
export const updateCertificate = async (req, res) => {
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

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
  );

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Certificate updated successfully',
      data: { certificate }
    });

  } catch (error) {
    console.error('Update certificate error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error updating certificate'
    });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error deleting certificate'
    });
  }
};

// @desc    Get featured certificates
// @route   GET /api/certificates/featured
// @access  Public
export const getFeaturedCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      featured: true, 
      isValid: true 
    })
    .sort('-priority -issueDate')
    .limit(6);

    res.status(200).json({
      status: 'success',
      data: { certificates }
    });

  } catch (error) {
    console.error('Get featured certificates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting featured certificates'
    });
  }
};

// @desc    Get certificates by category
// @route   GET /api/certificates/category/:category
// @access  Public
export const getCertificatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const certificates = await Certificate.find({ 
      category, 
      isValid: true 
    })
    .sort('-priority -issueDate');

    res.status(200).json({
      status: 'success',
      data: { 
        certificates,
        category,
        count: certificates.length
      }
    });

  } catch (error) {
    console.error('Get certificates by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting certificates by category'
    });
  }
};