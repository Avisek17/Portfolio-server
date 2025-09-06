import Resume from '../models/Resume.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: resumes });
  } catch (error) {
    console.error('List resumes error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to list resumes' });
  }
};

export const createResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });

    const resumeUrl = `/uploads/${req.file.filename}`;

    const resume = new Resume({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: resumeUrl,
      title: req.body.title || req.file.originalname,
      designation: req.body.designation || '',
      uploadedBy: req.admin ? req.admin._id : undefined
    });

    await resume.save();

    res.json({ status: 'success', data: resume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create resume' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ filename: req.params.filename });
    if (!resume) return res.status(404).json({ status: 'error', message: 'Resume not found' });

    // remove file from uploads (use module-relative uploads dir)
    const filePath = path.join(__dirname, '../uploads', resume.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.deleteOne({ _id: resume._id });

    res.json({ status: 'success', message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume (db) error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete resume' });
  }
};

export const deleteResumeById = async (req, res) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ status: 'error', message: 'Resume not found' });

    // remove file from uploads (use module-relative uploads dir)
    const filePath = path.join(__dirname, '../uploads', resume.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.deleteOne({ _id: resume._id });

    res.json({ status: 'success', message: 'Resume deleted' });
  } catch (error) {
    console.error('Delete resume by id error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete resume' });
  }
};