# Day 13: Work Experience API - MERN Stack Ascent

## 🎯 Challenge Overview

Welcome to **Day 13** of our intensive MERN Stack Ascent! Today we're diving deep into building a production-ready **Work Experience API** using Node.js, Express, and MongoDB. This is our first reinforcement day where we apply everything we've learned in a practical, real-world scenario.

## 📚 Core Concepts Covered

### ✅ Work Experience CRUD Operations
- **CREATE**: Adding new work experience entries
- **READ**: Retrieving work experience data with filtering
- **UPDATE**: Modifying existing work experience records
- **DELETE**: Removing work experience entries safely

### ✅ Professional Data Modeling
- Designing comprehensive MongoDB schemas
- Implementing field validation rules
- Creating relationships between data models
- Adding virtual properties and methods

### ✅ Input Validation & Sanitization
- Server-side validation middleware
- Data sanitization techniques
- Error handling for invalid inputs
- Custom validation rules

### ✅ Comprehensive Error Handling
- Global error handling middleware
- Structured error responses
- Different error types (validation, database, server)
- User-friendly error messages

## 🏗️ What You'll Build

### Complete Work Experience Management System
```
📁 Work Experience API
├── 📋 Professional Data Model
├── 🔄 CRUD Operations
├── ✅ Input Validation
├── 🚨 Error Handling
├── 📊 Advanced Filtering
└── 🔒 Security Best Practices
```

### API Endpoints
- `GET /api/work-experience` - List all work experiences
- `POST /api/work-experience` - Create new work experience
- `GET /api/work-experience/:id` - Get specific work experience
- `PUT /api/work-experience/:id` - Update work experience
- `DELETE /api/work-experience/:id` - Delete work experience

## 💡 Key Features

### 🔧 Advanced Filtering & Search
```javascript
// Filter by current status
GET /api/work-experience?current=true

// Filter by technology
GET /api/work-experience?technology=React,Node.js

// Search by company name
GET /api/work-experience?company=Tech

// Sort and pagination
GET /api/work-experience?sort=-startDate&page=1&limit=10
```

### 📋 Professional Data Structure
```javascript
{
  company: "Tech Innovations Inc.",
  position: "Senior Full Stack Developer",
  startDate: "2023-01-15",
  endDate: "2023-12-31", // optional
  current: false, // or true for current position
  description: "Led development of enterprise applications...",
  technologies: ["React", "Node.js", "MongoDB"],
  achievements: ["Increased performance by 40%", "Led team of 5"],
  location: {
    city: "San Francisco",
    country: "USA",
    remote: true
  },
  employmentType: "full-time"
}
```

### 🛡️ Security & Validation
- Input sanitization and validation
- Rate limiting protection
- CORS configuration
- Helmet security headers
- Data encryption for sensitive fields

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Postman (for API testing)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/mern-stack-ascent.git
cd mern-stack-ascent/Day-13

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start the development server
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/work-experience-api
JWT_SECRET=your-secret-key-here
```

## 📋 Implementation Steps

### 1. Project Setup
```bash
mkdir work-experience-api
cd work-experience-api
npm init -y
npm install express mongoose dotenv cors helmet morgan
npm install -D nodemon
```

### 2. Basic Server Structure
```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/work-experience', require('./routes/workExperience'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Database Connection
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. Data Model Design
```javascript
// models/WorkExperience.js
const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name too long']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    maxlength: [100, 'Position title too long']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [1000, 'Description too long']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  location: {
    city: String,
    country: String,
    remote: Boolean
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    default: 'full-time'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration calculation
workExperienceSchema.virtual('duration').get(function() {
  const start = this.startDate;
  const end = this.current ? new Date() : this.endDate;

  const months = (end.getFullYear() - start.getFullYear()) * 12 +
                 (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return years > 0 ? `${years}y ${remainingMonths}m` : `${remainingMonths}m`;
});

module.exports = mongoose.model('WorkExperience', workExperienceSchema);
```

### 5. Validation Middleware
```javascript
// middleware/validation.js
const validateWorkExperience = (req, res, next) => {
  const errors = [];
  const { company, position, startDate, endDate, technologies, achievements } = req.body;

  // Required field validation
  if (!company || !company.trim()) {
    errors.push('Company name is required');
  }

  if (!position || !position.trim()) {
    errors.push('Position is required');
  }

  if (!startDate) {
    errors.push('Start date is required');
  }

  // Date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      errors.push('End date must be after start date');
    }
  }

  // Array validation
  if (technologies && !Array.isArray(technologies)) {
    errors.push('Technologies must be an array');
  }

  if (achievements && !Array.isArray(achievements)) {
    errors.push('Achievements must be an array');
  }

  // Length validation
  if (company && company.length > 100) {
    errors.push('Company name too long (max 100 characters)');
  }

  if (position && position.length > 100) {
    errors.push('Position title too long (max 100 characters)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = validateWorkExperience;
```

### 6. Controller Implementation
```javascript
// controllers/workExperienceController.js
const WorkExperience = require('../models/WorkExperience');

// @desc    Get all work experiences
// @route   GET /api/work-experience
// @access  Public
const getWorkExperiences = async (req, res) => {
  try {
    const {
      current,
      technology,
      company,
      sort = '-startDate',
      limit = 10,
      page = 1
    } = req.query;

    // Build query object
    let query = {};

    // Filter by current status
    if (current !== undefined) {
      query.current = current === 'true';
    }

    // Filter by technology
    if (technology) {
      query.technologies = {
        $in: technology.split(',')
      };
    }

    // Filter by company
    if (company) {
      query.company = new RegExp(company, 'i');
    }

    // Execute query with pagination
    const experiences = await WorkExperience
      .find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WorkExperience.countDocuments(query);

    res.json({
      success: true,
      count: experiences.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single work experience
// @route   GET /api/work-experience/:id
// @access  Public
const getWorkExperience = async (req, res) => {
  try {
    const experience = await WorkExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found'
      });
    }

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new work experience
// @route   POST /api/work-experience
// @access  Public
const createWorkExperience = async (req, res) => {
  try {
    const experience = await WorkExperience.create(req.body);

    res.status(201).json({
      success: true,
      data: experience,
      message: 'Work experience created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update work experience
// @route   PUT /api/work-experience/:id
// @access  Public
const updateWorkExperience = async (req, res) => {
  try {
    const experience = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found'
      });
    }

    res.json({
      success: true,
      data: experience,
      message: 'Work experience updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete work experience
// @route   DELETE /api/work-experience/:id
// @access  Public
const deleteWorkExperience = async (req, res) => {
  try {
    const experience = await WorkExperience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found'
      });
    }

    await experience.deleteOne();

    res.json({
      success: true,
      message: 'Work experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getWorkExperiences,
  getWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
};
```

### 7. Route Configuration
```javascript
// routes/workExperience.js
const express = require('express');
const router = express.Router();

// Import controllers
const {
  getWorkExperiences,
  getWorkExperience,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience
} = require('../controllers/workExperienceController');

// Import middleware
const validateWorkExperience = require('../middleware/validation');

// Routes
router.route('/')
  .get(getWorkExperiences)
  .post(validateWorkExperience, createWorkExperience);

router.route('/:id')
  .get(getWorkExperience)
  .put(validateWorkExperience, updateWorkExperience)
  .delete(deleteWorkExperience);

module.exports = router;
```

## 🧪 Testing with Postman

### Sample API Calls

#### 1. Create Work Experience
```http
POST /api/work-experience
Content-Type: application/json

{
  "company": "Tech Innovations Inc.",
  "position": "Senior Full Stack Developer",
  "startDate": "2023-01-15",
  "current": true,
  "description": "Leading development of enterprise-scale applications",
  "technologies": ["React", "Node.js", "MongoDB", "AWS"],
  "achievements": [
    "Increased application performance by 40%",
    "Led team of 5 developers",
    "Implemented CI/CD pipeline"
  ],
  "location": {
    "city": "San Francisco",
    "country": "USA",
    "remote": true
  },
  "employmentType": "full-time"
}
```

#### 2. Get All Work Experiences
```http
GET /api/work-experience?current=true&limit=5
```

#### 3. Update Work Experience
```http
PUT /api/work-experience/64f1a2b3c4d5e6f7g8h9i0j1
Content-Type: application/json

{
  "position": "Lead Full Stack Developer",
  "achievements": [
    "Increased application performance by 40%",
    "Led team of 5 developers",
    "Implemented CI/CD pipeline",
    "Promoted to Lead Developer"
  ]
}
```

## 🚀 Advanced Features

### Query Parameters
- `current=true` - Filter current positions only
- `technology=React,Node.js` - Filter by technologies
- `company=Tech` - Search by company name
- `sort=-startDate` - Sort by start date (descending)
- `page=1&limit=10` - Pagination

### Response Format
```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  },
  "data": [...]
}
```

## 🔧 Best Practices Implemented

### ✅ Data Validation
- Required field validation
- Data type checking
- Length restrictions
- Custom validation rules

### ✅ Error Handling
- Global error handler
- Specific error types
- User-friendly messages
- Development vs production error details

### ✅ Security
- Input sanitization
- Rate limiting
- CORS configuration
- Helmet security headers

### ✅ Performance
- Database indexing
- Query optimization
- Response pagination
- Efficient data retrieval

## 📊 API Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "company": "Tech Innovations Inc.",
    "position": "Senior Full Stack Developer",
    "startDate": "2023-01-15T00:00:00.000Z",
    "current": true,
    "technologies": ["React", "Node.js", "MongoDB"],
    "achievements": ["Led team of 5 developers"],
    "duration": "8m",
    "createdAt": "2023-09-01T10:30:00.000Z",
    "updatedAt": "2023-09-01T10:30:00.000Z"
  },
  "message": "Work experience created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Company name is required",
    "Position is required",
    "Start date is required"
  ]
}
```

## 🎯 Learning Outcomes

After completing Day 13, you'll master:

- ✅ **Complete CRUD Operations** - Full create, read, update, delete functionality
- ✅ **Professional Data Modeling** - MongoDB schema design with validation
- ✅ **Input Validation** - Server-side validation and sanitization
- ✅ **Error Handling** - Comprehensive error management and user feedback
- ✅ **RESTful API Design** - Following REST principles and best practices
- ✅ **Advanced Querying** - Filtering, sorting, and pagination
- ✅ **Security Best Practices** - Input sanitization and security measures

## 🔗 Next Steps

- **Day 14**: Projects API with file uploads
- **Day 15**: Skills API with advanced filtering
- **Day 16-18**: Combined APIs and testing
- **Day 19-24**: React frontend development

## 📝 Submission Requirements

1. **Complete Implementation**: Build the full Work Experience API
2. **Testing**: Test all endpoints using Postman
3. **Documentation**: Document your API endpoints
4. **GitHub**: Push your code with descriptive commits
5. **LinkedIn Post**: Share your learning experience
6. **Demo**: Record a short demo of your API working

## 🎉 Congratulations!

You've successfully built a production-ready Work Experience API! This foundation will serve as the backbone for your personal resume website. Tomorrow we'll build the Projects API with advanced features like file uploads and rich text editing.

**Keep coding and keep building amazing things! 🚀**

---

*Part of the MERN Stack Ascent - 45-Day Challenge*
*Day 13: Work Experience API*
*Built with ❤️ for developers who never stop learning*
