import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Admin Schema (copy from models/Admin.js)
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    // Read desired credentials from env (with sensible defaults)
    const targetUsername = process.env.ADMIN_USERNAME || 'admin';
    const targetPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const targetEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';

    // Check if a user exists with the same username or email
    const existingByUsername = await Admin.findOne({ username: targetUsername });
    const existingByEmail = await Admin.findOne({ email: targetEmail });
    if (existingByUsername || existingByEmail) {
      console.log('Admin user already exists with the provided username or email.');
      console.log(`  Username: ${existingByUsername ? 'taken' : 'available'}`);
      console.log(`  Email: ${existingByEmail ? 'taken' : 'available'}`);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new Admin({
      username: targetUsername,
      password: targetPassword,
      email: targetEmail,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Username:', targetUsername);
    console.log('Password:', targetPassword);
    console.log('Email   :', targetEmail);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdminUser();
