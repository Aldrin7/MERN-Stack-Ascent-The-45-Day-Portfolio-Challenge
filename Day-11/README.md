# Day 11 – CRUD Operations: Update & Delete

## Overview
Welcome to the completion of CRUD operations! Today you'll master the final two operations (Update and Delete) to complete the full CRUD cycle with MongoDB. You'll learn about MongoDB ObjectIds, proper HTTP status codes, and how to handle edge cases when resources don't exist.

The material covers the complete CRUD workflow and provides hands-on experience with database operations, error handling, and professional API development.

## What You'll Learn
1. **MongoDB ObjectId** – Understanding unique document identifiers
2. **Update Operations** – PUT requests with updateOne()
3. **Delete Operations** – DELETE requests with deleteOne()
4. **HTTP Status Codes** – Using 201, 204, 400, 404 appropriately
5. **Result Validation** – Checking matchedCount and deletedCount
6. **Error Handling** – Proper responses for not found cases
7. **API Testing** – Comprehensive testing of all CRUD operations

## Daily Challenge
Build the complete CRUD API with Update and Delete operations.

### ✅ Challenge Requirements
- **Build `PUT /api/projects/:id` endpoint** to update existing projects
- **Build `DELETE /api/projects/:id` endpoint** to delete projects
- **Ensure you handle cases where the ID is not found** (return 404)
- **Use `req.params.id`** to get the project ID from the URL
- **Convert ID to `ObjectId`** for MongoDB queries
- **Use `updateOne()` with `{ _id: new ObjectId(id) }` filter** for updates
- **Use `deleteOne()` with `{ _id: new ObjectId(id) }` filter** for deletions
- **Check `result.matchedCount`** for updates (not found = 404)
- **Check `result.deletedCount`** for deletions (not found = 404)
- **Use correct HTTP status codes** (204 for delete, 404 for not found)
- **Test thoroughly** with API client like Postman or curl

### 🎯 Expected API Behavior

#### `PUT /api/projects/VALID_ID` (Successful Update)
```json
// Request Body:
{
  "title": "Updated Project Title",
  "description": "Updated project description"
}

// Response:
{
  "success": true,
  "message": "Project updated successfully",
  "modifiedCount": 1,
  "matchedCount": 1
}
```

#### `PUT /api/projects/INVALID_ID` (Not Found)
```json
// Response:
{
  "success": false,
  "error": "Project not found"
}
// Status Code: 404
```

#### `DELETE /api/projects/VALID_ID` (Successful Deletion)
```json
// Response: Empty body
// Status Code: 204 (No Content)
```

#### `DELETE /api/projects/INVALID_ID` (Not Found)
```json
// Response:
{
  "success": false,
  "error": "Project not found"
}
// Status Code: 404
```

## Quick Start Guide

### Step 1: Set Up Your Project
```bash
# Navigate to Day-11 folder
cd Day-11

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

### Step 3: Create Your Complete CRUD API
```javascript
// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

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

// Middleware
app.use(express.json());

// PUT /api/projects/:id - Update project (Challenge Requirement)
app.put('/api/projects/:id', async (req, res) => {
  try {
    // Get project ID from req.params (Challenge Requirement)
    const projectId = req.params.id;

    // Convert string ID to ObjectId (Challenge Requirement)
    const objectId = new ObjectId(projectId);

    // Get update data
    const updateData = req.body;
    updateData.updatedAt = new Date();

    // Use updateOne() with ObjectId filter (Challenge Requirement)
    const result = await db.collection('projects').updateOne(
      { _id: objectId },  // Filter with ObjectId
      { $set: updateData }
    );

    // Check if document was found (Challenge Requirement)
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project (Challenge Requirement)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    // Get project ID from req.params (Challenge Requirement)
    const projectId = req.params.id;

    // Convert string ID to ObjectId (Challenge Requirement)
    const objectId = new ObjectId(projectId);

    // Use deleteOne() with ObjectId filter (Challenge Requirement)
    const result = await db.collection('projects').deleteOne({
      _id: objectId
    });

    // Check if document was found (Challenge Requirement)
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Return 204 No Content (Challenge Requirement)
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
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

### Step 4: Test Your Complete CRUD API
```bash
# Start the server
node server.js

# 1. Create a project (if you don't have one)
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "A project for testing CRUD operations"
  }'

# 2. Get all projects to find the ID
curl http://localhost:3000/api/projects

# 3. Update the project (replace PROJECT_ID with actual ID)
curl -X PUT http://localhost:3000/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Project",
    "description": "Updated description"
  }'

# 4. Delete the project
curl -X DELETE http://localhost:3000/api/projects/PROJECT_ID

# 5. Verify deletion
curl http://localhost:3000/api/projects

# 6. Test error handling (should return 404)
curl -X PUT http://localhost:3000/api/projects/invalid-id \
  -H "Content-Type: application/json" \
  -d '{"title": "Should fail"}'

curl -X DELETE http://localhost:3000/api/projects/invalid-id
```

## File Structure
```
Day-11/
├── Day-11-slides.html    # Interactive presentation slides
├── server.js            # Express server with complete CRUD operations
├── package.json         # Project configuration and dependencies
└── README.md           # This file
```

## Understanding MongoDB ObjectId

### What is ObjectId?
MongoDB's ObjectId is a unique 12-byte identifier automatically generated for every document. It contains timestamp information and ensures uniqueness across your entire database.

### ObjectId Structure
```
ObjectId("507f1f77bcf86cd799439011")
          └─┬─┘└─┬─┘└─┬─┘└─┬─┘
            │    │    │    │
          Timestamp  Machine  PID  Counter
            (4)      (3)     (2)   (3) bytes
```

### Working with ObjectIds in Node.js
```javascript
const { ObjectId } = require('mongodb');

// Create new ObjectId (auto-generated)
const newId = new ObjectId();

// Convert string to ObjectId for queries
const projectId = new ObjectId("507f1f77bcf86cd799439011");

// Use in database operations
const project = await db.collection('projects').findOne({
  _id: projectId
});

// Check if string is valid ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id);
}
```

## HTTP Status Codes Guide

### 2xx Success Codes
- **200 OK** - Request succeeded (GET, PUT)
- **201 Created** - Resource created successfully (POST)
- **204 No Content** - Request succeeded, no content returned (DELETE)

### 4xx Client Error Codes
- **400 Bad Request** - Invalid request data or malformed request
- **404 Not Found** - Resource doesn't exist

### 5xx Server Error Codes
- **500 Internal Server Error** - Server encountered an error

### Status Code Usage in CRUD
```javascript
// POST - Create
app.post('/api/projects', async (req, res) => {
  // Success
  res.status(201).json({ success: true, data: result });

  // Validation error
  res.status(400).json({ success: false, error: 'Invalid data' });
});

// PUT - Update
app.put('/api/projects/:id', async (req, res) => {
  // Success
  res.status(200).json({ success: true, message: 'Updated' });

  // Not found
  res.status(404).json({ success: false, error: 'Not found' });

  // Invalid ID
  res.status(400).json({ success: false, error: 'Invalid ID' });
});

// DELETE - Delete
app.delete('/api/projects/:id', async (req, res) => {
  // Success
  res.status(204).send();

  // Not found
  res.status(404).json({ success: false, error: 'Not found' });
});
```

## Update Operations Deep Dive

### Using updateOne()
```javascript
// Basic update
const result = await db.collection('projects').updateOne(
  { _id: objectId },           // Filter - which document to update
  { $set: { title: "New Title" } }  // Update operation
);

// Update multiple fields
const result = await db.collection('projects').updateOne(
  { _id: objectId },
  {
    $set: {
      title: "Updated Title",
      description: "Updated description",
      updatedAt: new Date()
    }
  }
);

// Increment a numeric field
const result = await db.collection('projects').updateOne(
  { _id: objectId },
  { $inc: { views: 1 } }
);
```

### Understanding Update Results
```javascript
const result = await db.collection('projects').updateOne(filter, update);

console.log(result);
// {
//   acknowledged: true,
//   matchedCount: 1,      // How many documents matched the filter
//   modifiedCount: 1,     // How many documents were actually modified
//   upsertedCount: 0,     // How many documents were upserted
//   upsertedId: null      // ID of upserted document (if any)
// }

// Check if document was found
if (result.matchedCount === 0) {
  // Document not found - return 404
  return res.status(404).json({ error: 'Project not found' });
}

// Check if document was actually modified
if (result.modifiedCount === 0) {
  // Document found but no changes made
  return res.status(200).json({ message: 'No changes made' });
}
```

### Common Update Patterns
```javascript
// Update only if field exists or create it
{ $set: { field: value } }           // Set field to value
{ $unset: { field: "" } }            // Remove field
{ $inc: { counter: 1 } }             // Increment numeric field
{ $push: { tags: "new-tag" } }       // Add to array
{ $pull: { tags: "old-tag" } }       // Remove from array
{ $addToSet: { tags: "tag" } }       // Add to array if not exists
```

## Delete Operations Deep Dive

### Using deleteOne()
```javascript
// Delete by ObjectId
const result = await db.collection('projects').deleteOne({
  _id: objectId
});

// Delete by other criteria
const result = await db.collection('projects').deleteOne({
  title: "Project to Delete"
});

// Delete multiple documents
const result = await db.collection('projects').deleteMany({
  category: "old"
});
```

### Understanding Delete Results
```javascript
const result = await db.collection('projects').deleteOne(filter);

console.log(result);
// {
//   acknowledged: true,
//   deletedCount: 1    // How many documents were deleted
// }

// Check if document was found and deleted
if (result.deletedCount === 0) {
  // Document not found - return 404
  return res.status(404).json({ error: 'Project not found' });
} else {
  // Document successfully deleted - return 204
  return res.status(204).send();
}
```

### Soft Deletes vs Hard Deletes
```javascript
// Hard delete (permanent removal)
await db.collection('projects').deleteOne({ _id: objectId });

// Soft delete (mark as deleted)
await db.collection('projects').updateOne(
  { _id: objectId },
  {
    $set: {
      deleted: true,
      deletedAt: new Date()
    }
  }
);

// Query excluding soft-deleted items
const projects = await db.collection('projects').find({
  deleted: { $ne: true }
}).toArray();
```

## Advanced Error Handling

### ObjectId Validation
```javascript
// Proper ObjectId validation
app.put('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Validate ObjectId format before conversion
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID format'
      });
    }

    const objectId = new ObjectId(projectId);

    // Continue with update operation...

  } catch (error) {
    // Handle conversion errors
    if (error.name === 'BSONError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ObjectId format'
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### Comprehensive Error Responses
```javascript
// Centralized error handling
const handleDatabaseError = (error, operation) => {
  console.error(`Database error during ${operation}:`, error);

  // MongoDB connection errors
  if (error.name === 'MongoNetworkError') {
    return { status: 503, message: 'Database connection error' };
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return { status: 400, message: 'Invalid data provided' };
  }

  // Duplicate key errors
  if (error.code === 11000) {
    return { status: 409, message: 'Resource already exists' };
  }

  // Generic error
  return { status: 500, message: 'Internal server error' };
};

// Usage in routes
app.put('/api/projects/:id', async (req, res) => {
  try {
    // Update operation...
  } catch (error) {
    const { status, message } = handleDatabaseError(error, 'update');
    res.status(status).json({
      success: false,
      error: message
    });
  }
});
```

## Testing Strategies

### Unit Testing with Jest
```bash
npm install --save-dev jest supertest mongodb-memory-server
```

```javascript
// __tests__/projects.test.js
const request = require('supertest');
const app = require('../server');

describe('Projects API', () => {
  let projectId;

  test('POST /api/projects - create project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        title: 'Test Project',
        description: 'Test description'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    projectId = response.body.data._id;
  });

  test('PUT /api/projects/:id - update project', async () => {
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({
        title: 'Updated Project'
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.modifiedCount).toBe(1);
  });

  test('DELETE /api/projects/:id - delete project', async () => {
    await request(app)
      .delete(`/api/projects/${projectId}`)
      .expect(204);
  });

  test('PUT /api/projects/:id - not found', async () => {
    const response = await request(app)
      .put('/api/projects/507f1f77bcf86cd799439011')
      .send({ title: 'Should fail' })
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Project not found');
  });
});
```

### API Testing with Postman

#### Create a Project
1. **Method**: POST
2. **URL**: `http://localhost:3000/api/projects`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
   ```json
   {
     "title": "My Project",
     "description": "Project description",
     "technologies": ["React", "Node.js"]
   }
   ```

#### Update a Project
1. **Method**: PUT
2. **URL**: `http://localhost:3000/api/projects/{project_id}`
3. **Headers**: `Content-Type: application/json`
4. **Body**:
   ```json
   {
     "title": "Updated Project Title"
   }
   ```

#### Delete a Project
1. **Method**: DELETE
2. **URL**: `http://localhost:3000/api/projects/{project_id}`

### Automated Testing Script
```bash
#!/bin/bash
# test-crud.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testing Complete CRUD Operations"
echo "==================================="

# Create a project
echo "1. Creating project..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Automated Test Project",
    "description": "Created by automated test script"
  }')

PROJECT_ID=$(echo $CREATE_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
echo "   Created project with ID: $PROJECT_ID"

# Get all projects
echo "2. Getting all projects..."
curl -s $BASE_URL/api/projects | head -20

# Update the project
echo "3. Updating project..."
curl -s -X PUT $BASE_URL/api/projects/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated by Script"}' | head -10

# Delete the project
echo "4. Deleting project..."
curl -s -X DELETE $BASE_URL/api/projects/$PROJECT_ID \
  -w "%{http_code}" | tail -1

# Test 404 error
echo "5. Testing 404 error..."
curl -s -X PUT $BASE_URL/api/projects/invalid-id \
  -H "Content-Type: application/json" \
  -d '{"title": "Should fail"}'

echo "✅ CRUD testing complete!"
```

## Production Considerations

### Input Validation & Sanitization
```javascript
const validateProjectUpdate = (data) => {
  const allowedFields = ['title', 'description', 'technologies', 'featured'];
  const sanitized = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      // Sanitize input
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field].trim();
      } else {
        sanitized[field] = data[field];
      }
    }
  }

  return sanitized;
};
```

### Rate Limiting
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require('express-rate-limit');

const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 updates per windowMs
  message: 'Too many updates, please try again later'
});

app.use('/api/projects/', updateLimiter);
```

### Logging and Monitoring
```javascript
const morgan = require('morgan');

// HTTP request logging
app.use(morgan('combined'));

// Database operation logging
const logDatabaseOperation = (operation, collection, result) => {
  console.log(`[${new Date().toISOString()}] DB ${operation} on ${collection}:`, result);
};

// Usage in routes
app.put('/api/projects/:id', async (req, res) => {
  const result = await db.collection('projects').updateOne(filter, update);
  logDatabaseOperation('UPDATE', 'projects', result);
  // ... rest of handler
});
```

### Database Indexing
```javascript
// Create indexes for better performance
await db.collection('projects').createIndex({ title: 1 });
await db.collection('projects').createIndex({ category: 1 });
await db.collection('projects').createIndex({ featured: 1 });
await db.collection('projects').createIndex({ createdAt: 1 });
```

## Performance Optimization

### Connection Pooling
```javascript
const client = new MongoClient(mongoUrl, {
  maxPoolSize: 10,           // Maximum number of connections
  serverSelectionTimeoutMS: 5000,  // Timeout for server selection
  socketTimeoutMS: 45000,    // Socket timeout
  maxIdleTimeMS: 30000       // Maximum idle time
});
```

### Query Optimization
```javascript
// Use projection to return only needed fields
const projects = await db.collection('projects').find(
  { featured: true },
  { projection: { title: 1, description: 1, _id: 1 } }
).toArray();

// Use limit for pagination
const projects = await db.collection('projects')
  .find(filter)
  .sort({ createdAt: -1 })
  .limit(10)
  .skip(0)
  .toArray();
```

### Caching Strategy
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

app.get('/api/projects', async (req, res) => {
  const cacheKey = 'all_projects';

  // Check cache first
  let projects = cache.get(cacheKey);

  if (!projects) {
    // Fetch from database
    projects = await db.collection('projects').find({}).toArray();

    // Store in cache
    cache.set(cacheKey, projects);
  }

  res.json({ success: true, data: projects });
});

// Invalidate cache on updates
app.put('/api/projects/:id', async (req, res) => {
  // Update database...
  const result = await db.collection('projects').updateOne(filter, update);

  // Invalidate cache
  cache.del('all_projects');

  res.json({ success: true, modifiedCount: result.modifiedCount });
});
```

## Next Steps

After mastering complete CRUD operations, you'll learn:

### 🚀 Tomorrow: Advanced MongoDB Features
- **Aggregation Pipeline** - Advanced data processing
- **Indexing** - Performance optimization
- **Data Relationships** - Connecting related data
- **Schema Design** - Best practices for data modeling

### 📚 Recommended Learning Path
1. **Complete CRUD Mastery** - All four operations
2. **Advanced Queries** - Filtering, sorting, pagination
3. **Database Design** - Schema optimization
4. **Performance Tuning** - Indexing and optimization
5. **Data Relationships** - Document references
6. **Production Deployment** - Scaling and monitoring

## Challenge Success Criteria

✅ **Minimum Requirements Met:**
- [ ] Server starts successfully with MongoDB connection
- [ ] `PUT /api/projects/:id` endpoint implemented
- [ ] `DELETE /api/projects/:id` endpoint implemented
- [ ] `req.params.id` used to get project ID from URL
- [ ] ID converted to `ObjectId` for database queries
- [ ] `updateOne()` used with `{ _id: objectId }` filter
- [ ] `deleteOne()` used with `{ _id: objectId }` filter
- [ ] `result.matchedCount` checked for updates (404 if 0)
- [ ] `result.deletedCount` checked for deletions (404 if 0)
- [ ] Correct HTTP status codes used (204, 404, 400)
- [ ] Cases where ID not found properly handled

✅ **Bonus Features Implemented:**
- [ ] Comprehensive error handling and validation
- [ ] Input sanitization and validation
- [ ] Detailed logging and monitoring
- [ ] Performance optimizations
- [ ] Caching strategies
- [ ] Rate limiting
- [ ] Database indexing

## Testing Checklist

### Basic CRUD Testing
- [ ] `POST /api/projects` creates new project (201 status)
- [ ] `GET /api/projects` returns all projects (200 status)
- [ ] `PUT /api/projects/{valid_id}` updates existing project (200 status)
- [ ] `DELETE /api/projects/{valid_id}` deletes project (204 status)

### Error Handling Testing
- [ ] `PUT /api/projects/{invalid_id}` returns 404
- [ ] `DELETE /api/projects/{invalid_id}` returns 404
- [ ] `PUT /api/projects/{malformed_id}` returns 400
- [ ] `DELETE /api/projects/{malformed_id}` returns 400

### Data Validation Testing
- [ ] POST without title returns 400
- [ ] POST without description returns 400
- [ ] Invalid JSON in request body handled gracefully
- [ ] Empty request body handled gracefully

### Edge Cases Testing
- [ ] Update non-existent project returns 404
- [ ] Delete already deleted project returns 404
- [ ] Multiple updates to same project work correctly
- [ ] Concurrent operations don't cause race conditions

## Congratulations! 🎉

You've successfully completed the full CRUD operations cycle! This is a major milestone in your full-stack development journey. You now understand:

- ✅ **MongoDB ObjectId** - Unique document identifiers
- ✅ **Update Operations** - PUT requests with updateOne()
- ✅ **Delete Operations** - DELETE requests with deleteOne()
- ✅ **HTTP Status Codes** - Using 201, 204, 400, 404 appropriately
- ✅ **Result Validation** - Checking matchedCount and deletedCount
- ✅ **Error Handling** - Professional error responses
- ✅ **API Testing** - Comprehensive testing strategies
- ✅ **Production Ready** - Performance and security considerations

**Keep building amazing complete CRUD APIs, keep managing data professionally, and keep creating data-driven applications!** 🌟

---

*Day 11: CRUD Operations - Update & Delete with MongoDB and Express.js*
