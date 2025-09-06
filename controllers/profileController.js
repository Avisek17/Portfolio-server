import Profile from '../models/Profile.js';
import { validationResult } from 'express-validator';

// @desc    Get profile
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Return empty profile structure if none exists
      return res.status(200).json({
        status: 'success',
        data: {
          name: '',
          title: '',
          bio: '',
          contactDescription: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          profileImage: '',
          resume: ''
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error getting profile'
    });
  }
};

// @desc    Update or create profile
// @route   PUT /api/profile
// @access  Private (Admin only)
export const updateProfile = async (req, res) => {
  try {
    // Check for validation errors (temporarily disabled)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: 'Validation failed',
    //     errors: errors.array()
    //   });
    // }

    const {
      name,
      title,
      bio,
  contactDescription,
      email,
      phone,
      location,
      website,
      github,
      linkedin,
      twitter,
      instagram,
      profileImage,
      resume,
      isPublic
    } = req.body;

    // Find existing profile or create new one
    let profile = await Profile.findOne();
    
    if (profile) {
      // Update existing profile
      if (name !== undefined) profile.name = name;
      if (title !== undefined) profile.title = title;
      if (bio !== undefined) profile.bio = bio;
  if (contactDescription !== undefined) profile.contactDescription = contactDescription;
      if (email !== undefined) profile.email = email;
      if (phone !== undefined) profile.phone = phone;
      if (location !== undefined) profile.location = location;
      if (website !== undefined) profile.website = website;
      if (github !== undefined) profile.github = github;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (twitter !== undefined) profile.twitter = twitter;
      if (instagram !== undefined) profile.instagram = instagram;
      if (profileImage !== undefined) profile.profileImage = profileImage;
      if (resume !== undefined) profile.resume = resume;
      if (isPublic !== undefined) profile.isPublic = isPublic;
      
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({
        name: name || '',
        title: title || '',
        bio: bio || '',
  contactDescription: contactDescription || '',
        email: email || '',
        phone: phone || '',
        location: location || '',
        website: website || '',
        github: github || '',
        linkedin: linkedin || '',
        twitter: twitter || '',
        instagram: instagram || '',
        profileImage: profileImage || '',
        resume: resume || '',
        isPublic: isPublic !== undefined ? isPublic : true
      });
      
      await profile.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Server error updating profile'
    });
  }
};