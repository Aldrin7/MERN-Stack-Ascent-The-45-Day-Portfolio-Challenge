// Day 10: CRUD Operations - Create & Read with MongoDB
// Challenge: Build POST /api/projects and GET /api/projects endpoints

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// ==================================================
// MONGODB CONNECTION SETUP
// ==================================================

// MongoDB connection URL
const mongoUrl = 'mongodb://localhost:27017';

// Database name
const dbName = 'resumeData';

// Global database variable
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');

    db = client.db(dbName);
    console.log(`📊 Using database: ${dbName}`);

    // Test the connection
    await db.admin().ping();
    console.log('🏓 Database ping successful');

    return db;

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    // Provide helpful troubleshooting
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running:');
      console.error('   1. Start MongoDB: mongod');
      console.error('   2. Or use MongoDB Compass');
      console.error('   3. Check if port 27017 is available');
    }

    throw error;
  }
}

// ==================================================
// EXPRESS MIDDLEWARE & ROUTES
// ==================================================

// Middleware for parsing JSON requests (Challenge Requirement)
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Homepage with API documentation
app.get('/', (req, res) => {
  const dbStatus = db ? 'connected' : 'disconnected';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Day 10: CRUD Operations</title>
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
            .status {
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                font-weight: bold;
            }
            .connected {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .disconnected {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
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
            .json-example {
                background: #2d3748;
                color: #e2e8f0;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                margin: 10px 0;
                font-size: 0.8rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗄️ Day 10: CRUD Operations</h1>

            <div class="status ${dbStatus === 'connected' ? 'connected' : 'disconnected'}">
                <h3>Database Status: ${dbStatus.toUpperCase()}</h3>
                ${dbStatus === 'connected'
                  ? '✅ MongoDB is connected and ready for CRUD operations!'
                  : '❌ MongoDB connection failed. Check server logs.'
                }
            </div>

            <div class="api-section">
                <h3>📋 Challenge Requirements (Completed)</h3>

                <div class="endpoint">
                    <div class="method">GET</div>
                    <div class="url">/api/projects</div>
                    <div style="margin-top: 10px;">Retrieve all projects using find().toArray()</div>
                    <a href="/api/projects" class="test-btn" target="_blank">Test GET</a>
                </div>

                <div class="endpoint">
                    <div class="method">POST</div>
                    <div class="url">/api/projects</div>
                    <div style="margin-top: 10px;">Create new project using insertOne() with req.body data</div>
                    <div class="json-example">
// POST Body Example:
{
  "title": "My Awesome Project",
  "description": "A cool project description",
  "technologies": ["React", "Node.js"],
  "featured": true
}
                    </div>
                </div>
            </div>

            <div class="api-section">
                <h3>🧪 Testing Instructions</h3>
                <p><strong>1. Test GET (should return empty array initially):</strong></p>
                <code>curl http://localhost:3000/api/projects</code>

                <p><strong>2. Create a project with POST:</strong></p>
                <code>curl -X POST http://localhost:3000/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Test","description":"Test project"}'</code>

                <p><strong>3. Test GET again (should return created project):</strong></p>
                <code>curl http://localhost:3000/api/projects</code>
            </div>

            <div class="api-section">
                <h3>📊 Database Statistics</h3>
                <p><strong>MongoDB URL:</strong> ${mongoUrl}</p>
                <p><strong>Database:</strong> ${dbName}</p>
                <p><strong>Server Port:</strong> ${PORT}</p>
                <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p><em>Congratulations! You've successfully implemented Create & Read operations! 🎉</em></p>
        </div>
    </body>
    </html>
  `);
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    database: db ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// ==================================================
// CRUD CHALLENGE IMPLEMENTATION
// ==================================================

// GET /api/projects - Get all projects (Challenge Requirement)
app.get('/api/projects', async (req, res) => {
  try {
    console.log('🌟 GET /api/projects - Retrieving all projects');

    // Get query parameters for filtering (bonus feature)
    const { featured, category, limit } = req.query;

    // Build filter object
    let filter = {};

    if (featured !== undefined) {
      filter.featured = featured.toLowerCase() === 'true';
    }

    if (category) {
      filter.category = category;
    }

    // Retrieve from MongoDB using find().toArray() (Challenge Requirement)
    const projects = await db.collection('projects').find(filter).toArray();

    console.log(`✅ Retrieved ${projects.length} projects`);

    // Apply limit if specified
    let limitedProjects = projects;
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        limitedProjects = projects.slice(0, limitNum);
      }
    }

    res.json({
      success: true,
      count: limitedProjects.length,
      total: projects.length,
      data: limitedProjects,
      filters: { featured, category, limit }
    });

  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects'
    });
  }
});

// POST /api/projects - Create new project (Challenge Requirement)
app.post('/api/projects', async (req, res) => {
  try {
    console.log('🌟 POST /api/projects - Creating new project');

    // Get project data from request body (Challenge Requirement)
    const projectData = req.body;

    console.log('📨 Received project data:', projectData);

    // Validate required fields
    if (!projectData.title || !projectData.description) {
      console.log('❌ Validation failed: missing title or description');
      return res.status(400).json({
        success: false,
        error: 'Title and description are required fields'
      });
    }

    // Add timestamps
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();

    // Insert into MongoDB using insertOne() (Challenge Requirement)
    const result = await db.collection('projects').insertOne(projectData);

    console.log(`✅ Project created with ID: ${result.insertedId}`);

    // Return success response with created project
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        _id: result.insertedId,
        ...projectData
      }
    });

  } catch (error) {
    console.error('❌ Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// Info route with API documentation
app.get('/info', (req, res) => {
  res.json({
    server: "Day 10 CRUD Operations Server",
    version: "1.0.0",
    database: {
      url: mongoUrl,
      name: dbName,
      status: db ? "connected" : "disconnected"
    },
    challenge: {
      completed: true,
      requirements: [
        "Add app.use(express.json()) middleware",
        "Create POST /api/projects endpoint",
        "Use req.body to get project data",
        "Use insertOne() to save to database",
        "Create GET /api/projects endpoint",
        "Use find().toArray() to retrieve data"
      ]
    },
    endpoints: {
      "GET /": "Homepage with API documentation",
      "GET /api/projects": "Get all projects (Challenge)",
      "POST /api/projects": "Create new project (Challenge)",
      "GET /health": "Server health check",
      "GET /info": "API information"
    },
    nodeVersion: process.version,
    platform: process.platform,
    uptime: `${Math.floor(process.uptime())} seconds`
  });
});

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
      "POST /api/projects",
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

// Start server after connecting to MongoDB
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log('🚀 ==================================================');
    console.log('🎉 Day 10 Challenge: CRUD Operations Server Started!');
    console.log('🚀 ==================================================');
    console.log(`📡 Server is running on: http://localhost:${PORT}`);
    console.log(`🏠 Homepage: http://localhost:${PORT}/`);
    console.log(`📊 Database: ${dbName}`);
    console.log('🚀 ==================================================');
    console.log('📋 Challenge Requirements (COMPLETED):');
    console.log('✅ Added app.use(express.json()) middleware');
    console.log('✅ Created POST /api/projects endpoint');
    console.log('✅ Used req.body to get project data');
    console.log('✅ Used insertOne() to save to database');
    console.log('✅ Created GET /api/projects endpoint');
    console.log('✅ Used find().toArray() to retrieve data');
    console.log('🚀 ==================================================');
    console.log('🧪 Test your CRUD operations:');
    console.log(`   GET:  curl http://localhost:${PORT}/api/projects`);
    console.log(`   POST: curl -X POST http://localhost:${PORT}/api/projects \\`);
    console.log(`         -H "Content-Type: application/json" \\`);
    console.log(`         -d '{"title":"Test","description":"Test project"}'`);
    console.log('🚀 ==================================================');
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error.message);
  console.error('💡 Make sure MongoDB is running:');
  console.error('   1. Start MongoDB: mongod');
  console.error('   2. Or use MongoDB Compass');
  console.error('   3. Check if port 27017 is available');
  process.exit(1);
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
