import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  contactDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Contact description cannot exceed 500 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true,
    maxlength: [200, 'Website URL cannot exceed 200 characters']
  },
  github: {
    type: String,
    trim: true,
    maxlength: [200, 'GitHub URL cannot exceed 200 characters']
  },
  linkedin: {
    type: String,
    trim: true,
    maxlength: [200, 'LinkedIn URL cannot exceed 200 characters']
  },
  twitter: {
    type: String,
    trim: true,
    maxlength: [200, 'Twitter URL cannot exceed 200 characters']
  },
  instagram: {
    type: String,
    trim: true,
    maxlength: [200, 'Instagram URL cannot exceed 200 characters']
  },
  profileImage: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one profile document exists
profileSchema.index({}, { unique: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;