// Day 8: RESTful Routing - Building Professional APIs
// Challenge: Create RESTful routes for resume data with route parameters

const express = require('express');
const app = express();

// Middleware for parsing JSON requests (useful for future POST/PUT requests)
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// ==================================================
// RESUME DATA ARRAYS (Challenge Requirement)
// ==================================================

// Projects array - hard-coded JSON data for resume's "Projects" section
const projects = [
  {
    id: 1,
    title: "Full-Stack E-Commerce Platform",
    description: "A complete e-commerce solution with user authentication, product catalog, shopping cart, and payment processing.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    githubUrl: "https://github.com/aldrinmanon/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.aldrinmanon.dev",
    featured: true,
    completionDate: "2024-03-15",
    category: "fullstack"
  },
  {
    id: 2,
    title: "Real-Time Chat Application",
    description: "A modern chat application with real-time messaging, user presence, and group chat functionality.",
    technologies: ["React", "Socket.io", "Node.js", "Express", "PostgreSQL"],
    githubUrl: "https://github.com/aldrinmanon/chat-app",
    liveUrl: "https://chat.aldrinmanon.dev",
    featured: true,
    completionDate: "2024-01-20",
    category: "realtime"
  },
  {
    id: 3,
    title: "Task Management Dashboard",
    description: "A collaborative project management tool with drag-and-drop kanban boards and team collaboration features.",
    technologies: ["Vue.js", "Node.js", "Express", "MySQL", "Docker"],
    githubUrl: "https://github.com/aldrinmanon/task-manager",
    liveUrl: "https://tasks.aldrinmanon.dev",
    featured: false,
    completionDate: "2023-11-10",
    category: "productivity"
  },
  {
    id: 4,
    title: "Weather Analytics Platform",
    description: "A data visualization platform that aggregates weather data from multiple APIs and provides insights.",
    technologies: ["React", "D3.js", "Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/aldrinmanon/weather-analytics",
    liveUrl: "https://weather.aldrinmanon.dev",
    featured: false,
    completionDate: "2023-09-05",
    category: "data"
  },
  {
    id: 5,
    title: "Personal Finance Tracker",
    description: "A mobile-first web application for tracking expenses, budgeting, and financial goal setting.",
    technologies: ["React", "Node.js", "Express", "SQLite", "Chart.js"],
    githubUrl: "https://github.com/aldrinmanon/finance-tracker",
    liveUrl: "https://finance.aldrinmanon.dev",
    featured: true,
    completionDate: "2023-07-18",
    category: "finance"
  }
];

// Work experience array - hard-coded JSON data for resume's "Work Experience" section
const workExperience = [
  {
    id: 1,
    company: "Tech Innovations Inc.",
    position: "Senior Full Stack Developer",
    duration: "2022 - Present",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Lead development of scalable web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.",
    achievements: [
      "Improved application performance by 40% through code optimization",
      "Led migration from monolithic to microservices architecture",
      "Mentored 5 junior developers and established coding standards"
    ],
    technologies: ["React", "Node.js", "AWS", "Docker", "Kubernetes", "MongoDB"],
    current: true
  },
  {
    id: 2,
    company: "Digital Solutions Corp",
    position: "Full Stack Developer",
    duration: "2020 - 2022",
    location: "New York, NY",
    type: "Full-time",
    description: "Developed and maintained multiple client projects using modern web technologies. Collaborated with cross-functional teams in agile environment.",
    achievements: [
      "Delivered 15+ client projects on time and within budget",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Established automated testing practices improving code quality"
    ],
    technologies: ["Vue.js", "Node.js", "PostgreSQL", "Jenkins", "Jest"],
    current: false
  },
  {
    id: 3,
    company: "StartupXYZ",
    position: "Junior Web Developer",
    duration: "2019 - 2020",
    location: "Austin, TX",
    type: "Full-time",
    description: "Built responsive web applications and contributed to the growth of a fast-paced startup environment.",
    achievements: [
      "Developed 10+ responsive web applications",
      "Contributed to 200% user growth through improved UX",
      "Implemented responsive design patterns"
    ],
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    current: false
  }
];

// ==================================================
// API ROUTES (Challenge Requirements)
// ==================================================

// GET /api/projects - Return all projects (Challenge Requirement)
app.get('/api/projects', (req, res) => {
  console.log('🌟 GET /api/projects - Returning all projects');

  // Add optional query parameters for filtering
  const { featured, category, limit } = req.query;

  let filteredProjects = [...projects];

  // Filter by featured status
  if (featured !== undefined) {
    const isFeatured = featured.toLowerCase() === 'true';
    filteredProjects = filteredProjects.filter(project => project.featured === isFeatured);
  }

  // Filter by category
  if (category) {
    filteredProjects = filteredProjects.filter(project =>
      project.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Apply limit if specified
  if (limit) {
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      filteredProjects = filteredProjects.slice(0, limitNum);
    }
  }

  res.json({
    success: true,
    count: filteredProjects.length,
    total: projects.length,
    data: filteredProjects,
    filters: { featured, category, limit }
  });
});

// GET /api/experience - Return work experience (Challenge Requirement)
app.get('/api/experience', (req, res) => {
  console.log('🌟 GET /api/experience - Returning work experience');

  // Add optional query parameters
  const { current, company, limit } = req.query;

  let filteredExperience = [...workExperience];

  // Filter by current status
  if (current !== undefined) {
    const isCurrent = current.toLowerCase() === 'true';
    filteredExperience = filteredExperience.filter(exp => exp.current === isCurrent);
  }

  // Filter by company
  if (company) {
    filteredExperience = filteredExperience.filter(exp =>
      exp.company.toLowerCase().includes(company.toLowerCase())
    );
  }

  // Apply limit if specified
  if (limit) {
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      filteredExperience = filteredExperience.slice(0, limitNum);
    }
  }

  res.json({
    success: true,
    count: filteredExperience.length,
    total: workExperience.length,
    data: filteredExperience,
    filters: { current, company, limit }
  });
});

// GET /api/projects/:id - Return single project by ID (Challenge Requirement)
app.get('/api/projects/:id', (req, res) => {
  console.log(`🌟 GET /api/projects/${req.params.id} - Finding project by ID`);

  // Get the project ID from route parameters (Challenge Requirement)
  const projectId = parseInt(req.params.id);

  // Validate the ID
  if (isNaN(projectId)) {
    console.log('❌ Invalid project ID format');
    return res.status(400).json({
      success: false,
      error: 'Invalid project ID format. Must be a number.',
      received: req.params.id
    });
  }

  // Find the project using req.params.id (Challenge Requirement)
  const project = projects.find(p => p.id === projectId);

  // Handle not found case (Challenge Requirement)
  if (!project) {
    console.log(`❌ Project with ID ${projectId} not found`);
    return res.status(404).json({
      success: false,
      error: 'Project not found',
      requestedId: projectId,
      availableIds: projects.map(p => p.id)
    });
  }

  // Return the found project
  console.log(`✅ Found project: ${project.title}`);
  res.json({
    success: true,
    data: project
  });
});

// GET /api/experience/:id - Bonus route for single experience
app.get('/api/experience/:id', (req, res) => {
  console.log(`🌟 GET /api/experience/${req.params.id} - Finding experience by ID`);

  const experienceId = parseInt(req.params.id);

  if (isNaN(experienceId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid experience ID format. Must be a number.',
      received: req.params.id
    });
  }

  const experience = workExperience.find(exp => exp.id === experienceId);

  if (!experience) {
    return res.status(404).json({
      success: false,
      error: 'Work experience not found',
      requestedId: experienceId,
      availableIds: workExperience.map(exp => exp.id)
    });
  }

  res.json({
    success: true,
    data: experience
  });
});

// ==================================================
// ADDITIONAL EDUCATIONAL ROUTES
// ==================================================

// Homepage with API documentation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Day 8: RESTful Routing API</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 800px;
                margin: 20px;
            }
            h1 {
                color: #6f42c1;
                margin-bottom: 20px;
            }
            .api-section {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            .endpoint {
                background: white;
                border: 2px solid #6f42c1;
                border-radius: 8px;
                padding: 15px;
                margin: 10px 0;
            }
            .method {
                display: inline-block;
                background: #6f42c1;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                margin-right: 10px;
                font-size: 0.9rem;
            }
            .url {
                font-family: monospace;
                font-weight: bold;
                color: #6f42c1;
            }
            .test-btn {
                background: linear-gradient(135deg, #6f42c1, #5a32a3);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 5px;
                font-size: 0.9rem;
            }
            .test-btn:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Day 8: RESTful Routing API</h1>
            <p><strong>Status:</strong> <span style="color: #28a745;">✅ Server is running successfully!</span></p>

            <div class="api-section">
                <h3>📋 Challenge Requirements (Completed)</h3>
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/projects</div>
                    <div style="margin-top: 10px;">Returns all projects with filtering options</div>
                    <a href="/api/projects" class="test-btn" target="_blank">Test API</a>
                </div>

                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/experience</div>
                    <div style="margin-top: 10px;">Returns work experience data</div>
                    <a href="/api/experience" class="test-btn" target="_blank">Test API</a>
                </div>

                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/projects/:id</div>
                    <div style="margin-top: 10px;">Returns single project by ID (route parameters)</div>
                    <a href="/api/projects/1" class="test-btn" target="_blank">Test with ID 1</a>
                    <a href="/api/projects/2" class="test-btn" target="_blank">Test with ID 2</a>
                </div>
            </div>

            <div class="api-section">
                <h3>🎯 Bonus Features</h3>
                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/experience/:id</div>
                    <div style="margin-top: 10px;">Returns single work experience by ID</div>
                </div>

                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/projects?featured=true</div>
                    <div style="margin-top: 10px;">Filter projects by featured status</div>
                </div>

                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/projects?category=fullstack</div>
                    <div style="margin-top: 10px;">Filter projects by category</div>
                </div>
            </div>

            <div class="api-section">
                <h3>📊 Server Statistics</h3>
                <p><strong>Projects:</strong> ${projects.length} total</p>
                <p><strong>Work Experience:</strong> ${workExperience.length} entries</p>
                <p><strong>Server Started:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Node Version:</strong> ${process.version}</p>
            </div>

            <p><em>Congratulations! You've successfully implemented RESTful routing with Express.js! 🎉</em></p>
        </div>
    </body>
    </html>
  `);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    endpoints: {
      projects: projects.length,
      experience: workExperience.length
    }
  });
});

// Info route with API documentation
app.get('/info', (req, res) => {
  res.json({
    server: "Day 8 RESTful Routing API",
    version: "1.0.0",
    description: "Professional API with route parameters and filtering",
    challenge: {
      completed: true,
      requirements: [
        "GET /api/projects - Return projects array",
        "GET /api/experience - Return work experience",
        "GET /api/projects/:id - Return single project by ID"
      ]
    },
    endpoints: {
      "GET /": "Homepage with API documentation",
      "GET /api/projects": "All projects (with filtering)",
      "GET /api/projects/:id": "Single project by ID",
      "GET /api/experience": "All work experience",
      "GET /api/experience/:id": "Single work experience",
      "GET /health": "Server health check",
      "GET /info": "API information"
    },
    data: {
      projects: {
        total: projects.length,
        featured: projects.filter(p => p.featured).length,
        categories: [...new Set(projects.map(p => p.category))]
      },
      experience: {
        total: workExperience.length,
        current: workExperience.filter(exp => exp.current).length
      }
    },
    nodeVersion: process.version,
    platform: process.platform,
    uptime: `${Math.floor(process.uptime())} seconds`
  });
});

// ==================================================
// ERROR HANDLING
// ==================================================

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `The path '${req.path}' does not exist on this server.`,
    method: req.method,
    availableRoutes: [
      "GET /",
      "GET /api/projects",
      "GET /api/projects/:id",
      "GET /api/experience",
      "GET /api/experience/:id",
      "GET /health",
      "GET /info"
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Something went wrong on the server",
    timestamp: new Date().toISOString()
  });
});

// ==================================================
// SERVER STARTUP
// ==================================================

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log('🚀 ==================================================');
  console.log('🎉 Day 8 Challenge: RESTful Routing API Started!');
  console.log('🚀 ==================================================');
  console.log(`📡 Server is running on: http://localhost:${PORT}`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/`);
  console.log('🚀 ==================================================');
  console.log('📋 Challenge Requirements (COMPLETED):');
  console.log('✅ GET /api/projects - Returns projects array');
  console.log('✅ GET /api/experience - Returns work experience');
  console.log('✅ GET /api/projects/:id - Returns single project by ID');
  console.log('🚀 ==================================================');
  console.log('🧪 Test your API:');
  console.log(`   curl http://localhost:${PORT}/api/projects`);
  console.log(`   curl http://localhost:${PORT}/api/projects/1`);
  console.log(`   curl http://localhost:${PORT}/api/experience`);
  console.log('🚀 ==================================================');
  console.log('🎯 Bonus Features:');
  console.log('   • Query parameter filtering');
  console.log('   • Route parameter validation');
  console.log('   • Comprehensive error handling');
  console.log('   • API documentation homepage');
  console.log('🚀 ==================================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Export the app for testing (optional)
module.exports = app;
