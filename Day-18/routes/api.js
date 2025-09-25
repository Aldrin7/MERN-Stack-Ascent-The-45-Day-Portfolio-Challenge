const express = require('express');

const router = express.Router();

// @desc    Get API information
// @route   GET /api/info
// @access  Public
router.get('/info', (req, res) => {
  res.json({
    success: true,
    message: 'Day 18 API Information',
    data: {
      name: 'Day 18 API',
      version: '1.0.0',
      description: 'Production-ready API with deployment and monitoring',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        admin: '/api/admin',
        monitoring: '/api/monitoring'
      },
      features: [
        'JWT Authentication',
        'Rate Limiting',
        'Input Validation',
        'Error Handling',
        'Logging',
        'Monitoring',
        'Caching',
        'Security Headers'
      ]
    }
  });
});

// @desc    Get API statistics
// @route   GET /api/stats
// @access  Public
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    message: 'API Statistics',
    data: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// @desc    Search across all resources
// @route   GET /api/search
// @access  Public
router.get('/search', (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  // Mock search results for demonstration
  const mockResults = [
    {
      type: 'user',
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        relevance: 0.95
      }
    },
    {
      type: 'content',
      data: {
        id: 1,
        title: 'API Development Guide',
        content: 'Complete guide to API development',
        relevance: 0.87
      }
    }
  ];

  res.json({
    success: true,
    query: q,
    type: type || 'all',
    count: mockResults.length,
    data: mockResults
  });
});

module.exports = router;
