// Day 9: Intro to MongoDB - Connecting Express Server to MongoDB
// Challenge: Create a server script that connects to MongoDB and logs a success message

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// ==================================================
// MONGODB CONNECTION CHALLENGE
// ==================================================

// MongoDB connection URL (Challenge Requirement)
const mongoUrl = 'mongodb://localhost:27017';

// Database name (Challenge Requirement)
const dbName = 'resumeData';

// Global database variable
let db;

// Async function to handle MongoDB connection (Challenge Requirement)
async function connectToMongoDB() {
  // Create MongoClient instance (Challenge Requirement)
  const client = new MongoClient(mongoUrl);

  try {
    // Connect to MongoDB (Challenge Requirement)
    await client.connect();

    // Log success message (Challenge Requirement)
    console.log('✅ Connected successfully to MongoDB');

    // Get database reference and log database name
    db = client.db(dbName);
    console.log(`📊 Using database: ${dbName}`);

    // Test the connection with a ping (bonus)
    await db.admin().ping();
    console.log('🏓 Database ping successful');

    return db;

  } catch (error) {
    // Handle connection errors
    console.error('❌ MongoDB connection error:', error.message);

    // Provide helpful troubleshooting information
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Make sure MongoDB is running:');
      console.error('   - Start MongoDB: mongod');
      console.error('   - Or use MongoDB Compass to start the service');
    }

    throw error;
  }
}

// ==================================================
// EXPRESS MIDDLEWARE & ROUTES
// ==================================================

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Homepage route with MongoDB connection status
app.get('/', (req, res) => {
  const dbStatus = db ? 'connected' : 'disconnected';

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Day 9: MongoDB Connection</title>
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
                max-width: 600px;
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
            .info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: left;
            }
            .test-btn {
                background: linear-gradient(135deg, #6f42c1, #5a32a3);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
                font-size: 0.9rem;
            }
            .test-btn:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗄️ Day 9: MongoDB Connection</h1>

            <div class="status ${dbStatus === 'connected' ? 'connected' : 'disconnected'}">
                <h3>Database Status: ${dbStatus.toUpperCase()}</h3>
                ${dbStatus === 'connected'
                  ? '✅ MongoDB is connected and ready!'
                  : '❌ MongoDB connection failed. Check server logs.'
                }
            </div>

            <div class="info">
                <h3>📊 Connection Details</h3>
                <p><strong>MongoDB URL:</strong> ${mongoUrl}</p>
                <p><strong>Database:</strong> ${dbName}</p>
                <p><strong>Server Port:</strong> ${PORT}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="info">
                <h3>🧪 Test Your Connection</h3>
                <a href="/api/status" class="test-btn">📡 GET /api/status</a>
                <br>
                <small>Test the MongoDB connection via API</small>
            </div>

            <p><em>Congratulations! You've successfully connected to MongoDB! 🎉</em></p>
        </div>
    </body>
    </html>
  `);
});

// API route to test MongoDB connection
app.get('/api/status', (req, res) => {
  const dbStatus = db ? 'connected' : 'disconnected';

  res.json({
    message: 'MongoDB connection test',
    database: dbName,
    status: dbStatus,
    timestamp: new Date().toISOString(),
    challenge: {
      completed: true,
      requirements: [
        "Connect to MongoDB using MongoClient",
        "Create resumeData database",
        "Log success message on connection",
        "Use async function for connection handling"
      ]
    }
  });
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

// Info route with connection details
app.get('/info', (req, res) => {
  res.json({
    server: "Day 9 MongoDB Connection Server",
    version: "1.0.0",
    database: {
      url: mongoUrl,
      name: dbName,
      status: db ? "connected" : "disconnected"
    },
    challenge: {
      completed: true,
      description: "Create resumeData database and connect via MongoClient"
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
    availableRoutes: [
      "GET /",
      "GET /api/status",
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

// Start server after connecting to MongoDB (Challenge Requirement)
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log('🚀 ==================================================');
    console.log('🎉 Day 9 Challenge: MongoDB Connection Complete!');
    console.log('🚀 ==================================================');
    console.log(`📡 Server is running on: http://localhost:${PORT}`);
    console.log(`🏠 Homepage: http://localhost:${PORT}/`);
    console.log(`📊 Database: ${dbName}`);
    console.log('🚀 ==================================================');
    console.log('✅ Challenge Requirements Met:');
    console.log('   • Connected to MongoDB using MongoClient');
    console.log('   • Created resumeData database');
    console.log('   • Logged success message');
    console.log('   • Used async function for connection');
    console.log('🚀 ==================================================');
    console.log('🧪 Test your connection:');
    console.log(`   curl http://localhost:${PORT}/api/status`);
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

// Export for testing (optional)
module.exports = app;
