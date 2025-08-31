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
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
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

## 📞 Support

For issues or questions, please check the API documentation or contact the development team.

---

Built with ❤️ using Node.js, Express, and MongoDB
