// Day 23: Express Server for Data Fetching Challenge
const express = require('express');

const app = express();
const PORT = 3000;

// ==================================================
// MOCK PROJECTS DATA
// ==================================================
const mockProjects = [
    {
        id: 1,
        title: "React Portfolio Website",
        description: "A responsive portfolio website built with React.js, featuring modern UI/UX design and smooth animations.",
        technologies: ["React", "CSS", "JavaScript"],
        category: "frontend",
        featured: true,
        githubUrl: "https://github.com/example/portfolio",
        liveUrl: "https://portfolio-example.com"
    },
    {
        id: 2,
        title: "Node.js REST API",
        description: "A comprehensive REST API built with Node.js and Express, including authentication, error handling, and database integration.",
        technologies: ["Node.js", "Express", "MongoDB", "JWT"],
        category: "backend",
        featured: true,
        githubUrl: "https://github.com/example/api-server",
        liveUrl: null
    },
    {
        id: 3,
        title: "E-commerce Dashboard",
        description: "An admin dashboard for an e-commerce platform with analytics, inventory management, and order tracking.",
        technologies: ["React", "Redux", "Node.js", "PostgreSQL"],
        category: "fullstack",
        featured: false,
        githubUrl: "https://github.com/example/dashboard",
        liveUrl: "https://dashboard-example.com"
    },
    {
        id: 4,
        title: "Weather PWA",
        description: "A Progressive Web App that provides weather forecasts with offline functionality and location services.",
        technologies: ["JavaScript", "PWA", "Service Workers"],
        category: "frontend",
        featured: true,
        githubUrl: "https://github.com/example/weather-pwa",
        liveUrl: "https://weather-pwa-example.com"
    },
    {
        id: 5,
        title: "Task Management Tool",
        description: "A collaborative task management application with real-time updates, user authentication, and team collaboration features.",
        technologies: ["React", "Firebase", "Material-UI", "Socket.io"],
        category: "fullstack",
        featured: false,
        githubUrl: "https://github.com/example/task-manager",
        liveUrl: "https://task-manager-example.com"
    },
    {
        id: 6,
        title: "Data Visualization Dashboard",
        description: "Interactive data visualization dashboard with charts, graphs, and real-time data updates using modern libraries.",
        technologies: ["D3.js", "React", "WebSocket"],
        category: "frontend",
        featured: false,
        githubUrl: "https://github.com/example/data-viz",
        liveUrl: "https://data-viz-example.com"
    }
];

// ==================================================
// EXPRESS MIDDLEWARE
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    database: "mock",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==================================================
// API ENDPOINT FOR DATA FETCHING CHALLENGE
// ==================================================
app.get('/api/projects', (req, res) => {
  try {
    console.log('🌟 GET /api/projects - Retrieving all projects for Day-23 challenge');

    // Add a small delay to simulate real database fetch
    setTimeout(() => {
      console.log(`✅ Retrieved ${mockProjects.length} projects`);

      res.json({
        success: true,
        count: mockProjects.length,
        total: mockProjects.length,
        data: mockProjects
      });
    }, 500); // 500ms delay

  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects'
    });
  }
});

// ==================================================
// SERVER STARTUP
// ==================================================
app.listen(PORT, () => {
  console.log('🚀 ==================================================');
  console.log('🎉 Day 23 Data Fetching Challenge Server Started!');
  console.log('🚀 ==================================================');
  console.log(`📡 Server is running on: http://localhost:${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/projects`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('🚀 ==================================================');
  console.log('📋 Now you can test the data fetching challenge!');
  console.log('   1. Open: Day-23/data-fetching-challenge.html');
  console.log('   2. The server is ready with mock project data');
  console.log('   3. The React app should fetch data automatically');
  console.log('🚀 ==================================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
