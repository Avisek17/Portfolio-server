import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, trim: true },
  url: { type: String, required: true },
  title: { type: String, trim: true },
  designation: { type: String, trim: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;