# Day 16: Combined APIs - MERN Stack Ascent

## 🎯 Challenge Overview

Welcome to **Day 16** of our intensive MERN Stack Ascent! Today we're taking our API development to the next level by combining all the individual APIs we've built into a unified, powerful system. This is our fourth reinforcement day where we apply advanced concepts in multi-resource API design and data relationships.

## 📚 Core Concepts Covered

### ✅ Multi-Resource APIs
- **Unified API Architecture** - Single endpoints serving multiple resources
- **Cross-Resource Relationships** - Connecting data across different entities
- **Advanced Query Operations** - Complex filtering and aggregation
- **Unified Data Access** - Single interface for multiple data types

### ✅ Data Relationships
- **Cross-Resource Queries** - Joining data from multiple collections
- **Data Synchronization** - Maintaining consistency across resources
- **Relationship Mapping** - Technology-to-project-to-experience connections
- **Advanced Aggregation** - MongoDB aggregation pipelines

### ✅ Advanced Queries
- **Complex Filtering** - Multi-criteria search across resources
- **Aggregation Operations** - Advanced data processing and analytics
- **Performance Optimization** - Efficient query execution
- **Caching Strategies** - Response caching and optimization

## 🏗️ What You'll Build

### Unified API System Architecture
```
📁 Combined API System
├── 🔗 Unified Endpoints
│   ├── GET /api/profile/dashboard
│   ├── GET /api/profile/portfolio
│   └── GET /api/search
├── 📊 Analytics Endpoints
│   ├── GET /api/analytics/skills
│   ├── GET /api/analytics/career
│   └── GET /api/analytics/technology
├── 🔍 Advanced Search
│   ├── Cross-resource search
│   ├── Filtered results
│   └── Relevance ranking
└── 📈 Insights & Reports
    ├── Technology trends
    ├── Career progression
    └── Performance metrics
```

### Multi-Resource Data Relationships
```
👤 User Profile
├── 💼 Work Experience (1:N)
├── 🚀 Projects (1:N)
└── 🛠️ Skills (1:N)

🔗 Technology Connections
├── Skills ↔ Projects (M:N)
├── Skills ↔ Work Experience (M:N)
└── Projects ↔ Work Experience (M:N)
```

## 💡 Key Features

### 🔧 Advanced Data Relationships
```javascript
// Cross-resource data connections
const userProfile = {
  user: userData,
  workExperience: workExperienceData,
  projects: projectData,
  skills: skillData,
  analytics: {
    totalExperience: calculateExperience(),
    technologyStats: analyzeTechnologies(),
    skillProficiency: calculateProficiency()
  }
};
```

### 📊 Unified Analytics
```javascript
// Combined analytics across all resources
const analytics = {
  technologyTrends: analyzeTechnologyUsage(),
  careerProgression: trackCareerGrowth(),
  skillDevelopment: monitorSkillGrowth(),
  projectSuccess: measureProjectMetrics()
};
```

### 🔍 Advanced Search Capabilities
```javascript
// Search across all resources simultaneously
GET /api/search?query=react&type=all&sort=relevance

// Response includes results from:
// - Projects containing "react"
// - Work experience with "react" technology
// - Skills related to "react"
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Postman (for API testing)
- Individual APIs from Days 13-15

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/mern-stack-ascent.git
cd mern-stack-ascent/Day-16

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure MongoDB connection and API settings

# Start the development server
npm run dev
```

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/combined-api
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
API_VERSION=v1
```

## 📋 Implementation Guide

### 1. Project Architecture Setup
```bash
combined-api/
├── controllers/
│   ├── profileController.js      # Unified profile endpoints
│   ├── searchController.js       # Cross-resource search
│   ├── analyticsController.js    # Analytics and insights
│   └── syncController.js         # Data synchronization
├── models/
│   ├── User.js                   # Enhanced user model
│   ├── WorkExperience.js         # Work experience model
│   ├── Project.js               # Project model
│   └── Skill.js                 # Skill model
├── routes/
│   ├── profile.js               # Profile routes
│   ├── search.js                # Search routes
│   ├── analytics.js             # Analytics routes
│   └── index.js                 # Main router
├── middleware/
│   ├── validation.js            # Cross-resource validation
│   ├── caching.js               # Response caching
│   └── sync.js                  # Data synchronization
├── services/
│   ├── dataSyncService.js       # Data synchronization
│   ├── analyticsService.js      # Analytics processing
│   └── searchService.js         # Search functionality
└── utils/
    ├── aggregation.js           # MongoDB aggregations
    ├── relationships.js         # Data relationships
    └── performance.js           # Performance utilities
```

### 2. Enhanced Data Models

#### Unified User Profile Model
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, maxlength: 500 },
  avatar: String,
  location: {
    city: String,
    country: String,
    timezone: String
  },
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true }
  },
  stats: {
    totalProjects: { type: Number, default: 0 },
    totalExperience: { type: Number, default: 0 }, // in months
    skillCount: { type: Number, default: 0 },
    lastActive: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for profile completeness
userSchema.virtual('profileCompleteness').get(function() {
  let score = 0;
  const totalFields = 8;

  if (this.name) score++;
  if (this.email) score++;
  if (this.bio) score++;
  if (this.avatar) score++;
  if (this.location.city) score++;
  if (this.socialLinks.github) score++;
  if (this.socialLinks.linkedin) score++;
  if (this.preferences.theme) score++;

  return Math.round((score / totalFields) * 100);
});

module.exports = mongoose.model('User', userSchema);
```

#### Enhanced Project Model with Relationships
```javascript
// models/Project.js
const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'api', 'game', 'other'],
    default: 'web'
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'on-hold'],
    default: 'completed'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  urls: {
    github: String,
    live: String,
    demo: String
  },
  media: {
    images: [String],
    videos: [String],
    thumbnail: String
  },
  metrics: {
    stars: Number,
    forks: Number,
    views: Number,
    downloads: Number
  },
  featured: { type: Boolean, default: false },
  tags: [String],
  collaborators: [{
    name: String,
    role: String,
    contact: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.createdAt) return null;

  const now = this.status === 'completed' ? (this.updatedAt || new Date()) : new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`;
  return `${Math.ceil(diffDays / 365)} years`;
});

module.exports = mongoose.model('Project', projectSchema);
```

### 3. Unified Profile Controller

#### Complete Profile Endpoint
```javascript
// controllers/profileController.js
const User = require('../models/User');
const WorkExperience = require('../models/WorkExperience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// @desc    Get complete user profile with all relationships
// @route   GET /api/profile/:userId/complete
// @access  Public
const getCompleteProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all related data in parallel
    const [user, workExperience, projects, skills] = await Promise.all([
      User.findById(userId),
      WorkExperience.find({ user: userId })
        .sort({ startDate: -1 })
        .populate('user', 'name email'),
      Project.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name email'),
      Skill.find({ user: userId })
        .sort({ proficiency: -1, yearsOfExperience: -1 })
        .populate('user', 'name email')
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate analytics
    const analytics = {
      totalExperience: calculateTotalExperience(workExperience),
      technologyStats: analyzeTechnologyUsage(projects, workExperience, skills),
      skillProficiency: calculateSkillProficiency(skills),
      projectStats: calculateProjectStats(projects),
      careerProgression: analyzeCareerProgression(workExperience)
    };

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          profileCompleteness: user.profileCompleteness
        },
        workExperience,
        projects,
        skills,
        analytics,
        meta: {
          experienceCount: workExperience.length,
          projectCount: projects.length,
          skillCount: skills.length,
          featuredProjects: projects.filter(p => p.featured).length
        }
      }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complete profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions for analytics
function calculateTotalExperience(workExperience) {
  return workExperience.reduce((total, exp) => {
    const endDate = exp.current ? new Date() : (exp.endDate || new Date());
    const months = (endDate.getFullYear() - exp.startDate.getFullYear()) * 12 +
                   (endDate.getMonth() - exp.startDate.getMonth());
    return total + Math.max(0, months);
  }, 0);
}

function analyzeTechnologyUsage(projects, workExperience, skills) {
  const techUsage = {};

  // Count from projects
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      if (!techUsage[tech]) techUsage[tech] = { projects: 0, experience: 0, skills: 0 };
      techUsage[tech].projects++;
    });
  });

  // Count from work experience
  workExperience.forEach(exp => {
    exp.technologies.forEach(tech => {
      if (!techUsage[tech]) techUsage[tech] = { projects: 0, experience: 0, skills: 0 };
      techUsage[tech].experience++;
    });
  });

  // Count from skills
  skills.forEach(skill => {
    const tech = skill.name.toLowerCase();
    if (!techUsage[tech]) techUsage[tech] = { projects: 0, experience: 0, skills: 0 };
    techUsage[tech].skills++;
  });

  // Calculate total usage and sort
  return Object.entries(techUsage)
    .map(([tech, usage]) => ({
      technology: tech,
      ...usage,
      total: usage.projects + usage.experience + usage.skills
    }))
    .sort((a, b) => b.total - a.total);
}

function calculateSkillProficiency(skills) {
  const proficiencyLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalProficiency = 0;

  skills.forEach(skill => {
    proficiencyLevels[skill.proficiency]++;
    totalProficiency += skill.proficiency;
  });

  return {
    levels: proficiencyLevels,
    average: skills.length > 0 ? (totalProficiency / skills.length).toFixed(1) : 0,
    totalSkills: skills.length
  };
}

function calculateProjectStats(projects) {
  const categories = {};
  const statuses = {};

  projects.forEach(project => {
    // Count categories
    categories[project.category] = (categories[project.category] || 0) + 1;

    // Count statuses
    statuses[project.status] = (statuses[project.status] || 0) + 1;
  });

  return {
    byCategory: categories,
    byStatus: statuses,
    featuredCount: projects.filter(p => p.featured).length,
    totalProjects: projects.length
  };
}

function analyzeCareerProgression(workExperience) {
  if (workExperience.length === 0) return null;

  const sorted = workExperience.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return {
    firstPosition: sorted[0].position,
    currentPosition: sorted.find(exp => exp.current)?.position || sorted[sorted.length - 1].position,
    companyProgression: sorted.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present'
    })),
    positionCount: new Set(sorted.map(exp => exp.position)).size,
    companyCount: new Set(sorted.map(exp => exp.company)).size
  };
}

module.exports = {
  getCompleteProfile
};
```

### 4. Advanced Search Controller

#### Cross-Resource Search Implementation
```javascript
// controllers/searchController.js
const User = require('../models/User');
const WorkExperience = require('../models/WorkExperience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// @desc    Search across all resources
// @route   GET /api/search
// @access  Public
const searchAllResources = async (req, res) => {
  try {
    const {
      q: query,
      type,
      userId,
      limit = 10,
      page = 1,
      sort = 'relevance'
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const results = {};
    const searchPromises = [];

    // Search users if no specific userId provided
    if (!userId) {
      searchPromises.push(
        User.find({
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { bio: searchRegex }
          ]
        }).limit(5).then(users => results.users = users)
      );
    }

    // Determine which resources to search
    const searchTypes = type && type !== 'all' ? [type] : ['projects', 'experience', 'skills'];

    // Search projects
    if (searchTypes.includes('projects')) {
      const projectQuery = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { technologies: searchRegex },
          { tags: searchRegex }
        ]
      };

      if (userId) projectQuery.user = userId;

      searchPromises.push(
        Project.find(projectQuery)
          .populate('user', 'name email')
          .limit(limit)
          .sort({ createdAt: -1 })
          .then(projects => results.projects = projects)
      );
    }

    // Search work experience
    if (searchTypes.includes('experience')) {
      const experienceQuery = {
        $or: [
          { company: searchRegex },
          { position: searchRegex },
          { description: searchRegex },
          { technologies: searchRegex },
          { achievements: searchRegex }
        ]
      };

      if (userId) experienceQuery.user = userId;

      searchPromises.push(
        WorkExperience.find(experienceQuery)
          .populate('user', 'name email')
          .limit(limit)
          .sort({ startDate: -1 })
          .then(experiences => results.workExperience = experiences)
      );
    }

    // Search skills
    if (searchTypes.includes('skills')) {
      const skillQuery = {
        $or: [
          { name: searchRegex },
          { category: searchRegex }
        ]
      };

      if (userId) skillQuery.user = userId;

      searchPromises.push(
        Skill.find(skillQuery)
          .populate('user', 'name email')
          .limit(limit)
          .sort({ proficiency: -1 })
          .then(skills => results.skills = skills)
      );
    }

    // Execute all searches in parallel
    await Promise.all(searchPromises);

    // Calculate total results
    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    // Add relevance scoring
    if (sort === 'relevance') {
      results.projects = addRelevanceScore(results.projects || [], query, ['title', 'technologies']);
      results.workExperience = addRelevanceScore(results.workExperience || [], query, ['company', 'position', 'technologies']);
      results.skills = addRelevanceScore(results.skills || [], query, ['name']);
    }

    res.json({
      success: true,
      data: results,
      meta: {
        query: query.trim(),
        type: type || 'all',
        totalResults,
        searchTypes,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to add relevance scoring
function addRelevanceScore(items, query, fields) {
  const queryLower = query.toLowerCase();

  return items.map(item => {
    let score = 0;

    fields.forEach(field => {
      const value = item[field];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val.toLowerCase().includes(queryLower)) {
              score += 2; // Higher score for array matches
            }
          });
        } else if (value.toLowerCase().includes(queryLower)) {
          score += 1;
        }
      }
    });

    return { ...item.toObject(), relevanceScore: score };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

module.exports = {
  searchAllResources
};
```

### 5. Analytics Controller

#### Technology Analytics Implementation
```javascript
// controllers/analyticsController.js
const User = require('../models/User');
const WorkExperience = require('../models/WorkExperience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// @desc    Get technology usage analytics
// @route   GET /api/analytics/technology
// @access  Public
const getTechnologyAnalytics = async (req, res) => {
  try {
    const { userId, period = 'all' } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Build date filter for period
    let dateFilter = {};
    if (period !== 'all') {
      const now = new Date();
      const periodStart = new Date();

      switch (period) {
        case 'year':
          periodStart.setFullYear(now.getFullYear() - 1);
          break;
        case '6months':
          periodStart.setMonth(now.getMonth() - 6);
          break;
        case '3months':
          periodStart.setMonth(now.getMonth() - 3);
          break;
        case 'month':
          periodStart.setMonth(now.getMonth() - 1);
          break;
      }

      dateFilter = { createdAt: { $gte: periodStart } };
    }

    // Aggregate technology usage from all sources
    const [projectTech, experienceTech, skillTech] = await Promise.all([
      // Technology usage in projects
      Project.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId), ...dateFilter } },
        { $unwind: '$technologies' },
        {
          $group: {
            _id: { $toLower: '$technologies' },
            projectCount: { $sum: 1 },
            categories: { $addToSet: '$category' },
            lastUsed: { $max: '$createdAt' }
          }
        }
      ]),

      // Technology usage in work experience
      WorkExperience.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $unwind: '$technologies' },
        {
          $group: {
            _id: { $toLower: '$technologies' },
            experienceCount: { $sum: 1 },
            companies: { $addToSet: '$company' },
            lastUsed: { $max: '$startDate' }
          }
        }
      ]),

      // Skills data
      Skill.find({ user: userId }).select('name proficiency yearsOfExperience')
    ]);

    // Combine and analyze technology data
    const technologyMap = new Map();

    // Process project technologies
    projectTech.forEach(item => {
      const tech = item._id;
      if (!technologyMap.has(tech)) {
        technologyMap.set(tech, {
          name: tech,
          projects: 0,
          experience: 0,
          skillLevel: 0,
          categories: [],
          companies: [],
          lastUsed: null
        });
      }
      const data = technologyMap.get(tech);
      data.projects = item.projectCount;
      data.categories = item.categories;
      data.lastUsed = item.lastUsed;
    });

    // Process experience technologies
    experienceTech.forEach(item => {
      const tech = item._id;
      if (!technologyMap.has(tech)) {
        technologyMap.set(tech, {
          name: tech,
          projects: 0,
          experience: 0,
          skillLevel: 0,
          categories: [],
          companies: [],
          lastUsed: null
        });
      }
      const data = technologyMap.get(tech);
      data.experience = item.experienceCount;
      data.companies = item.companies;
      if (item.lastUsed > data.lastUsed) {
        data.lastUsed = item.lastUsed;
      }
    });

    // Process skills
    skillTech.forEach(skill => {
      const tech = skill.name.toLowerCase();
      if (!technologyMap.has(tech)) {
        technologyMap.set(tech, {
          name: tech,
          projects: 0,
          experience: 0,
          skillLevel: 0,
          categories: [],
          companies: [],
          lastUsed: null
        });
      }
      const data = technologyMap.get(tech);
      data.skillLevel = skill.proficiency;
    });

    // Convert to array and calculate totals
    const technologies = Array.from(technologyMap.values()).map(tech => ({
      ...tech,
      totalUsage: tech.projects + tech.experience,
      usageScore: calculateUsageScore(tech)
    }));

    // Sort by usage score
    technologies.sort((a, b) => b.usageScore - a.usageScore);

    // Calculate summary statistics
    const summary = {
      totalTechnologies: technologies.length,
      mostUsed: technologies[0] || null,
      averageSkillLevel: calculateAverageSkillLevel(technologies),
      trendingTechnologies: getTrendingTechnologies(technologies),
      categoryDistribution: calculateCategoryDistribution(technologies)
    };

    res.json({
      success: true,
      data: technologies,
      summary,
      meta: {
        userId,
        period,
        dateFilter: period !== 'all' ? dateFilter : null
      }
    });
  } catch (error) {
    console.error('Technology analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate technology analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper functions
function calculateUsageScore(tech) {
  const { projects, experience, skillLevel } = tech;
  return (projects * 2) + experience + (skillLevel * 0.5);
}

function calculateAverageSkillLevel(technologies) {
  const withSkills = technologies.filter(t => t.skillLevel > 0);
  if (withSkills.length === 0) return 0;

  const total = withSkills.reduce((sum, t) => sum + t.skillLevel, 0);
  return (total / withSkills.length).toFixed(1);
}

function getTrendingTechnologies(technologies) {
  return technologies
    .filter(t => t.lastUsed)
    .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
    .slice(0, 5);
}

function calculateCategoryDistribution(technologies) {
  const distribution = {};

  technologies.forEach(tech => {
    tech.categories.forEach(category => {
      distribution[category] = (distribution[category] || 0) + tech.totalUsage;
    });
  });

  return distribution;
}

module.exports = {
  getTechnologyAnalytics
};
```

### 6. Data Synchronization Service

#### Cross-Resource Data Sync Implementation
```javascript
// services/dataSyncService.js
const WorkExperience = require('../models/WorkExperience');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const User = require('../models/User');

class DataSyncService {
  constructor() {
    this.syncQueue = [];
    this.isProcessing = false;
  }

  // Sync skill proficiency based on usage across projects and experience
  async syncSkillProficiency(userId) {
    try {
      console.log(`Starting skill proficiency sync for user: ${userId}`);

      // Get all skills for the user
      const skills = await Skill.find({ user: userId });
      if (skills.length === 0) {
        console.log('No skills found for user');
        return { synced: 0, message: 'No skills to sync' };
      }

      // Analyze technology usage
      const [projects, workExperience] = await Promise.all([
        Project.find({ user: userId }),
        WorkExperience.find({ user: userId })
      ]);

      // Calculate technology usage frequency
      const technologyUsage = this.calculateTechnologyUsage(projects, workExperience);

      // Update skill proficiency based on usage
      const updatePromises = skills.map(async (skill) => {
        const usage = technologyUsage[skill.name.toLowerCase()] || 0;
        const newProficiency = this.calculateProficiencyFromUsage(usage, skill.yearsOfExperience);

        if (newProficiency !== skill.proficiency) {
          skill.proficiency = newProficiency;
          skill.lastSynced = new Date();
          await skill.save();

          console.log(`Updated skill ${skill.name}: ${skill.proficiency} -> ${newProficiency}`);
          return { skill: skill.name, oldValue: skill.proficiency, newValue: newProficiency, updated: true };
        }

        return { skill: skill.name, updated: false };
      });

      const results = await Promise.all(updatePromises);
      const updatedCount = results.filter(r => r.updated).length;

      console.log(`Skill proficiency sync completed. Updated ${updatedCount} skills.`);

      return {
        success: true,
        synced: updatedCount,
        total: skills.length,
        results,
        message: `Successfully synced ${updatedCount} skills`
      };
    } catch (error) {
      console.error('Skill proficiency sync error:', error);
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  // Sync project technologies with skills
  async syncProjectTechnologies(userId) {
    try {
      console.log(`Starting project technology sync for user: ${userId}`);

      const [projects, existingSkills] = await Promise.all([
        Project.find({ user: userId }),
        Skill.find({ user: userId })
      ]);

      const existingSkillNames = new Set(
        existingSkills.map(skill => skill.name.toLowerCase())
      );

      // Find technologies used in projects but not in skills
      const missingTechnologies = new Set();

      projects.forEach(project => {
        project.technologies.forEach(tech => {
          const techLower = tech.toLowerCase();
          if (!existingSkillNames.has(techLower)) {
            missingTechnologies.add(tech);
          }
        });
      });

      // Create new skills for missing technologies
      const newSkills = Array.from(missingTechnologies).map(tech => ({
        user: userId,
        name: tech,
        category: this.guessSkillCategory(tech),
        proficiency: 1, // Start with basic proficiency
        yearsOfExperience: 0,
        lastSynced: new Date()
      }));

      if (newSkills.length > 0) {
        const createdSkills = await Skill.insertMany(newSkills);
        console.log(`Created ${createdSkills.length} new skills from project technologies`);
      }

      return {
        success: true,
        created: newSkills.length,
        technologies: Array.from(missingTechnologies),
        message: `Created ${newSkills.length} new skills from project technologies`
      };
    } catch (error) {
      console.error('Project technology sync error:', error);
      throw new Error(`Project sync failed: ${error.message}`);
    }
  }

  // Comprehensive data validation
  async validateDataConsistency(userId) {
    try {
      const [user, workExperience, projects, skills] = await Promise.all([
        User.findById(userId),
        WorkExperience.find({ user: userId }),
        Project.find({ user: userId }),
        Skill.find({ user: userId })
      ]);

      const issues = [];

      // Check for orphaned records
      if (workExperience.some(exp => exp.user.toString() !== userId)) {
        issues.push('Found work experience records with mismatched user IDs');
      }

      if (projects.some(project => project.user.toString() !== userId)) {
        issues.push('Found project records with mismatched user IDs');
      }

      if (skills.some(skill => skill.user.toString() !== userId)) {
        issues.push('Found skill records with mismatched user IDs');
      }

      // Check for data consistency
      const projectTechnologies = new Set();
      projects.forEach(project => {
        project.technologies.forEach(tech => projectTechnologies.add(tech.toLowerCase()));
      });

      const skillNames = new Set();
      skills.forEach(skill => skillNames.add(skill.name.toLowerCase()));

      // Find technologies used in projects but not listed as skills
      const missingSkills = Array.from(projectTechnologies).filter(
        tech => !skillNames.has(tech)
      );

      if (missingSkills.length > 0) {
        issues.push(`Found ${missingSkills.length} technologies used in projects but not listed as skills: ${missingSkills.join(', ')}`);
      }

      return {
        success: true,
        issues: issues.length > 0 ? issues : ['All data is consistent'],
        hasIssues: issues.length > 0,
        stats: {
          workExperience: workExperience.length,
          projects: projects.length,
          skills: skills.length,
          missingSkills: missingSkills.length
        }
      };
    } catch (error) {
      console.error('Data consistency validation error:', error);
      throw new Error(`Validation failed: ${error.message}`);
    }
  }

  // Helper methods
  calculateTechnologyUsage(projects, workExperience) {
    const usage = {};

    // Count from projects (weighted higher)
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        const key = tech.toLowerCase();
        usage[key] = (usage[key] || 0) + 2;
      });
    });

    // Count from work experience
    workExperience.forEach(exp => {
      exp.technologies.forEach(tech => {
        const key = tech.toLowerCase();
        usage[key] = (usage[key] || 0) + 1;
      });
    });

    return usage;
  }

  calculateProficiencyFromUsage(usage, yearsOfExperience = 0) {
    // Base proficiency on usage frequency
    let proficiency = 1;

    if (usage >= 8) proficiency = 5;
    else if (usage >= 6) proficiency = 4;
    else if (usage >= 4) proficiency = 3;
    else if (usage >= 2) proficiency = 2;

    // Adjust based on experience
    if (yearsOfExperience >= 5) proficiency = Math.min(5, proficiency + 1);
    else if (yearsOfExperience >= 3) proficiency = Math.min(5, proficiency + 0.5);

    return Math.round(proficiency);
  }

  guessSkillCategory(technology) {
    const tech = technology.toLowerCase();

    const categories = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'tailwind'],
      backend: ['node', 'express', 'python', 'java', 'php', 'ruby', 'go', 'rust'],
      database: ['mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch'],
      devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ionic']
    };

    for (const [category, technologies] of Object.entries(categories)) {
      if (technologies.some(t => tech.includes(t))) {
        return category;
      }
    }

    return 'other';
  }
}

module.exports = new DataSyncService();
```

## 🧪 Testing Your Combined API

### Test Scenarios

#### 1. Complete Profile Endpoint
```bash
# Get complete user profile
curl -X GET "http://localhost:5000/api/profile/64f1a2b3c4d5e6f7g8h9i0j1/complete"

# Expected response includes:
# - User data
# - Work experience
# - Projects
# - Skills
# - Analytics
```

#### 2. Cross-Resource Search
```bash
# Search for "react" across all resources
curl -X GET "http://localhost:5000/api/search?q=react&type=all&limit=5"

# Search only in projects
curl -X GET "http://localhost:5000/api/search?q=react&type=projects"
```

#### 3. Technology Analytics
```bash
# Get technology usage analytics
curl -X GET "http://localhost:5000/api/analytics/technology?userId=64f1a2b3c4d5e6f7g8h9i0j1&period=year"

# Get analytics for last 6 months
curl -X GET "http://localhost:5000/api/analytics/technology?userId=64f1a2b3c4d5e6f7g8h9i0j1&period=6months"
```

#### 4. Data Synchronization
```bash
# Sync skill proficiency
curl -X POST "http://localhost:5000/api/sync/skills/64f1a2b3c4d5e6f7g8h9i0j1"

# Sync project technologies
curl -X POST "http://localhost:5000/api/sync/projects/64f1a2b3c4d5e6f7g8h9i0j1"

# Validate data consistency
curl -X GET "http://localhost:5000/api/sync/validate/64f1a2b3c4d5e6f7g8h9i0j1"
```

## 🚀 Advanced Features Implemented

### ✅ Multi-Resource Relationships
- **Cross-resource data connections** using MongoDB aggregation
- **Technology mapping** across projects, experience, and skills
- **User-centric data architecture** with centralized relationships

### ✅ Advanced Query Optimization
- **Compound queries** with multiple conditions
- **Aggregation pipelines** for complex analytics
- **Indexing strategies** for performance
- **Query result caching** for frequently accessed data

### ✅ Data Synchronization
- **Automatic skill proficiency updates** based on usage
- **Technology discovery** from project descriptions
- **Data consistency validation** across all resources
- **Real-time sync capabilities** for live updates

### ✅ Analytics & Insights
- **Technology usage analytics** with trends and patterns
- **Career progression tracking** with timeline visualization
- **Skill development monitoring** with proficiency metrics
- **Performance insights** with actionable recommendations

## 📊 Performance Optimizations

### Database Optimization
```javascript
// Strategic indexing
WorkExperience.collection.createIndex({ user: 1, startDate: -1 });
Project.collection.createIndex({ user: 1, technologies: 1 });
Skill.collection.createIndex({ user: 1, proficiency: -1 });

// Query optimization
const optimizedQuery = WorkExperience
  .find({ user: userId })
  .select('company position technologies startDate')
  .sort({ startDate: -1 })
  .lean(); // Use lean() for read-only operations
```

### Response Caching
```javascript
// Redis caching implementation
const cacheKey = `profile:${userId}:${Date.now()}`;

const cachedData = await redis.get(cacheKey);
if (cachedData) {
  return res.json(JSON.parse(cachedData));
}

// Generate fresh data
const freshData = await generateCompleteProfile(userId);

// Cache for 1 hour
await redis.setex(cacheKey, 3600, JSON.stringify(freshData));

res.json(freshData);
```

## 🔒 Security Enhancements

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
```

### Input Validation & Sanitization
```javascript
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

// Comprehensive input validation
const validateInput = (req, res, next) => {
  const { company, position, technologies } = req.body;

  if (!validator.isLength(company, { min: 2, max: 100 })) {
    return res.status(400).json({ error: 'Company name must be 2-100 characters' });
  }

  if (!validator.isLength(position, { min: 2, max: 100 })) {
    return res.status(400).json({ error: 'Position must be 2-100 characters' });
  }

  // Sanitize HTML content
  if (req.body.description) {
    req.body.description = sanitizeHtml(req.body.description);
  }

  next();
};
```

## 🎯 Learning Outcomes

After completing Day 16, you'll master:

- ✅ **Multi-Resource API Architecture** - Unified endpoints serving complex data relationships
- ✅ **Advanced MongoDB Aggregation** - Complex queries and data processing pipelines
- ✅ **Cross-Resource Data Relationships** - Connecting data across multiple collections
- ✅ **Data Synchronization Services** - Maintaining consistency across distributed data
- ✅ **Performance Optimization** - Caching, indexing, and query optimization strategies
- ✅ **Analytics & Insights** - Generating meaningful insights from complex datasets
- ✅ **Security Best Practices** - Rate limiting, input validation, and data sanitization

## 🔗 Integration Points

### Connecting with Previous Days
- **Day 13**: Uses the Work Experience API as foundation
- **Day 14**: Integrates with Projects API for technology mapping
- **Day 15**: Connects with Skills API for proficiency tracking
- **Day 17**: Provides foundation for comprehensive API testing

### Future Integration
- **Day 19-24**: React frontend will consume these unified endpoints
- **Day 31-45**: Capstone project will build upon this architecture

## 📝 Submission Requirements

1. **Complete Implementation**: Build the full Combined API system
2. **Testing**: Test all endpoints using Postman with various scenarios
3. **Documentation**: Document all API endpoints with examples
4. **Performance**: Implement caching and query optimization
5. **Security**: Add rate limiting and input validation
6. **GitHub**: Push your code with comprehensive documentation
7. **Demo**: Create a demo showcasing cross-resource functionality

## 🎉 Congratulations!

You've successfully built a **production-ready Combined API system** that unifies multiple data sources into a powerful, efficient, and scalable architecture! 🏆

**Key Achievements:**
- ✅ **Unified API Architecture** with cross-resource relationships
- ✅ **Advanced Analytics Engine** with real-time insights
- ✅ **Data Synchronization Services** ensuring consistency
- ✅ **Performance Optimizations** for enterprise-level scalability
- ✅ **Security Best Practices** protecting your data
- ✅ **Comprehensive Testing** ensuring reliability

**Next Steps:**
Tomorrow we'll dive into **API Testing** with comprehensive test suites that validate all your hard work!

**Keep building amazing things! The MERN Stack Master awaits! 🚀**
