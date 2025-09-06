import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  technologies: [{
    type: String,
    required: true,
    trim: true
  }],
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['web', 'mobile', 'desktop', 'other'],
    default: 'web'
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
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
  links: {
    github: {
      type: String,
      trim: true
    },
    live: {
      type: String,
      trim: true
    },
    demo: {
      type: String,
      trim: true
    }
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  client: {
    type: String,
    trim: true
  },
  teamSize: {
    type: Number,
    min: 1,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: true
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
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
projectSchema.index({ featured: -1, priority: -1 });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ technologies: 1 });

export default mongoose.model('Project', projectSchema);