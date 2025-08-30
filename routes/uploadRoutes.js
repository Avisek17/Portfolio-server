import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { protect } from '../middleware/auth.js';
import { createResume, listResumes, deleteResume, deleteResumeById } from '../controllers/resumeController.js';

const router = express.Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    // Use different prefix for resumes
    const prefix = file.fieldname === 'resume' ? 'resume' : 'image';
    cb(null, `${prefix}-${uniqueSuffix}${extension}`);
  }
});

// File filter to only allow images (for general image uploads)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with size limit (15MB)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit - increased for larger images
  }
});

// Upload image endpoint
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Return the file path relative to the server
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Set CORS headers for the response
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    res.json({
      status: 'success',
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image: ' + error.message
    });
  }
});

// Delete image endpoint
router.delete('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        status: 'success',
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image: ' + error.message
    });
  }
});

// Configure multer for resume uploads (allow PDFs and common image formats, 10MB)
const resumeFileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or image files (jpg, png, gif) are allowed for resumes!'), false);
  }
};

const resumeUpload = multer({
  storage: storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for resumes
  }
});

// Upload resume endpoint - creates DB entry via controller
router.post('/resume', protect, resumeUpload.single('resume'), createResume);

// List resumes (public) - returns DB records
router.get('/resume', listResumes);

// Delete resume (protected) - removes DB record and file
// Delete by filename (legacy)
router.delete('/resume/:filename', protect, deleteResume);
// Delete by id (preferred)
router.delete('/resume/id/:id', protect, deleteResumeById);

// Download resume file by filename with proper headers
router.get('/resume/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', message: 'File not found' });
  }
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  return res.download(filePath, filename);
});

// --- Certificate file uploads (PDF, images, etc.) ---
const certFileFilter = (req, file, cb) => {
  // Accept any file type for certificates; validate size only
  cb(null, true);
};

const certUpload = multer({
  storage,
  fileFilter: certFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB for certificates
});

// Upload certificate file (returns metadata for attaching to Certificate model)
router.post('/certificate', protect, certUpload.single('certificate'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No certificate file provided' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    return res.json({
      status: 'success',
      message: 'Certificate file uploaded successfully',
      file: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    return res.status(500).json({ status: 'error', message: 'Failed to upload certificate: ' + error.message });
  }
});

// Download certificate file by filename; sets appropriate headers
router.get('/certificate/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', message: 'File not found' });
  }
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  return res.download(filePath, filename);
});

export default router;
