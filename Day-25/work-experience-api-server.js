// Day 25: Work Experience API Backend
const express = require('express');

const app = express();
const PORT = 3000;

// ==================================================
// MOCK WORK EXPERIENCE DATA
// ==================================================

// Mock data for 6-8 different work experiences
const mockWorkExperience = [
    {
        id: 1,
        company: "Google",
        position: "Senior Frontend Developer",
        startDate: "2022-03-15",
        endDate: "2024-08-31",
        location: "Mountain View, CA",
        isCurrent: false,
        description: "Led development of modern React applications serving millions of users. Mentored junior developers and established best practices for the team.",
        achievements: [
            "Improved performance by 40% through code optimization and lazy loading",
            "Mentored 5 junior developers who were promoted within 6 months",
            "Led migration from legacy React 16 to React 18 with zero downtime"
        ],
        technologies: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
        companySize: "100,000+",
        industry: "Technology",
        website: "https://google.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 2,
        company: "Microsoft",
        position: "Software Engineer",
        startDate: "2020-06-01",
        endDate: null,
        location: "Seattle, WA",
        isCurrent: true,
        description: "Working on Azure cloud services team, focusing on React-based admin dashboards and API integrations. Part of the team that handles millions of daily requests.",
        achievements: [
            "Developed new dashboard UI serving 2M+ daily active users",
            "Reduced API response time by 30% through optimization",
            "Implemented automated testing that increased code coverage to 95%"
        ],
        technologies: ["React", "Azure DevOps", "TypeScript", "PostgreSQL", ".NET Core"],
        companySize: "150,000+",
        industry: "Technology",
        website: "https://microsoft.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 3,
        company: "Amazon Web Services",
        position: "Full Stack Developer",
        startDate: "2018-09-01",
        endDate: "2019-12-15",
        location: "Arlington, VA",
        isCurrent: false,
        description: "Part of the EC2 service team building internal management tools and monitoring dashboards. Worked closely with DevOps teams to improve deployment processes.",
        achievements: [
            "Built monitoring dashboard that reduced incident response time by 50%",
            "Automated deployment pipeline reducing deployment errors by 80%",
            "Presented at internal tech conference about React best practices"
        ],
        technologies: ["React", "Python", "Flask", "AWS", "DynamoDB", "Kubernetes"],
        companySize: "1,500,000+",
        industry: "Cloud Computing",
        website: "https://aws.amazon.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 4,
        company: "Netflix",
        position: "Frontend Engineer",
        startDate: "2017-02-01",
        endDate: "2018-05-30",
        location: "Los Gatos, CA",
        isCurrent: false,
        description: "Joined the streaming UI team working on user experience improvements and new feature development for the global platform serving 120M+ subscribers.",
        achievements: [
            "Implemented offline viewing feature that increased user retention",
            "Optimized video player component reducing crashes by 25%",
            "Collaborated with UX designers to improve accessibility compliance"
        ],
        technologies: ["React", "JavaScript", "SCSS", "Jest", "Enzyme", "A/B Testing"],
        companySize: "10,000+",
        industry: "Entertainment",
        website: "https://netflix.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 5,
        company: "Airbnb",
        position: "Product Engineer",
        startDate: "2016-07-15",
        endDate: "2016-11-30",
        location: "San Francisco, CA",
        isCurrent: false,
        description: "Contract position working on the host experience team. Redesigned booking management interface and improved data visualization for hosts.",
        achievements: [
            "Redesigned booking dashboard that increased host satisfaction by 25%",
            "Built data visualization tools that improved insight accuracy by 35%",
            "Mentored interns on React component architecture"
        ],
        technologies: ["React", "Redux", "Sass", "D3.js", "Node.js", "MongoDB"],
        companySize: "5,000+",
        industry: "Travel & Tourism",
        website: "https://airbnb.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 6,
        company: "StartupXYZ",
        position: "Lead Developer",
        startDate: "2015-03-01",
        endDate: "2016-01-15",
        location: "Austin, TX",
        isCurrent: false,
        description: "Early employee at a fintech startup that was acquired. Built the entire frontend from scratch and established development processes.",
        achievements: [
            "Built complete React application from scratch (50k+ lines of code)",
            "Established CI/CD pipeline and testing infrastructure",
            "Led successful product launch with zero downtime in first 6 months"
        ],
        technologies: ["React", "JavaScript", "Webpack", "Jest", "PostgreSQL", "Stripe API"],
        companySize: "50-100",
        industry: "Fintech",
        website: "https://startupxyz.com",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 7,
        company: "Freelance Development",
        position: "Web Developer",
        startDate: "2014-06-01",
        endDate: "2015-02-28",
        location: "Remote",
        isCurrent: false,
        description: "Independent contractor building websites and web applications for various clients. Specialized in frontend development and UI/UX implementation.",
        achievements: [
            "Delivered 15+ client projects with 100% satisfaction rate",
            "Mentored 3 junior developers from different countries",
            "Built reusable component library used across multiple projects"
        ],
        technologies: ["HTML", "CSS", "JavaScript", "jQuery", "WordPress", "PHP"],
        companySize: "Self-employed",
        industry: "Freelance",
        website: null,
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    },
    {
        id: 8,
        company: "University of Tech",
        position: "Computer Science Student",
        startDate: "2013-09-01",
        endDate: "2017-05-31",
        location: "Multiple Campuses",
        isCurrent: false,
        description: "Bachelor's degree in Computer Science with focus on web technologies and software engineering practices.",
        achievements: [
            "Graduated Magna Cum Laude with 3.8 GPA",
            "President of Computer Science Club (2015-2016)",
            "Won 'Best Capstone Project' for group collaboration tool"
        ],
        technologies: ["Java", "C++", "JavaScript", "HTML/CSS", "SQL", "Git"],
        companySize: "10,000+ students",
        industry: "Education",
        website: "https://university-tech.edu",
        createdAt: "2024-09-01T00:00:00.000Z",
        updatedAt: "2024-09-01T00:00:00.000Z"
    }
];

// ==================================================
// EXPRESS MIDDLEWARE
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// CORS headers for API access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ==================================================
// API ENDPOINTS
// ==================================================

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: "healthy",
    database: "mock",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "Day-25 v1.0"
  });
});

// GET /api/work-experience - Retrieve all experiences
app.get('/api/work-experience', (req, res) => {
  try {
    console.log('🌟 GET /api/work-experience - Retrieving all work experiences');

    // Add a small delay to simulate database fetch
    setTimeout(() => {
      const { search, company, isCurrent } = req.query;
      let filteredExperiences = [...mockWorkExperience];

      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        filteredExperiences = filteredExperiences.filter(exp =>
          exp.company.toLowerCase().includes(searchLower) ||
          exp.position.toLowerCase().includes(searchLower) ||
          exp.description.toLowerCase().includes(searchLower)
        );
      }

      // Filter by company
      if (company) {
        filteredExperiences = filteredExperiences.filter(exp =>
          exp.company.toLowerCase() === company.toLowerCase()
        );
      }

      // Filter by current status
      if (isCurrent !== undefined) {
        const isCurrentBool = isCurrent === 'true';
        filteredExperiences = filteredExperiences.filter(exp =>
          exp.isCurrent === isCurrentBool
        );
      }

      console.log(`✅ Retrieved ${filteredExperiences.length} experiences`);

      res.json({
        success: true,
        count: filteredExperiences.length,
        total: mockWorkExperience.length,
        data: filteredExperiences,
        filters: { search, company, isCurrent }
      });
    }, 200); // 200ms delay
  } catch (error) {
    console.error('❌ Get work experiences error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve work experiences'
    });
  }
});

// GET /api/work-experience/:id - Get specific experience
app.get('/api/work-experience/:id', (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);

    console.log(`🌟 GET /api/work-experience/${experienceId} - Retrieving specific experience`);

    setTimeout(() => {
      const experience = mockWorkExperience.find(exp => exp.id === experienceId);

      if (!experience) {
        return res.status(404).json({
          success: false,
          error: 'Work experience not found'
        });
      }

      console.log(`✅ Retrieved experience: ${experience.company}`);
      res.json({
        success: true,
        data: experience
      });
    }, 100);
  } catch (error) {
    console.error('❌ Get work experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve work experience'
    });
  }
});

// POST /api/work-experience - Create new experience
app.post('/api/work-experience', (req, res) => {
  try {
    console.log('🌟 POST /api/work-experience - Creating new work experience');
    const newExperience = req.body;

    // Basic validation
    if (!newExperience.company || !newExperience.position) {
      return res.status(400).json({
        success: false,
        error: 'Company and position are required fields'
      });
    }

    // Generate new ID
    const newId = Math.max(...mockWorkExperience.map(exp => exp.id)) + 1;

    // Add metadata
    const fullExperience = {
      id: newId,
      ...newExperience,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in real app, this would be database insert)
    mockWorkExperience.push(fullExperience);

    setTimeout(() => {
      console.log(`✅ Created new experience: ${fullExperience.company}`);
      res.status(201).json({
        success: true,
        message: 'Work experience created successfully',
        data: fullExperience
      });
    }, 300);
  } catch (error) {
    console.error('❌ Create work experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create work experience'
    });
  }
});

// PUT /api/work-experience/:id - Update experience
app.put('/api/work-experience/:id', (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    const updateData = req.body;

    console.log(`🌟 PUT /api/work-experience/${experienceId} - Updating experience`);

    setTimeout(() => {
      const experienceIndex = mockWorkExperience.findIndex(exp => exp.id === experienceId);

      if (experienceIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Work experience not found'
        });
      }

      // Update the experience
      mockWorkExperience[experienceIndex] = {
        ...mockWorkExperience[experienceIndex],
        ...updateData,
        id: experienceId, // Preserve ID
        updatedAt: new Date().toISOString()
      };

      console.log(`✅ Updated experience: ${mockWorkExperience[experienceIndex].company}`);
      res.json({
        success: true,
        message: 'Work experience updated successfully',
        data: mockWorkExperience[experienceIndex]
      });
    }, 300);
  } catch (error) {
    console.error('❌ Update work experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update work experience'
    });
  }
});

// DELETE /api/work-experience/:id - Remove experience
app.delete('/api/work-experience/:id', (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);

    console.log(`🌟 DELETE /api/work-experience/${experienceId} - Removing experience`);

    setTimeout(() => {
      const experienceIndex = mockWorkExperience.findIndex(exp => exp.id === experienceId);

      if (experienceIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Work experience not found'
        });
      }

      const deletedExperience = mockWorkExperience.splice(experienceIndex, 1)[0];

      console.log(`✅ Deleted experience: ${deletedExperience.company}`);
      res.json({
        success: true,
        message: 'Work experience deleted successfully',
        data: deletedExperience
      });
    }, 200);
  } catch (error) {
    console.error('❌ Delete work experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete work experience'
    });
  }
});

// GET /api/work-experience/stats - Get work experience statistics
app.get('/api/work-experience/stats', (req, res) => {
  try {
    console.log('🌟 GET /api/work-experience/stats - Retrieving statistics');

    setTimeout(() => {
      const stats = {
        total: mockWorkExperience.length,
        current: mockWorkExperience.filter(exp => exp.isCurrent).length,
        companies: [...new Set(mockWorkExperience.map(exp => exp.company))].length,
        yearsOfExperience: Math.ceil(
          mockWorkExperience.reduce((total, exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            return total + ((end - start) / (1000 * 60 * 60 * 24 * 365)); // Convert ms to years
          }, 0)
        ),
        topSkills: getTopSkills(mockWorkExperience),
        industries: getIndustryStats(mockWorkExperience)
      };

      console.log(`✅ Retrieved work experience statistics`);
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    }, 100);
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// Helper function to get top skills
function getTopSkills(experiences) {
  const skillCount = {};
  experiences.forEach(exp => {
    exp.technologies.forEach(tech => {
      skillCount[tech] = (skillCount[tech] || 0) + 1;
    });
  });

  return Object.entries(skillCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));
}

// Helper function to get industry stats
function getIndustryStats(experiences) {
  const industryCount = {};
  experiences.forEach(exp => {
    industryCount[exp.industry] = (industryCount[exp.industry] || 0) + 1;
  });

  return Object.entries(industryCount)
    .sort(([,a], [,b]) => b - a)
    .map(([industry, count]) => ({ industry, count }));
}

// ==================================================
// SERVER STARTUP
// ==================================================
app.listen(PORT, () => {
  console.log('🚀 ==================================================');
  console.log('🎉 Day 25: Work Experience API Server Started!');
  console.log('🚀 ==================================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log('🚀 ==================================================');
  console.log('📋 Available Endpoints:');
  console.log(`   GET    /health`);
  console.log(`   GET    /api/work-experience`);
  console.log(`   GET    /api/work-experience/:id`);
  console.log(`   POST   /api/work-experience`);
  console.log(`   PUT    /api/work-experience/:id`);
  console.log(`   DELETE /api/work-experience/:id`);
  console.log(`   GET    /api/work-experience/stats`);
  console.log('🚀 ==================================================');
  console.log('🧪 Test Commands:');
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl http://localhost:${PORT}/api/work-experience`);
  console.log(`   curl http://localhost:${PORT}/api/work-experience/stats`);
  console.log('🎯 Ready for Day 26: Component Integration!');
  console.log('🚀 ==================================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
