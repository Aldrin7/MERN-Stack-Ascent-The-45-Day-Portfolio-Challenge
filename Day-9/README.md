# Day 9 – Intro to MongoDB

## Overview
Welcome to the world of databases! Today you'll learn about MongoDB, the leading NoSQL database, and how to connect it to your Express server. This marks your transition from working with in-memory data to persistent data storage that survives server restarts.

The material covers the complete MongoDB ecosystem and provides hands-on experience with database connections, data modeling, and integration with Node.js applications.

## What You'll Learn
1. **SQL vs. NoSQL** – Understanding database paradigms
2. **MongoDB Fundamentals** – Collections, Documents, and BSON
3. **Local Installation** – Setting up MongoDB on your machine
4. **Node.js Driver** – Connecting JavaScript applications to MongoDB
5. **Database Integration** – Combining Express with MongoDB
6. **Connection Management** – Best practices for database connections
7. **Data Persistence** – Storing and retrieving data across sessions

## Daily Challenge
Create a server script that connects to MongoDB and logs a success message.

### ✅ Challenge Requirements
- **Install MongoDB locally** and start the server
- **Create `server.js` script** with Express server
- **Install `mongodb` package** using npm
- **Use `MongoClient`** to connect to `mongodb://localhost:27017`
- **Create `resumeData` database** in MongoDB
- **Log success message** when connection is established
- **Create async function** called `connectToMongoDB()` to handle connection

### 🎯 Expected Output
```bash
# When MongoDB is running and server starts
✅ Connected successfully to MongoDB
📊 Using database: resumeData
🏓 Database ping successful
🚀 Server running on http://localhost:3000

# API Response from /api/status
{
  "message": "MongoDB connection test",
  "database": "resumeData",
  "status": "connected",
  "timestamp": "2025-08-28T...",
  "challenge": {
    "completed": true,
    "requirements": [
      "Connect to MongoDB using MongoClient",
      "Create resumeData database",
      "Log success message on connection",
      "Use async function for connection handling"
    ]
  }
}
```

## Quick Start Guide

### Step 1: Install MongoDB Locally
```bash
# Download and install MongoDB Community Server
# Visit: https://www.mongodb.com/try/download/community

# Create data directory (Windows)
mkdir C:\data\db

# Create data directory (macOS/Linux)
sudo mkdir -p /data/db

# Start MongoDB server
mongod

# Verify installation (in another terminal)
mongosh
db.runCommand({ping: 1})
# Should return: { ok: 1 }
```

### Step 2: Set Up Your Project
```bash
# Navigate to Day-9 folder
cd Day-9

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongodb
```

### Step 3: Create the Connection Script
```javascript
// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection details
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

// Async function to handle MongoDB connection
async function connectToMongoDB() {
  const client = new MongoClient(mongoUrl);

  try {
    // Connect to MongoDB
    await client.connect();

    // Log success message (Challenge Requirement)
    console.log('✅ Connected successfully to MongoDB');

    // Get database reference
    db = client.db(dbName);
    console.log(`📊 Using database: ${dbName}`);

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Start server after connecting
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
```

### Step 4: Test Your Connection
```bash
# Start the server
node server.js

# Test the API
curl http://localhost:3000/api/status

# Open in browser
http://localhost:3000/
```

## File Structure
```
Day-9/
├── Day-9-slides.html    # Interactive presentation slides
├── server.js            # Express server with MongoDB connection
├── package.json         # Project configuration and dependencies
└── README.md           # This file
```

## MongoDB Installation Guide

### Windows Installation
1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Choose Windows version
   - Download MSI installer

2. **Run Installer**
   - Choose "Complete" installation
   - Accept default settings
   - MongoDB will be installed to `C:\Program Files\MongoDB\`

3. **Create Data Directory**
   ```cmd
   mkdir C:\data\db
   ```

4. **Start MongoDB**
   ```cmd
   # Open Command Prompt as Administrator
   "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
   ```

### macOS Installation
1. **Install using Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Create Data Directory**
   ```bash
   sudo mkdir -p /data/db
   sudo chown -R $(whoami) /data/db
   ```

3. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

### Linux Installation
1. **Import MongoDB GPG Key**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```

3. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## MongoDB Shell (mongosh)

### Connecting to MongoDB
```bash
# Start MongoDB shell
mongosh

# Or connect to specific database
mongosh resumeData
```

### Basic Commands
```javascript
// Show all databases
show dbs

// Switch to a database
use resumeData

// Show current database
db

// Show collections in current database
show collections

// Test connection
db.runCommand({ping: 1})

// Exit shell
exit
```

## MongoDB Node.js Driver

### Installation
```bash
npm install mongodb
```

### Basic Connection Pattern
```javascript
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database name
const dbName = 'resumeData';

async function connectToDatabase() {
  try {
    // Connect to MongoDB
    await client.connect();

    console.log('✅ Connected to MongoDB');

    // Get database
    const db = client.db(dbName);

    return db;

  } catch (error) {
    console.error('❌ Connection error:', error);
    throw error;
  }
}
```

### Connection Options
```javascript
const client = new MongoClient(url, {
  // Connection pool settings
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,

  // Authentication (for production)
  auth: {
    username: 'your-username',
    password: 'your-password'
  },

  // SSL/TLS (for production)
  tls: true,
  tlsCAFile: '/path/to/ca.pem'
});
```

## Express + MongoDB Integration

### Complete Server Setup
```javascript
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB configuration
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

// Connect to MongoDB first, then start server
async function startServer() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);

    console.log('✅ MongoDB connected');
    console.log(`📊 Database: ${dbName}`);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Startup error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(express.json());

// Routes
app.get('/api/status', (req, res) => {
  res.json({
    database: dbName,
    status: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Start the application
startServer();
```

## Data Modeling in MongoDB

### Documents vs. Collections
```javascript
// Collection: projects
// Document structure:
{
  "_id": ObjectId("650a1234567890abcdef123"),
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce solution",
  "technologies": ["React", "Node.js", "MongoDB"],
  "featured": true,
  "completionDate": "2024-03-15",
  "category": "fullstack"
}

// Collection: experience
{
  "_id": ObjectId("650a1234567890abcdef456"),
  "company": "Tech Corp",
  "position": "Full Stack Developer",
  "duration": "2022 - Present",
  "description": "Developed web applications",
  "technologies": ["React", "Node.js", "AWS"],
  "current": true
}
```

### BSON Data Types
MongoDB uses BSON (Binary JSON) which supports additional data types:

- **ObjectId** - Unique document identifier
- **Date** - Date and time values
- **Binary Data** - Images, files
- **Arrays** - Lists of values
- **Embedded Documents** - Nested objects
- **Regular Expressions** - Pattern matching
- **JavaScript Code** - Stored functions

## Error Handling & Troubleshooting

### Common Connection Issues

#### ❌ "ECONNREFUSED"
```bash
# MongoDB is not running
# Start MongoDB:
mongod

# Or on macOS:
brew services start mongodb-community

# Or on Linux:
sudo systemctl start mongod
```

#### ❌ "Authentication failed"
- Check username/password
- Verify user permissions
- Ensure authentication is enabled

#### ❌ "Port 27017 already in use"
```bash
# Find process using port
lsof -i :27017

# Kill the process
kill -9 <PID>
```

### Connection Best Practices

1. **Always handle connection errors**
2. **Use connection pooling** for performance
3. **Implement connection health checks**
4. **Close connections properly** on app shutdown
5. **Use environment variables** for connection strings
6. **Implement retry logic** for transient failures

## Production Considerations

### Environment Variables
```javascript
// .env file
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=resumeData
NODE_ENV=production

// server.js
require('dotenv').config();
const mongoUrl = process.env.MONGODB_URL;
const dbName = process.env.DATABASE_NAME;
```

### Connection String Formats
```javascript
// Local development
const url = 'mongodb://localhost:27017';

// With authentication
const url = 'mongodb://username:password@localhost:27017';

// MongoDB Atlas (cloud)
const url = 'mongodb+srv://username:password@cluster.mongodb.net/';

// Replica set
const url = 'mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=myReplSet';
```

### Security Best Practices
1. **Use authentication** in production
2. **Enable SSL/TLS** for data encryption
3. **Configure firewall rules** properly
4. **Regular security updates** for MongoDB
5. **Backup your data** regularly
6. **Monitor database performance**

## Testing Your Setup

### Method 1: Browser Testing
1. Start MongoDB: `mongod`
2. Start your server: `node server.js`
3. Open browser: `http://localhost:3000/`
4. Click "GET /api/status" to test connection

### Method 2: Command Line Testing
```bash
# Test server response
curl http://localhost:3000/api/status

# Test MongoDB connection directly
mongosh --eval "db.runCommand({ping: 1})"
```

### Method 3: MongoDB Compass
1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. View databases and collections
4. Run queries and view data

## Next Steps

After mastering MongoDB connections, you'll learn:

### 🚀 Tomorrow: CRUD Operations with MongoDB
- **Create** – Insert new documents
- **Read** – Query and retrieve data
- **Update** – Modify existing documents
- **Delete** – Remove documents
- **Advanced Queries** – Filtering, sorting, aggregation

### 📚 Recommended Learning Path
1. **Database Operations** – CRUD with MongoDB driver
2. **Mongoose ODM** – Object modeling for MongoDB
3. **Data Validation** – Schema validation and sanitization
4. **Indexing** – Performance optimization
5. **Aggregation Pipeline** – Advanced data processing
6. **Deployment** – MongoDB Atlas and cloud deployment

## Challenge Success Criteria

✅ **Minimum Requirements Met:**
- [ ] MongoDB installed and running locally
- [ ] `server.js` script created with Express server
- [ ] `mongodb` package installed via npm
- [ ] `MongoClient` used to connect to `mongodb://localhost:27017`
- [ ] `resumeData` database created/accessed
- [ ] Success message logged on connection
- [ ] Async function `connectToMongoDB()` implemented

✅ **Bonus Features Implemented:**
- [ ] Connection error handling with helpful messages
- [ ] Database ping test for connection verification
- [ ] API endpoints for testing connection
- [ ] Homepage with connection status
- [ ] Comprehensive logging and debugging information

## Testing Checklist

- [ ] MongoDB server is running (`mongod` command)
- [ ] Server starts without errors (`node server.js`)
- [ ] Console shows success messages:
  - [ ] "✅ Connected successfully to MongoDB"
  - [ ] "📊 Using database: resumeData"
- [ ] API endpoint works: `curl http://localhost:3000/api/status`
- [ ] Homepage shows connected status: `http://localhost:3000/`

## Congratulations! 🎉

You've successfully connected your first database to a web server! This is a major milestone in your full-stack development journey. You now understand:

- ✅ **SQL vs. NoSQL** database paradigms
- ✅ **MongoDB architecture** - Collections, Documents, BSON
- ✅ **Local installation** and configuration
- ✅ **Node.js driver integration** with Express
- ✅ **Database connection management** and error handling
- ✅ **Data persistence** concepts and implementation

**Keep building, keep connecting databases, and keep creating data-driven applications!** 🌟

---

*Day 9: Intro to MongoDB - Connecting Express Server to MongoDB Database*
