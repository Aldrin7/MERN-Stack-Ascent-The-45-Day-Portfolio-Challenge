// Day 11: CRUD Operations - Complete (Create, Read, Update, Delete)
// Challenge: Build PUT /api/projects/:id and DELETE /api/projects/:id endpoints

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

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
        <title>Day 11: Complete CRUD Operations</title>
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
                max-width: 1000px;
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
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 3px;
                font-size: 0.8rem;
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
                font-size: 0.75rem;
                overflow-x: auto;
            }
            .crud-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .crud-item {
                background: #f8f9fa;
                border: 2px solid #dee2e6;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            .crud-item h4 {
                color: #6f42c1;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗄️ Day 11: Complete CRUD Operations</h1>

            <div class="status ${dbStatus === 'connected' ? 'connected' : 'disconnected'}">
                <h3>Database Status: ${dbStatus.toUpperCase()}</h3>
                ${dbStatus === 'connected'
                  ? '✅ MongoDB is connected and ready for complete CRUD operations!'
                  : '❌ MongoDB connection failed. Check server logs.'
                }
            </div>

            <div class="crud-grid">
                <div class="crud-item">
                    <h4>📝 Create</h4>
                    <div class="method">POST</div>
                    <div class="url">/api/projects</div>
                </div>
                <div class="crud-item">
                    <h4>📖 Read</h4>
                    <div class="method">GET</div>
                    <div class="url">/api/projects</div>
                </div>
                <div class="crud-item">
                    <h4>📝 Update</h4>
                    <div class="method">PUT</div>
                    <div class="url">/api/projects/:id</div>
                </div>
                <div class="crud-item">
                    <h4>🗑️ Delete</h4>
                    <div class="method">DELETE</div>
                    <div class="url">/api/projects/:id</div>
                </div>
            </div>

            <div class="api-section">
                <h3>📋 Challenge Requirements (COMPLETED)</h3>

                <div class="endpoint">
                    <div class="method">PUT</div>
                    <div class="url">/api/projects/:id</div>
                    <div style="margin-top: 10px;">
                        Update project using updateOne() with ObjectId filter and req.params.id
                        <a href="/api/projects" class="test-btn" target="_blank">Test PUT</a>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="method">DELETE</div>
                    <div class="url">/api/projects/:id</div>
                    <div style="margin-top: 10px;">
                        Delete project using deleteOne() with ObjectId filter and req.params.id
                        <div class="json-example">
// PUT /api/projects/VALID_ID
// Request Body:
{
  "title": "Updated Project Title",
  "description": "Updated description"
}

// DELETE /api/projects/VALID_ID
// Response: 204 No Content (empty body)

// PUT/DELETE /api/projects/INVALID_ID
// Response: 404 Not Found
                    </div>
                </div>
            </div>

            <div class="api-section">
                <h3>🧪 Complete CRUD Testing Workflow</h3>
                <p><strong>1. Create a project (POST):</strong></p>
                <code>curl -X POST http://localhost:3000/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"title":"CRUD Test","description":"Testing complete CRUD operations"}'</code>

                <p><strong>2. Get all projects (GET):</strong></p>
                <code>curl http://localhost:3000/api/projects</code>

                <p><strong>3. Update the project (PUT):</strong></p>
                <code>curl -X PUT http://localhost:3000/api/projects/PROJECT_ID \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Updated CRUD Test","description":"Updated description"}'</code>

                <p><strong>4. Delete the project (DELETE):</strong></p>
                <code>curl -X DELETE http://localhost:3000/api/projects/PROJECT_ID</code>

                <p><strong>5. Verify deletion (GET):</strong></p>
                <code>curl http://localhost:3000/api/projects</code>

                <p><strong>6. Test error handling (404):</strong></p>
                <code>curl -X PUT http://localhost:3000/api/projects/invalid-id \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Should fail"}'</code>
            </div>

            <div class="api-section">
                <h3>📊 Database Statistics</h3>
                <p><strong>MongoDB URL:</strong> ${mongoUrl}</p>
                <p><strong>Database:</strong> ${dbName}</p>
                <p><strong>Server Port:</strong> ${PORT}</p>
                <p><strong>Started:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p><em>Congratulations! You've successfully implemented the complete CRUD operations! 🎉</em></p>
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
// COMPLETE CRUD IMPLEMENTATION
// ==================================================

// GET /api/projects - Get all projects (Read)
app.get('/api/projects', async (req, res) => {
  try {
    console.log('🌟 GET /api/projects - Retrieving all projects');

    // Get query parameters for filtering
    const { featured, category, limit } = req.query;

    // Build filter object
    let filter = {};

    if (featured !== undefined) {
      filter.featured = featured.toLowerCase() === 'true';
    }

    if (category) {
      filter.category = category;
    }

    // Retrieve from MongoDB using find().toArray()
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

// POST /api/projects - Create new project (Create)
app.post('/api/projects', async (req, res) => {
  try {
    console.log('🌟 POST /api/projects - Creating new project');

    // Get project data from request body
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

    // Insert into MongoDB using insertOne()
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

// PUT /api/projects/:id - Update project (Challenge Requirement)
app.put('/api/projects/:id', async (req, res) => {
  try {
    console.log('🌟 PUT /api/projects/:id - Updating project');

    // Get project ID from req.params (Challenge Requirement)
    const projectId = req.params.id;
    console.log(`🔍 Updating project with ID: ${projectId}`);

    // Convert string ID to ObjectId (Challenge Requirement)
    let objectId;
    try {
      objectId = new ObjectId(projectId);
      console.log(`✅ Valid ObjectId: ${objectId}`);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', projectId);
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    // Get update data from request body
    const updateData = req.body;
    console.log('📨 Update data:', updateData);

    // Add/update timestamp
    updateData.updatedAt = new Date();

    // Use updateOne() with ObjectId filter (Challenge Requirement)
    const result = await db.collection('projects').updateOne(
      { _id: objectId },  // Filter with ObjectId
      { $set: updateData } // Use $set to only update specified fields
    );

    console.log('📊 Update result:', {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

    // Check if document was found and updated (Challenge Requirement)
    if (result.matchedCount === 0) {
      console.log('❌ Project not found for update');
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    console.log(`✅ Project updated successfully`);

    // Return success response
    res.json({
      success: true,
      message: 'Project updated successfully',
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });

  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project (Challenge Requirement)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    console.log('🌟 DELETE /api/projects/:id - Deleting project');

    // Get project ID from req.params (Challenge Requirement)
    const projectId = req.params.id;
    console.log(`🔍 Deleting project with ID: ${projectId}`);

    // Convert string ID to ObjectId (Challenge Requirement)
    let objectId;
    try {
      objectId = new ObjectId(projectId);
      console.log(`✅ Valid ObjectId: ${objectId}`);
    } catch (error) {
      console.log('❌ Invalid ObjectId format:', projectId);
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    // Use deleteOne() with ObjectId filter (Challenge Requirement)
    const result = await db.collection('projects').deleteOne({
      _id: objectId  // Filter with ObjectId
    });

    console.log('📊 Delete result:', {
      deletedCount: result.deletedCount
    });

    // Check if document was found and deleted (Challenge Requirement)
    if (result.deletedCount === 0) {
      console.log('❌ Project not found for deletion');
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    console.log(`✅ Project deleted successfully`);

    // Return 204 No Content for successful deletion (Challenge Requirement)
    res.status(204).send();

  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

// Info route with API documentation
app.get('/info', (req, res) => {
  res.json({
    server: "Day 11 Complete CRUD Operations Server",
    version: "1.0.0",
    database: {
      url: mongoUrl,
      name: dbName,
      status: db ? "connected" : "disconnected"
    },
    challenge: {
      completed: true,
      requirements: [
        "Build PUT /api/projects/:id endpoint",
        "Build DELETE /api/projects/:id endpoint",
        "Handle cases where ID is not found",
        "Use req.params.id to get project ID",
        "Convert ID to ObjectId for queries",
        "Use updateOne() with { _id: objectId } filter",
        "Use deleteOne() with { _id: objectId } filter",
        "Check result.matchedCount for not found (PUT)",
        "Check result.deletedCount for not found (DELETE)",
        "Use correct HTTP status codes (204, 404, 400)",
        "Test thoroughly with API client"
      ]
    },
    endpoints: {
      "GET /": "Homepage with API documentation",
      "GET /api/projects": "Get all projects",
      "POST /api/projects": "Create new project",
      "PUT /api/projects/:id": "Update existing project (Challenge)",
      "DELETE /api/projects/:id": "Delete project (Challenge)",
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
      "PUT /api/projects/:id",
      "DELETE /api/projects/:id",
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
    console.log('🎉 Day 11 Challenge: Complete CRUD Operations Server!');
    console.log('🚀 ==================================================');
    console.log(`📡 Server is running on: http://localhost:${PORT}`);
    console.log(`🏠 Homepage: http://localhost:${PORT}/`);
    console.log(`📊 Database: ${dbName}`);
    console.log('🚀 ==================================================');
    console.log('📋 Challenge Requirements (COMPLETED):');
    console.log('✅ Built PUT /api/projects/:id endpoint');
    console.log('✅ Built DELETE /api/projects/:id endpoint');
    console.log('✅ Used req.params.id to get project ID');
    console.log('✅ Converted ID to ObjectId for queries');
    console.log('✅ Used updateOne() with { _id: objectId } filter');
    console.log('✅ Used deleteOne() with { _id: objectId } filter');
    console.log('✅ Checked result.matchedCount for not found (PUT)');
    console.log('✅ Checked result.deletedCount for not found (DELETE)');
    console.log('✅ Used correct HTTP status codes (204, 404, 400)');
    console.log('✅ Handled cases where ID is not found');
    console.log('🚀 ==================================================');
    console.log('🧪 Test your complete CRUD operations:');
    console.log(`   POST:  curl -X POST http://localhost:${PORT}/api/projects \\`);
    console.log(`          -H "Content-Type: application/json" \\`);
    console.log(`          -d '{"title":"Test","description":"Test project"}'`);
    console.log(`   GET:   curl http://localhost:${PORT}/api/projects`);
    console.log(`   PUT:   curl -X PUT http://localhost:${PORT}/api/projects/PROJECT_ID \\`);
    console.log(`          -H "Content-Type: application/json" \\`);
    console.log(`          -d '{"title":"Updated"}'`);
    console.log(`   DELETE: curl -X DELETE http://localhost:${PORT}/api/projects/PROJECT_ID`);
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
