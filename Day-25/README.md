# Day 25: Work Experience API Backend

## 🎯 Challenge Objective

Create a professional-grade REST API for managing work experience data with full CRUD operations and advanced features.

## 📋 Learning Outcomes

- ✅ Full REST API implementation (GET, POST, PUT, DELETE)
- ✅ Advanced query parameters and filtering
- ✅ Mock data design and structure planning
- ✅ API documentation and testing
- ✅ CORS configuration for frontend integration

## 🚀 Getting Started

### Installation & Setup

```bash
# Navigate to Day-25 directory
cd Day-25

# Install dependencies (inherits from parent project)
npm install

# Start the API server
node work-experience-api-server.js
```

### Server will run on: `http://localhost:3000`

## 🔧 API Endpoints Overview

### Core CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/work-experience` | Get all work experiences |
| GET    | `/api/work-experience/:id` | Get specific experience |
| POST   | `/api/work-experience` | Create new experience |
| PUT    | `/api/work-experience/:id` | Update experience |
| DELETE | `/api/work-experience/:id` | Delete experience |

### Advanced Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/work-experience/stats` | Get experience statistics |
| GET    | `/health` | Server health check |

## 📊 Query Parameters & Filtering

### GET `/api/work-experience`

```bash
# Search by company or position
GET /api/work-experience?search=React

# Filter by specific company
GET /api/work-experience?company=Google

# Get only current positions
GET /api/work-experience?isCurrent=true

# Combine filters
GET /api/work-experience?search=developer&isCurrent=true
```

## 🎨 Request/Response Examples

### GET /api/work-experience

**Response:**
```json
{
  "success": true,
  "count": 8,
  "total": 8,
  "data": [
    {
      "id": 1,
      "company": "Google",
      "position": "Senior Frontend Developer",
      "startDate": "2022-03-15",
      "endDate": "2024-08-31",
      "location": "Mountain View, CA",
      "isCurrent": false,
      "description": "Led development of modern React applications...",
      "achievements": [
        "Improved performance by 40% through code optimization",
        "Mentored 5 junior developers..."
      ],
      "technologies": ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      "companySize": "100,000+",
      "industry": "Technology",
      "website": "https://google.com",
      "createdAt": "2024-09-01T00:00:00.000Z",
      "updatedAt": "2024-09-01T00:00:00.000Z"
    }
  ],
  "filters": {
    "search": null,
    "company": null,
    "isCurrent": null
  }
}
```

### POST /api/work-experience

**Request Body:**
```json
{
  "company": "New Company",
  "position": "Full Stack Developer",
  "startDate": "2024-01-15",
  "endDate": null,
  "location": "San Francisco, CA",
  "isCurrent": true,
  "description": "Exciting new role building amazing products...",
  "achievements": ["Led team of 5 developers", "Improved deployment processes"],
  "technologies": ["React", "Node.js", "PostgreSQL"],
  "companySize": "500-1000",
  "industry": "Technology",
  "website": "https://newcompany.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Work experience created successfully",
  "data": {
    "id": 9,
    "company": "New Company",
    "position": "Full Stack Developer",
    "createdAt": "2024-09-12T00:30:00.000Z",
    "updatedAt": "2024-09-12T00:30:00.000Z"
  }
}
```

### GET /api/work-experience/stats

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "current": 1,
    "companies": 8,
    "yearsOfExperience": 12,
    "topSkills": [
      {"skill": "React", "count": 6},
      {"skill": "JavaScript", "count": 5},
      {"skill": "Node.js", "count": 4}
    ],
    "industries": [
      {"industry": "Technology", "count": 4},
      {"industry": "Cloud Computing", "count": 1},
      {"industry": "Entertainment", "count": 1}
    ]
  },
  "timestamp": "2024-09-12T00:30:00.000Z"
}
```

## 🧪 Testing the API

### Quick Tests in Terminal

```bash
# Test health check
curl http://localhost:3000/health

# Get all experiences
curl http://localhost:3000/api/work-experience

# Get filtered results
curl "http://localhost:3000/api/work-experience?search=React"

# Get statistics
curl http://localhost:3000/api/work-experience/stats

# Get specific experience
curl http://localhost:3000/api/work-experience/1
```

### Create New Experience

```bash
curl -X POST http://localhost:3000/api/work-experience \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Test Company",
    "position": "Test Developer",
    "description": "Test description",
    "technologies": ["React", "Node.js"],
    "startDate": "2024-01-01",
    "isCurrent": true
  }'
```

### Update Experience

```bash
curl -X PUT http://localhost:3000/api/work-experience/9 \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Updated Company Name",
    "position": "Updated Position"
  }'
```

## 📁 Mock Data Structure

The API includes 8 diverse work experience entries:

1. **Google** - Senior Frontend Developer (2022-2024)
2. **Microsoft** - Software Engineer (2020-Present)
3. **Amazon Web Services** - Full Stack Developer (2018-2019)
4. **Netflix** - Frontend Engineer (2017-2018)
5. **Airbnb** - Product Engineer (2016)
6. **StartupXYZ** - Lead Developer (2015-2016)
7. **Freelance** - Web Developer (2014-2015)
8. **University of Tech** - Computer Science Student (2013-2017)

Each entry includes:
- ✅ Company info (name, size, industry, website)
- ✅ Position details (title, dates, location, current status)
- ✅ Job description and key achievements
- ✅ Technology stack and skills
- ✅ Metadata (created/updated timestamps)

## 🎯 Advanced Features

### Response Simulation
- Randomized delays (100-300ms) to simulate real database calls
- Status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Error)
- Comprehensive error messages and validation

### Filtering & Search
- Text search across company, position, and description
- Exact company matches
- Current/nature filtering
- Combined filter support

### Statistics Calculation
- Total experiences count
- Current positions tracking
- Companies worked for
- Years of experience calculation
- Top technologies used
- Industry distribution

## 🔗 Integration Ready

### CORS Configuration
- Allows frontend requests from `http://localhost:3000`
- Configured headers for Content-Type and Authorization
- Ready for production CORS settings

### Consistent Response Format
```json
{
  "success": true,
  "data": {},     // Main response data
  "count": 8,     // Result count (for lists)
  "total": 8,     // Total available items
  "message": "",  // Success/failure messages
  "error": "",    // Error details
  "filters": {}   // Applied filters info
}
```

## 🎓 What's Next - Day 26

This Day 25 API server provides the perfect backend for creating:
- ✅ React components to display work experiences
- ✅ Forms for adding/editing experiences
- ✅ Advanced filtering and search
- ✅ Statistics dashboards
- ✅ Portfolio integrations

**Ready to build Day 26: Basic Work Experience Components!** 🚀

---

**Quick Start:** Run `node work-experience-api-server.js` and visit `http://localhost:3000/api/work-experience` to see your data!
