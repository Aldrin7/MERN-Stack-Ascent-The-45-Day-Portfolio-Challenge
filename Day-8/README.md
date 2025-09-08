# Day 8 – RESTful Routing

## Overview
Master the art of building professional APIs with RESTful routing patterns! Today you'll learn how to create clean, intuitive endpoints using route parameters, query strings, and proper HTTP methods. You'll build an API that serves resume data and demonstrates industry-standard REST conventions.

The material covers the complete REST architecture and provides hands-on experience with dynamic routing, data filtering, and professional API design.

## What You'll Learn
1. **REST Principles** – Understanding Representational State Transfer
2. **HTTP Methods** – GET, POST, PUT, DELETE operations
3. **Route Parameters** – Dynamic routes with `:id` parameters
4. **Query Parameters** – Filtering and searching with `req.query`
5. **CRUD Operations** – Create, Read, Update, Delete patterns
6. **API Design** – Building professional, scalable endpoints
7. **Data Management** – Working with arrays and object manipulation

## Daily Challenge
Build an API with resume data using proper RESTful routing patterns.

### ✅ Challenge Requirements
- **Create two arrays** for `projects` and `workExperience` (hard-coded JSON data)
- **Build `GET /api/projects` route** that returns the projects array
- **Build `GET /api/experience` route** that returns work experience
- **Create `GET /api/projects/:id` route** that returns single project by ID
- **Use `req.params.id`** to find and return the correct project
- **Handle not found cases** with proper 404 errors

### 🎯 Expected API Responses

#### `GET /api/projects`
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "data": [
    {
      "id": 1,
      "title": "Full-Stack E-Commerce Platform",
      "description": "A complete e-commerce solution...",
      "technologies": ["React", "Node.js", "Express", "MongoDB"],
      "featured": true,
      "category": "fullstack"
    }
  ],
  "filters": {}
}
```

#### `GET /api/projects/1`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Full-Stack E-Commerce Platform",
    "description": "A complete e-commerce solution...",
    "technologies": ["React", "Node.js", "Express", "MongoDB"],
    "featured": true,
    "category": "fullstack"
  }
}
```

## Quick Start Guide

### Step 1: Set Up Your Project
```bash
# Navigate to Day-8 folder
cd Day-8

# Initialize npm project
npm init -y

# Install Express
npm install express
```

### Step 2: Create Your Resume Data
```javascript
// server.js
const projects = [
  {
    id: 1,
    title: "Full-Stack E-Commerce Platform",
    description: "A complete e-commerce solution",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    featured: true,
    category: "fullstack"
  }
];

const workExperience = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Full Stack Developer",
    description: "Developed web applications"
  }
];
```

### Step 3: Create RESTful Routes
```javascript
// GET /api/projects - Return all projects
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// GET /api/experience - Return work experience
app.get('/api/experience', (req, res) => {
  res.json({
    success: true,
    count: workExperience.length,
    data: workExperience
  });
});

// GET /api/projects/:id - Return single project by ID
app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  res.json({
    success: true,
    data: project
  });
});
```

### Step 4: Start Your Server
```bash
# Start the server
node server.js

# Or use the npm script
npm start
```

## File Structure
```
Day-8/
├── Day-8-slides.html    # Interactive presentation slides
├── server.js            # Express server with RESTful routes
├── package.json         # Project configuration and dependencies
└── README.md           # This file
```

## Key Concepts Explained

### RESTful URL Patterns

| Resource | Collection | Individual |
|----------|------------|------------|
| Projects | `GET /api/projects` | `GET /api/projects/1` |
| Experience | `GET /api/experience` | `GET /api/experience/1` |
| Users | `GET /api/users` | `GET /api/users/123` |

### Route Parameters vs Query Parameters

#### Route Parameters (`req.params`)
```javascript
// URL: /api/projects/1
app.get('/api/projects/:id', (req, res) => {
  const projectId = req.params.id; // "1"
  // Used for identifying specific resources
});
```

#### Query Parameters (`req.query`)
```javascript
// URL: /api/projects?featured=true&category=fullstack
app.get('/api/projects', (req, res) => {
  const { featured, category } = req.query;
  // Used for filtering, sorting, pagination
});
```

## Advanced Features (Included)

### 🎯 Query Parameter Filtering

#### Filter by Featured Projects
```bash
curl "http://localhost:3000/api/projects?featured=true"
```

#### Filter by Category
```bash
curl "http://localhost:3000/api/projects?category=fullstack"
```

#### Limit Results
```bash
curl "http://localhost:3000/api/projects?limit=3"
```

#### Combine Filters
```bash
curl "http://localhost:3000/api/projects?featured=true&category=fullstack&limit=2"
```

### 📊 Dynamic Route Parameters

#### Valid ID Examples
```bash
curl http://localhost:3000/api/projects/1    # ✅ Valid
curl http://localhost:3000/api/projects/2    # ✅ Valid
curl http://localhost:3000/api/projects/abc  # ❌ Invalid (returns 400)
curl http://localhost:3000/api/projects/999  # ❌ Not found (returns 404)
```

### 🏷️ Data Categories

The API includes projects in these categories:
- **fullstack** - Full-stack web applications
- **realtime** - Real-time applications (chat, live updates)
- **productivity** - Task management and productivity tools
- **data** - Data visualization and analytics
- **finance** - Financial applications

## Testing Your API

### Method 1: Browser Testing
1. Start your server: `node server.js`
2. Open browser to: `http://localhost:3000/`
3. Click the test buttons for each endpoint

### Method 2: Command Line Testing
```bash
# Test all projects
curl http://localhost:3000/api/projects

# Test single project
curl http://localhost:3000/api/projects/1

# Test work experience
curl http://localhost:3000/api/experience

# Test filtering
curl "http://localhost:3000/api/projects?featured=true"
curl "http://localhost:3000/api/projects?category=fullstack"
```

### Method 3: Postman/Insomnia
1. Create new requests for each endpoint
2. Set method to GET
3. Enter URLs and test responses

## Bonus Features Implemented

### 🎨 Homepage with API Documentation
- Beautiful HTML interface at `http://localhost:3000/`
- Interactive test buttons for all endpoints
- Real-time server statistics
- Visual API documentation

### ❤️ Health Check Endpoint
```bash
curl http://localhost:3000/health
```
Returns server health, uptime, and memory usage.

### ℹ️ Info Endpoint
```bash
curl http://localhost:3000/info
```
Returns comprehensive API documentation and statistics.

### 🔍 Advanced Filtering
- Filter projects by featured status
- Filter by technology category
- Limit results with pagination
- Combine multiple filters

### ⚠️ Comprehensive Error Handling
- **400 Bad Request** - Invalid ID format
- **404 Not Found** - Resource doesn't exist
- **500 Internal Error** - Server errors
- Detailed error messages with helpful information

## Resume Data Structure

### Projects Array
Each project includes:
- `id` - Unique identifier
- `title` - Project title
- `description` - Detailed description
- `technologies` - Array of technologies used
- `githubUrl` - GitHub repository link
- `liveUrl` - Live demo link
- `featured` - Whether it's a featured project
- `completionDate` - When the project was completed
- `category` - Technology category

### Work Experience Array
Each experience includes:
- `id` - Unique identifier
- `company` - Company name
- `position` - Job title
- `duration` - Employment period
- `location` - Work location
- `type` - Employment type (Full-time, etc.)
- `description` - Job responsibilities
- `achievements` - Key accomplishments
- `technologies` - Technologies used
- `current` - Whether this is current position

## Development Workflow

### Using nodemon (Recommended)
```bash
# Install nodemon globally
npm install -g nodemon

# Or install as dev dependency
npm install --save-dev nodemon

# Run with auto-restart
nodemon server.js

# Or use the npm script
npm run dev
```

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "count": 5,           // Number of items returned
  "total": 5,           // Total number of items available
  "data": [...],        // The actual data
  "filters": {...}      // Applied filters (if any)
}
```

Error responses follow this format:

```json
{
  "success": false,
  "error": "Project not found",
  "requestedId": 999,
  "availableIds": [1, 2, 3, 4, 5]
}
```

## Common Issues & Solutions

### ❌ "Cannot find module 'express'"
```bash
# Solution: Install Express
npm install express
```

### ❌ "Port 3000 already in use"
```bash
# Find process using port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 node server.js
```

### ❌ Getting 404 for valid routes
- Check that server is running
- Verify the exact URL path
- Make sure you're using GET method

### ❌ Route parameters not working
- Ensure parameter name matches in route definition
- Check that `req.params.id` is being used correctly
- Verify ID parsing with `parseInt()`

## Production Considerations

### Environment Variables
```javascript
// Use environment port
const PORT = process.env.PORT || 3000;
```

### CORS Handling
For cross-origin requests, add CORS middleware:
```bash
npm install cors
```
```javascript
const cors = require('cors');
app.use(cors());
```

### Rate Limiting
Prevent abuse with rate limiting:
```bash
npm install express-rate-limit
```

## Next Steps

After mastering RESTful routing, you'll learn:

### 🚀 Tomorrow: Database Integration
- **MongoDB** – NoSQL database for data persistence
- **Mongoose** – Object modeling for MongoDB
- **CRUD Operations** – Real database operations
- **Data Relationships** – Connecting related data

### 📚 Recommended Learning Path
1. **Database Design** – Planning your data structure
2. **Data Validation** – Ensuring data integrity
3. **Indexing** – Optimizing database queries
4. **Authentication** – User login and security
5. **API Security** – Protecting your endpoints
6. **Testing** – Writing tests for your API

## Challenge Success Criteria

✅ **Minimum Requirements Met:**
- [ ] Server starts successfully on port 3000
- [ ] `GET /api/projects` returns projects array
- [ ] `GET /api/experience` returns work experience
- [ ] `GET /api/projects/:id` returns single project by ID
- [ ] Proper error handling for invalid/not found IDs
- [ ] Uses `req.params.id` to find correct project

✅ **Bonus Features Implemented:**
- [ ] Query parameter filtering
- [ ] Homepage with API documentation
- [ ] Health check endpoint
- [ ] Comprehensive error messages
- [ ] Professional response format

## Testing Checklist

- [ ] `curl http://localhost:3000/api/projects` returns all projects
- [ ] `curl http://localhost:3000/api/projects/1` returns first project
- [ ] `curl http://localhost:3000/api/projects/999` returns 404 error
- [ ] `curl "http://localhost:3000/api/projects?featured=true"` filters correctly
- [ ] `curl http://localhost:3000/api/experience` returns work experience
- [ ] `curl http://localhost:3000/` shows homepage with documentation

## Congratulations! 🎉

You've successfully mastered RESTful routing and built a professional API! This is a major milestone in your full-stack development journey. You now understand:

- ✅ **REST Principles** - Resources, HTTP methods, stateless operations
- ✅ **Route Parameters** - Dynamic routes with `:id` parameters
- ✅ **Query Parameters** - Filtering and searching with `req.query`
- ✅ **CRUD Operations** - Full Create, Read, Update, Delete patterns
- ✅ **Error Handling** - Proper HTTP status codes and error responses
- ✅ **API Design** - Professional, scalable endpoint design
- ✅ **Data Management** - Working with arrays and object manipulation

**Keep building amazing APIs, keep designing clean routes, and keep creating professional applications!** 🌟

---

*Day 8: RESTful Routing - Building Professional APIs with Express.js*
