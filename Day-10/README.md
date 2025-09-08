# Day 10 – CRUD Operations: Create & Read

## Overview
Welcome to the world of database operations! Today you'll master the fundamental CRUD operations (Create, Read, Update, Delete) by implementing Create and Read operations with MongoDB. You'll learn how to store data persistently and retrieve it efficiently using Express.js and the MongoDB Node.js driver.

The material covers the complete CRUD workflow and provides hands-on experience with database operations, request body parsing, and API development.

## What You'll Learn
1. **CRUD Operations** – Understanding Create, Read, Update, Delete
2. **Request Body Parsing** – Using `express.json()` middleware
3. **Database Operations** – `insertOne()` and `find().toArray()`
4. **API Development** – Building RESTful endpoints
5. **Data Validation** – Ensuring data integrity
6. **Error Handling** – Robust error management
7. **API Testing** – Using curl and Postman

## Daily Challenge
Build Create and Read operations for your projects API.

### ✅ Challenge Requirements
- **Add `app.use(express.json())` middleware** for parsing request bodies
- **Create `POST /api/projects` endpoint** to add new project to database
- **Use `req.body`** to get project data from client
- **Use `insertOne()`** to save project to MongoDB
- **Create `GET /api/projects` endpoint** to retrieve all projects from database
- **Use `find().toArray()`** to get data from MongoDB
- **Test with API client** like Postman or curl

### 🎯 Expected API Behavior

#### `GET /api/projects` (Initially empty)
```json
{
  "success": true,
  "count": 0,
  "total": 0,
  "data": [],
  "filters": {}
}
```

#### `POST /api/projects` (Create project)
```json
// Request Body:
{
  "title": "My Awesome Project",
  "description": "A cool project description",
  "technologies": ["React", "Node.js"],
  "featured": true
}

// Response:
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "650a1234567890abcdef123",
    "title": "My Awesome Project",
    "description": "A cool project description",
    "technologies": ["React", "Node.js"],
    "featured": true,
    "createdAt": "2025-08-28T...",
    "updatedAt": "2025-08-28T..."
  }
}
```

#### `GET /api/projects` (After creating project)
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "data": [
    {
      "_id": "650a1234567890abcdef123",
      "title": "My Awesome Project",
      "description": "A cool project description",
      "technologies": ["React", "Node.js"],
      "featured": true,
      "createdAt": "2025-08-28T...",
      "updatedAt": "2025-08-28T..."
    }
  ],
  "filters": {}
}
```

## Quick Start Guide

### Step 1: Set Up Your Project
```bash
# Navigate to Day-10 folder
cd Day-10

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongodb
```

### Step 2: Start MongoDB
```bash
# Make sure MongoDB is running
mongod

# Or on macOS:
brew services start mongodb-community
```

### Step 3: Create Your CRUD API
```javascript
// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db(dbName);
  console.log('✅ Connected to MongoDB');
  return db;
}

// Middleware for parsing JSON (Challenge Requirement)
app.use(express.json());

// GET /api/projects - Get all projects (Challenge Requirement)
app.get('/api/projects', async (req, res) => {
  try {
    // Use find().toArray() to retrieve data (Challenge Requirement)
    const projects = await db.collection('projects').find({}).toArray();

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects'
    });
  }
});

// POST /api/projects - Create new project (Challenge Requirement)
app.post('/api/projects', async (req, res) => {
  try {
    // Get project data from req.body (Challenge Requirement)
    const projectData = req.body;

    // Validate required fields
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    // Add timestamps
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();

    // Use insertOne() to save to database (Challenge Requirement)
    const result = await db.collection('projects').insertOne(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { _id: result.insertedId, ...projectData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// Start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
```

### Step 4: Test Your API
```bash
# Start the server
node server.js

# Test GET (should return empty array)
curl http://localhost:3000/api/projects

# Test POST (create a project)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Project",
    "description": "A project created via API",
    "technologies": ["Node.js", "Express"],
    "featured": true
  }'

# Test GET again (should return created project)
curl http://localhost:3000/api/projects
```

## File Structure
```
Day-10/
├── Day-10-slides.html    # Interactive presentation slides
├── server.js            # Express server with CRUD operations
├── package.json         # Project configuration and dependencies
└── README.md           # This file
```

## Understanding CRUD Operations

### Create (POST)
- **Purpose**: Add new data to database
- **HTTP Method**: POST
- **MongoDB Method**: `insertOne(document)`
- **Response Code**: 201 (Created)
- **Use Case**: User registration, posting content, creating records

### Read (GET)
- **Purpose**: Retrieve data from database
- **HTTP Method**: GET
- **MongoDB Method**: `find(filter).toArray()`
- **Response Code**: 200 (OK)
- **Use Case**: Displaying data, fetching user profiles, getting lists

### Update (PUT)
- **Purpose**: Modify existing data
- **HTTP Method**: PUT
- **MongoDB Method**: `updateOne(filter, update)`
- **Response Code**: 200 (OK)
- **Use Case**: Editing profiles, updating settings, modifying records

### Delete (DELETE)
- **Purpose**: Remove data from database
- **HTTP Method**: DELETE
- **MongoDB Method**: `deleteOne(filter)`
- **Response Code**: 200 (OK) or 204 (No Content)
- **Use Case**: Deleting accounts, removing items, clearing data

## Request Body Parsing

### Why We Need `express.json()`
When clients send data to your server via POST requests, that data is sent in the request body. Express needs middleware to parse this raw data into a usable JavaScript object.

### Without `express.json()`:
```javascript
// req.body is undefined
app.post('/api/projects', (req, res) => {
  console.log(req.body); // undefined
});
```

### With `express.json()`:
```javascript
// req.body contains parsed JSON
app.post('/api/projects', (req, res) => {
  console.log(req.body); // { title: "My Project", description: "..." }
});
```

### Setting Up Body Parsing:
```javascript
const express = require('express');
const app = express();

// Enable JSON body parsing (Challenge Requirement)
app.use(express.json());

// Enable URL-encoded body parsing (for forms)
app.use(express.urlencoded({ extended: true }));
```

## MongoDB Operations

### `insertOne()` - Create Operation
```javascript
// Insert a single document
const result = await db.collection('projects').insertOne({
  title: "My Project",
  description: "Project description",
  createdAt: new Date()
});

console.log('Inserted ID:', result.insertedId);
// Output: Inserted ID: 650a1234567890abcdef123
```

### `find()` & `toArray()` - Read Operation
```javascript
// Find all documents
const projects = await db.collection('projects').find({}).toArray();

// Find with filter
const featuredProjects = await db.collection('projects')
  .find({ featured: true })
  .toArray();

// Find one document
const project = await db.collection('projects')
  .findOne({ title: "My Project" });
```

## Advanced Features (Included)

### Query Parameter Filtering
```bash
# Filter by featured status
GET /api/projects?featured=true

# Filter by category
GET /api/projects?category=fullstack

# Limit results
GET /api/projects?limit=5

# Combine filters
GET /api/projects?featured=true&category=fullstack&limit=3
```

### Data Validation
```javascript
app.post('/api/projects', async (req, res) => {
  const projectData = req.body;

  // Validate required fields
  if (!projectData.title || !projectData.description) {
    return res.status(400).json({
      success: false,
      error: 'Title and description are required'
    });
  }

  // Validate data types
  if (typeof projectData.title !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Title must be a string'
    });
  }

  // Proceed with creating project...
});
```

### Error Handling Patterns
```javascript
// Try-catch for async operations
app.post('/api/projects', async (req, res) => {
  try {
    // Database operation
    const result = await db.collection('projects').insertOne(projectData);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Database error:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});
```

## Testing Your API

### Method 1: Command Line (curl)
```bash
# Test GET endpoint
curl http://localhost:3000/api/projects

# Test POST endpoint
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "A project created via curl",
    "technologies": ["Node.js", "Express"],
    "featured": true
  }'

# Test with query parameters
curl "http://localhost:3000/api/projects?featured=true"
```

### Method 2: Postman
1. **Create new request** → Set method to GET
2. **Enter URL**: `http://localhost:3000/api/projects`
3. **Send request** → View response

4. **Create new request** → Set method to POST
5. **Enter URL**: `http://localhost:3000/api/projects`
6. **Go to Body tab** → Select "raw" → Choose "JSON"
7. **Enter JSON data**:
   ```json
   {
     "title": "My Project",
     "description": "Project created via Postman",
     "technologies": ["React", "Node.js"],
     "featured": true
   }
   ```
8. **Send request** → View response

### Method 3: Browser
1. Open browser to: `http://localhost:3000/`
2. Click "Test GET" button
3. Use browser's developer tools to test POST requests

## Sample API Usage

### Creating Multiple Projects
```bash
# Create first project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution",
    "technologies": ["React", "Node.js", "MongoDB"],
    "featured": true
  }'

# Create second project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Management App",
    "description": "Collaborative project management tool",
    "technologies": ["Vue.js", "Express", "MySQL"],
    "featured": false
  }'

# Get all projects
curl http://localhost:3000/api/projects

# Get only featured projects
curl "http://localhost:3000/api/projects?featured=true"
```

## Database Schema Design

### Projects Collection
```javascript
{
  "_id": ObjectId("650a1234567890abcdef123"),  // Auto-generated
  "title": "E-Commerce Platform",                 // Required
  "description": "Full-stack e-commerce solution", // Required
  "technologies": ["React", "Node.js", "MongoDB"], // Array
  "githubUrl": "https://github.com/user/project",  // Optional
  "liveUrl": "https://project-demo.com",           // Optional
  "featured": true,                                // Boolean
  "category": "fullstack",                         // String
  "createdAt": "2025-08-28T10:30:00.000Z",       // Timestamp
  "updatedAt": "2025-08-28T10:30:00.000Z"        // Timestamp
}
```

### Best Practices for Schema Design
1. **Use meaningful field names**
2. **Include timestamps** (createdAt, updatedAt)
3. **Use appropriate data types**
4. **Add validation rules**
5. **Plan for future scalability**
6. **Document your schema**

## Common Issues & Solutions

### ❌ "req.body is undefined"
**Solution**: Add `app.use(express.json())` middleware
```javascript
const express = require('express');
const app = express();

// Add this line before your routes
app.use(express.json());
```

### ❌ "Cannot read property 'title' of undefined"
**Solution**: Check if req.body exists
```javascript
app.post('/api/projects', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  const { title, description } = req.body;
  // ... rest of your code
});
```

### ❌ MongoDB connection errors
**Solutions**:
1. Make sure MongoDB is running: `mongod`
2. Check if port 27017 is available
3. Verify connection string is correct
4. Check firewall settings

### ❌ Validation errors
**Solution**: Add proper validation
```javascript
if (!title || typeof title !== 'string' || title.trim().length === 0) {
  return res.status(400).json({ error: 'Valid title is required' });
}
```

## Production Considerations

### Input Validation & Sanitization
```javascript
const validateProject = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required and must be a string');
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required and must be a string');
  }

  if (data.technologies && !Array.isArray(data.technologies)) {
    errors.push('Technologies must be an array');
  }

  return errors;
};
```

### Rate Limiting
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### CORS Configuration
```bash
npm install cors
```
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Next Steps

After mastering Create and Read operations, you'll learn:

### 🚀 Tomorrow: Update & Delete Operations
- **Update**: `PUT /api/projects/:id` with `updateOne()`
- **Delete**: `DELETE /api/projects/:id` with `deleteOne()`
- **Advanced Queries**: Filtering, sorting, pagination
- **Data Relationships**: Connecting related data

### 📚 Recommended Learning Path
1. **Complete CRUD**: Master all four operations
2. **Data Validation**: Input sanitization and validation
3. **Error Handling**: Comprehensive error management
4. **API Documentation**: OpenAPI/Swagger documentation
5. **Authentication**: User authentication and authorization
6. **Testing**: Unit tests and integration tests

## Challenge Success Criteria

✅ **Minimum Requirements Met:**
- [ ] Server starts successfully with MongoDB connection
- [ ] `app.use(express.json())` middleware is added
- [ ] `POST /api/projects` endpoint accepts project data
- [ ] `req.body` is used to get data from POST requests
- [ ] `insertOne()` is used to save data to MongoDB
- [ ] `GET /api/projects` endpoint returns project data
- [ ] `find().toArray()` is used to retrieve data from MongoDB
- [ ] API can be tested with curl or Postman

✅ **Bonus Features Implemented:**
- [ ] Input validation for required fields
- [ ] Proper HTTP status codes (200, 201, 400, 500)
- [ ] Query parameter filtering support
- [ ] Comprehensive error handling
- [ ] Timestamps (createdAt, updatedAt)
- [ ] Homepage with API documentation
- [ ] Health check endpoint

## Testing Checklist

- [ ] `curl http://localhost:3000/api/projects` returns empty array initially
- [ ] `curl -X POST http://localhost:3000/api/projects -H "Content-Type: application/json" -d '{"title":"Test","description":"Test"}'` creates project
- [ ] `curl http://localhost:3000/api/projects` returns created project
- [ ] POST request without title returns 400 error
- [ ] POST request without description returns 400 error
- [ ] Invalid JSON in POST request is handled gracefully

## Congratulations! 🎉

You've successfully implemented Create and Read operations with MongoDB! This is a major milestone in your full-stack development journey. You now understand:

- ✅ **CRUD Operations**: Create and Read patterns
- ✅ **Request Body Parsing**: Using `express.json()` middleware
- ✅ **Database Operations**: `insertOne()` and `find().toArray()`
- ✅ **API Development**: Building RESTful endpoints
- ✅ **Data Persistence**: Storing data that survives server restarts
- ✅ **Input Validation**: Ensuring data integrity
- ✅ **Error Handling**: Robust error management
- ✅ **API Testing**: Using curl and Postman effectively

**Keep building amazing database-driven APIs, keep storing data persistently, and keep creating full-stack applications!** 🌟

---

*Day 10: CRUD Operations - Create & Read with MongoDB and Express.js*
