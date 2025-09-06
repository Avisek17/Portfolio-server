import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('👤 Admin user already exists');
      return;
    }

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@portfolio.com',
      role: 'admin'
    });

    console.log('👤 Admin user created successfully');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

const seedProjects = async () => {
  try {
    const projectCount = await Project.countDocuments();
    
    if (projectCount > 0) {
      console.log('📁 Projects already exist');
      return;
    }

    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
        shortDescription: 'Modern e-commerce platform with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'Stripe API'],
        category: 'web',
        status: 'completed',
        featured: true,
        priority: 10,
        links: {
          github: 'https://github.com/yourusername/ecommerce-platform',
          live: 'https://your-ecommerce-demo.com',
          demo: 'https://your-ecommerce-demo.com'
        },
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-04-20'),
        teamSize: 1
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
        shortDescription: 'Collaborative task management with real-time updates',
        technologies: ['Vue.js', 'Socket.io', 'Express', 'PostgreSQL'],
        category: 'web',
        status: 'completed',
        featured: true,
        priority: 9,
        links: {
          github: 'https://github.com/yourusername/task-manager',
          live: 'https://your-taskmanager.com'
        },
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-07-15'),
        teamSize: 2
      },
      {
        title: 'Weather Dashboard',
        description: 'A responsive weather dashboard that displays current weather, forecasts, and weather maps for multiple locations.',
        shortDescription: 'Responsive weather dashboard with forecasts',
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'Weather API'],
        category: 'web',
        status: 'completed',
        featured: false,
        priority: 7,
        links: {
          github: 'https://github.com/yourusername/weather-dashboard',
          live: 'https://your-weather-app.com'
        },
        startDate: new Date('2023-08-01'),
        endDate: new Date('2023-08-20'),
        teamSize: 1
      }
    ];

    await Project.insertMany(projects);
    console.log('📁 Sample projects created successfully');
  } catch (error) {
    console.error('❌ Error creating projects:', error.message);
  }
};

const seedSkills = async () => {
  try {
    const skillCount = await Skill.countDocuments();
    
    if (skillCount > 0) {
      console.log('🛠️ Skills already exist');
      return;
    }

    const skills = [
      // Frontend Skills
      {
        name: 'React',
        category: 'frontend',
        proficiency: 90,
        yearsOfExperience: 3,
        icon: 'FaReact',
        color: '#61DAFB',
        description: 'Expert in building modern web applications with React, hooks, and state management',
        featured: true,
        priority: 10
      },
      {
        name: 'JavaScript',
        category: 'languages',
        proficiency: 95,
        yearsOfExperience: 4,
        icon: 'FaJs',
        color: '#F7DF1E',
        description: 'Proficient in ES6+, async programming, and modern JavaScript frameworks',
        featured: true,
        priority: 10
      },
      {
        name: 'HTML5',
        category: 'frontend',
        proficiency: 95,
        yearsOfExperience: 5,
        icon: 'FaHtml5',
        color: '#E34F26',
        description: 'Expert in semantic HTML, accessibility, and modern web standards',
        featured: true,
        priority: 9
      },
      {
        name: 'CSS3',
        category: 'frontend',
        proficiency: 90,
        yearsOfExperience: 5,
        icon: 'FaCss3Alt',
        color: '#1572B6',
        description: 'Advanced CSS including Flexbox, Grid, animations, and responsive design',
        featured: true,
        priority: 9
      },
      // Backend Skills
      {
        name: 'Node.js',
        category: 'backend',
        proficiency: 85,
        yearsOfExperience: 3,
        icon: 'FaNodeJs',
        color: '#339933',
        description: 'Building scalable backend services and APIs with Node.js',
        featured: true,
        priority: 9
      },
      {
        name: 'Express.js',
        category: 'frameworks',
        proficiency: 85,
        yearsOfExperience: 3,
        icon: 'SiExpress',
        color: '#000000',
        description: 'Creating RESTful APIs and web applications with Express.js',
        featured: true,
        priority: 8
      },
      // Database Skills
      {
        name: 'MongoDB',
        category: 'database',
        proficiency: 80,
        yearsOfExperience: 2.5,
        icon: 'SiMongodb',
        color: '#47A248',
        description: 'NoSQL database design, aggregation pipelines, and optimization',
        featured: true,
        priority: 8
      },
      {
        name: 'PostgreSQL',
        category: 'database',
        proficiency: 75,
        yearsOfExperience: 2,
        icon: 'SiPostgresql',
        color: '#336791',
        description: 'Relational database design, complex queries, and performance tuning',
        featured: false,
        priority: 7
      },
      // Tools
      {
        name: 'Git',
        category: 'tools',
        proficiency: 90,
        yearsOfExperience: 4,
        icon: 'FaGitAlt',
        color: '#F05032',
        description: 'Version control, branching strategies, and collaborative development',
        featured: true,
        priority: 8
      },
      {
        name: 'Docker',
        category: 'tools',
        proficiency: 70,
        yearsOfExperience: 1.5,
        icon: 'FaDocker',
        color: '#2496ED',
        description: 'Containerization, Docker Compose, and deployment strategies',
        featured: false,
        priority: 6
      }
    ];

    await Skill.insertMany(skills);
    console.log('🛠️ Sample skills created successfully');
  } catch (error) {
    console.error('❌ Error creating skills:', error.message);
  }
};

const seedCertificates = async () => {
  try {
    const certCount = await Certificate.countDocuments();
    
    if (certCount > 0) {
      console.log('🏆 Certificates already exist');
      return;
    }

    const certificates = [
      {
        title: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        description: 'Validates expertise in developing and maintaining applications on the AWS platform',
        issueDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-15'),
        credentialId: 'AWS-DEV-2023-001',
        credentialUrl: 'https://aws.amazon.com/certification/certified-developer-associate/',
        category: 'technical',
        level: 'intermediate',
        featured: true,
        priority: 9
      },
      {
        title: 'React Developer Certification',
        issuer: 'Meta (Facebook)',
        description: 'Advanced certification in React development and best practices',
        issueDate: new Date('2023-04-20'),
        expiryDate: new Date('2025-04-20'),
        credentialId: 'META-REACT-2023-002',
        credentialUrl: 'https://developers.facebook.com/developercircles/',
        category: 'technical',
        level: 'advanced',
        featured: true,
        priority: 10
      },
      {
        title: 'MongoDB Developer Certification',
        issuer: 'MongoDB University',
        description: 'Comprehensive certification in MongoDB database development',
        issueDate: new Date('2023-03-10'),
        credentialId: 'MONGO-DEV-2023-003',
        credentialUrl: 'https://university.mongodb.com/',
        category: 'technical',
        level: 'intermediate',
        featured: true,
        priority: 8
      }
    ];

    await Certificate.insertMany(certificates);
    console.log('🏆 Sample certificates created successfully');
  } catch (error) {
    console.error('❌ Error creating certificates:', error.message);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedAdmin();
    await seedProjects();
    await seedSkills();
    await seedCertificates();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;