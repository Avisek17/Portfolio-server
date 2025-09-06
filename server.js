import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import connectDB, { getDbState } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic required env validation before DB connect
dotenv.config();
// If full URI not provided, attempt to build it from discrete credential parts
if (!process.env.MONGODB_URI) {
  const u = process.env.MONGODB_USER;
  const p = process.env.MONGODB_PASSWORD;
  const h = process.env.MONGODB_HOST; // e.g. portfolio.ay86cb3.mongodb.net
  const d = process.env.MONGODB_DB;   // e.g. portfolio_db
  if (u && p && h && d) {
    const encoded = encodeURIComponent(p);
    const appName = process.env.MONGODB_APPNAME || 'Portfolio';
    const authSource = process.env.MONGODB_AUTHSOURCE ? `&authSource=${encodeURIComponent(process.env.MONGODB_AUTHSOURCE)}` : '';
    process.env.MONGODB_URI = `mongodb+srv://${u}:${encoded}@${h}/${d}?retryWrites=true&w=majority&appName=${appName}${authSource}`;
    console.log('🔐 MongoDB URI constructed from discrete env variables (password not printed).');
  }
}

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
  console.warn(`⚠️  Missing required environment variables: ${missing.join(', ')}. Startup will continue but this is unsafe for production.`);
}

// Production hardening warnings
if (process.env.NODE_ENV === 'production') {
  if (process.env.ADMIN_PASSWORD && /^(admin|admin123)$/i.test(process.env.ADMIN_PASSWORD)) {
    console.warn('🛑 Insecure ADMIN_PASSWORD detected. Change it and remove ADMIN_* vars after seeding.');
  }
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 48) {
    console.warn('🛑 JWT_SECRET is too short (<48 chars). Rotate to a 64+ char random secret ASAP.');
  }
  if (process.env.ALLOW_DEV_ORIGINS === 'true') {
    console.warn('⚠️  ALLOW_DEV_ORIGINS=true in production. Remove this once local testing is finished.');
  }
  if (/mongodb\+srv:\/\/.*:.*@/i.test(process.env.MONGODB_URI || '') && process.env.MONGODB_SUPPRESS_URI_WARNING !== 'true') {
    console.warn('⚠️  MongoDB URI contains embedded credentials. Prefer discrete vars (MONGODB_USER/PASSWORD/HOST/DB) and rotate least-privilege user periodically. Set MONGODB_SUPPRESS_URI_WARNING=true to silence this warning.');
  }
}

// We'll connect to MongoDB before starting the server (see bottom)

const app = express();
const PORT = process.env.PORT || 5001;



// Trust proxy (needed for correct protocol/IP behind Nginx)
app.set('trust proxy', 1);

// Security middleware (customize as needed; CSP can be added later if embedding external assets is controlled)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Content Security Policy (adjust if you add external CDNs)
const strictCsp = process.env.CSP_STRICT === 'true';
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'"],
      styleSrc: strictCsp ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',').map(o=>o.trim()) : [])],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: []
    }
  })
);

// Additional security headers beyond Helmet defaults
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', "geolocation=(), microphone=(), camera=()");
  // Conditionally add HSTS (only when served via HTTPS and explicitly enabled)
  if (process.env.ENABLE_HSTS === 'true' && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});

// Compression (gzip) – Nginx will usually handle this, but keep as fallback
app.use(compression());

// HTTP request logging (skip in test)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.LOG_FORMAT || 'combined'));
}

// Rate limiting (basic) – consider separate stricter limiter for auth/login
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration (supports comma-separated FRONTEND_URLS)
const rawOrigins = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '';
let allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

// Always allow explicit dev origins when not in production OR when ALLOW_DEV_ORIGINS=true
const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_ORIGINS === 'true') {
  devOrigins.forEach(o => { if (!allowedOrigins.includes(o)) allowedOrigins.push(o); });
}

// Fallback if none specified at all
if (allowedOrigins.length === 0) {
  allowedOrigins = devOrigins.slice();
}

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // non-browser / same-origin
    if (allowedOrigins.includes(origin)) return cb(null, origin); // explicitly echo allowed origin
    if (process.env.DEBUG_CORS === 'true') console.warn(`CORS denied for origin: ${origin}`);
    return cb(null, false);
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));
// Explicitly handle preflight for all routes
app.options('*', cors());

// Body parsing middleware (single urlencoded call)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Serve static uploads (ensure Nginx can alternatively handle this)
app.use('/uploads', (req, res, next) => {
  const reqOrigin = req.headers.origin;
  if (reqOrigin && allowedOrigins.includes(reqOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', reqOrigin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || 'http://localhost:3000');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'private, max-age=60');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Force download for certificate-like files if desired (optional):
    if (/\.(pdf|docx?|pptx?)$/i.test(filePath)) {
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    db: getDbState()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

let server;
const startServer = (port, attempt = 0) => {
  server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (process.env.NODE_ENV !== 'production' && attempt < 5) {
        const newPort = port + 1;
        console.warn(`⚠️  Port ${port} in use. Trying ${newPort}...`);
        startServer(newPort, attempt + 1);
      } else {
        console.error(`❌ Port ${port} is already in use and auto-retry aborted.`);
        process.exit(1);
      }
    } else {
      console.error('❌ Server start error:', err);
      process.exit(1);
    }
  });
};

// Connect DB then start server
connectDB().then(() => {
  startServer(parseInt(PORT, 10));
}).catch(err => {
  console.error('Failed to start server due to DB connection error:', err.message);
});

// Graceful shutdown helpers
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
  // Force exit after 10s
  setTimeout(() => process.exit(1), 10000).unref();
};
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

export default app;
