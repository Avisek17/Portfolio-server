import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  issuer: {
    type: String,
    required: [true, 'Certificate issuer is required'],
    trim: true,
    maxlength: [100, 'Issuer cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required']
  },
  expiryDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true
  },
  // Store related skills as simple strings (names) for flexibility
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],
  category: {
    type: String,
    required: [true, 'Certificate category is required'],
    enum: ['technical', 'professional', 'academic', 'language', 'other'],
    default: 'technical'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  featured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isValid: {
    type: Boolean,
    default: true
  },
  image: {
    url: String,
    alt: String
  },
  // Optional attached certificate file (PDF/Image/other)
  file: {
    url: { type: String, trim: true },
    originalName: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    size: { type: Number, min: 0 },
    filename: { type: String, trim: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
certificateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for checking if certificate is expired
certificateSchema.virtual('isExpired').get(function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Create indexes for better query performance
certificateSchema.index({ featured: -1, priority: -1 });
certificateSchema.index({ category: 1, level: 1 });
certificateSchema.index({ issueDate: -1 });

export default mongoose.model('Certificate', certificateSchema);