# Portfolio Backend API

A robust backend API for managing portfolio data built with Node.js, Express, and MongoDB following the MVC (Model-View-Controller) pattern.

## 🚀 Features

- **RESTful API** for portfolio management
- **JWT Authentication** for admin panel
- **MongoDB** with Mongoose ODM
- **MVC Architecture** for clean code organization
- **Input Validation** with express-validator
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Error Handling** with custom middleware
- **Database Seeding** for initial data

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `PUT /api/auth/profile` - Update admin profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Projects
- `GET /api/portfolio/projects` - Get all public projects
- `GET /api/portfolio/projects/:id` - Get single project
- `GET /api/portfolio/featured` - Get featured projects
- `GET /api/portfolio/admin/projects` - Get all projects (admin)
- `POST /api/portfolio/projects` - Create project (admin)
- `PUT /api/portfolio/projects/:id` - Update project (admin)
- `DELETE /api/portfolio/projects/:id` - Delete project (admin)

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/:id` - Get single skill
- `GET /api/skills/featured` - Get featured skills
- `GET /api/skills/category/:category` - Get skills by category
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:id` - Get single certificate
- `GET /api/certificates/featured` - Get featured certificates
- `GET /api/certificates/category/:category` - Get certificates by category
- `POST /api/certificates` - Create certificate (admin)
- `PUT /api/certificates/:id` - Update certificate (admin)
- `DELETE /api/certificates/:id` - Delete certificate (admin)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=dev_only_change_me
JWT_EXPIRE=7d
# (Optionally for FIRST seed ONLY)
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=StrongTempPassword123!
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup
Make sure MongoDB is running, then seed the database:

```bash
npm run seed
```

This will create:
- Admin user (username: `admin`, password: `admin123`)
- Sample projects, skills, and certificates

### 4. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── portfolioController.js # Project management
│   ├── skillController.js   # Skills management
│   └── certificateController.js # Certificates management
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── Admin.js            # Admin user model
│   ├── Project.js          # Project model
│   ├── Skill.js            # Skill model
│   └── Certificate.js      # Certificate model
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── portfolioRoutes.js  # Project routes
│   ├── skillRoutes.js      # Skill routes
│   └── certificateRoutes.js # Certificate routes
├── scripts/
│   └── seedDatabase.js     # Database seeding script
├── .env                    # Environment variables
├── package.json
└── server.js              # Main application file
```

## 🔒 Security Features

- **JWT Authentication** for admin routes
- **Password Hashing** with bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Input Validation** and sanitization
- **Security Headers** with Helmet
- **Error Handling** without exposing sensitive data

## 🗄️ Database Schema

### Admin Model
- Username, email, password (hashed)
- Role-based access control
- Login tracking

### Project Model
- Title, descriptions, technologies
- Categories, status, priority
- Links (GitHub, live demo)
- Images and metadata
- Featured/public flags

### Skill Model
- Name, category, proficiency level
- Years of experience
- Icons, colors, descriptions
- Project associations
- Featured/priority flags

### Certificate Model
- Title, issuer, dates
- Credential ID and URL
- Categories and levels
- Skill associations
- Validation status

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Heroku**: Easy deployment with Git
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS/Azure**: Cloud deployment

### Docker Compose (Recommended)
1. Copy `docker-compose.yml` and `infra/nginx/default.conf` to your server.
2. Create `portfolio-backend/.env.production` from `.env.example.production` (never commit real secrets).
3. Run:
  ```bash
  docker compose pull || true
  docker compose build
  docker compose up -d
  ```
4. Seed admin once: `docker compose exec backend node createAdmin.js` then remove `ADMIN_*` lines and restart backend.
5. Issue SSL certs (Certbot) and uncomment HTTPS block + redirect in Nginx config.
6. (Optional) Enable `ENABLE_HSTS=true` and later `CSP_STRICT=true` after removing inline styles.
7. Run smoke test: `SMOKE_BASE_URL=https://your-domain docker compose exec backend npm run smoke-test`.

Persistent uploads: An `uploads` named volume is defined so files survive container recreation.

### GitHub Actions Automated Deploy
Provided workflow: `.github/workflows/deploy-production.yml`.

Secrets required:
| Secret | Purpose |
|--------|---------|
| DEPLOY_HOST | SSH host/IP |
| DEPLOY_USER | SSH user |
| DEPLOY_KEY  | Private key (PEM) |
| DEPLOY_PATH | Absolute deploy directory on server |
| MONGODB_URI or discrete vars | Database access |
| JWT_SECRET | Auth secret |
| FRONTEND_URLS | Comma list of allowed origins |

Add secrets in repo settings, push to `main`, workflow will build & deploy.

## 🧪 Testing

Run the health check endpoint:
```bash
curl http://localhost:5000/api/health
```

## 📝 API Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    // Validation errors if any
  ]
}
```

## 🔧 Admin Seeding (Secure First User)

Production deployment should NOT rely on hard‑coded default credentials. Instead use the one‑time seeding script:

```bash
npm run create-admin
```

Behaviour:
1. If ANY admin user already exists it aborts (idempotent).
2. Reads `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` from environment.
3. If `ADMIN_PASSWORD` is omitted a strong random password is generated and printed once.
4. Password supplied via env is hidden unless you set `ADMIN_SHOW_PASSWORD=true` temporarily.
5. After successful login you should:
  - Change the password (implement/change-password route already exists).
  - Remove `ADMIN_*` vars from `.env`.
  - Optionally delete `createAdmin.js` so it cannot be re-run.

Example minimal production .env excerpt:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeThisImmediately!42
ADMIN_EMAIL=admin@example.com
# ADMIN_SHOW_PASSWORD=true   # (only for first run if needed)
```
Then run the seeder once and remove `ADMIN_SHOW_PASSWORD` + maybe the whole block.

If you forget to set a password the script will generate one – store it safely.

## ✅ Smoke & Load Tests

Basic automated verification scripts are included:

Smoke test (health, public projects, unauthorized profile 401):
```bash
SMOKE_BASE_URL=https://your-domain.com npm run smoke-test
```

Load test (burst for a public endpoint, default 50 requests):
```bash
LOAD_BASE_URL=https://your-domain.com npm run load-test -- /api/portfolio/projects 100
```

Pass criteria:
- Smoke: all checks PASS.
- Load: >90% 200 responses, reasonable p95 latency (<1s typical for this app).

## 🌐 FTP / Shared Hosting Frontend Deployment
If you are hosting ONLY the React build on an FTP/shared hosting environment (e.g. cPanel) and the backend API elsewhere:

1. In the `portfolio/` folder create `.env.production`:
  ```env
  REACT_APP_API_URL=https://api.your-backend-domain.com/api
  REACT_APP_SERVER_URL=https://api.your-backend-domain.com
  ```
2. Run a production build locally:
  ```bash
  cd portfolio
  npm install
  npm run build
  ```
3. Upload the contents of `portfolio/build/` to your hosting `public_html` (or subfolder). Include the generated `asset-manifest.json`, static folder, index.html, favicon, etc.
4. Add the provided `.htaccess` (ensures SPA routing + caching). If one exists, merge rewrite + caching rules.
5. Verify site loads (index.html) and API requests go to the external backend domain (check Network tab).
6. For updates, rebuild and upload changed files (hashed filenames allow long cache for assets; index.html handles updates).

Backend considerations:
- Ensure CORS `FRONTEND_URLS` contains the exact deployed origin (https://yourdomain.tld).
- Serve uploads via full URL so `formatImageUrl` resolves correctly.
- Use HTTPS on backend to avoid mixed-content blocks.

Troubleshooting:
| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on page refresh | Missing rewrite | Ensure `.htaccess` rewrite rules present |
| API CORS error | FRONTEND_URLS mismatch | Update backend `.env` + restart |
| Mixed content warnings | Backend over HTTP | Enable HTTPS on backend |
| Assets not updating | Browser cache | Hard refresh / bump index.html (deploy) |

## 📞 Support

For issues or questions, please check the API documentation or contact the development team.

---

Built with ❤️ using Node.js, Express, and MongoDB
