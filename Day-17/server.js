const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data store for testing (no database needed for basic testing)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2 }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Users API
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  res.json({
    success: true,
    data: user
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    age: age || 18
  };

  users.push(newUser);
  res.status(201).json({
    success: true,
    data: newUser
  });
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { name, email, age } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;

  res.json({
    success: true,
    data: user
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  users.splice(userIndex, 1);
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Posts API
app.get('/api/posts', (req, res) => {
  res.json({
    success: true,
    count: posts.length,
    data: posts
  });
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  res.json({
    success: true,
    data: post
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    userId: userId || 1
  };

  posts.push(newPost);
  res.status(201).json({
    success: true,
    data: newPost
  });
});

// Search API
app.get('/api/search', (req, res) => {
  const { q, type } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  let results = [];

  if (!type || type === 'users') {
    const userResults = users.filter(user =>
      user.name.toLowerCase().includes(q.toLowerCase()) ||
      user.email.toLowerCase().includes(q.toLowerCase())
    );
    results.push(...userResults.map(user => ({ type: 'user', data: user })));
  }

  if (!type || type === 'posts') {
    const postResults = posts.filter(post =>
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.content.toLowerCase().includes(q.toLowerCase())
    );
    results.push(...postResults.map(post => ({ type: 'post', data: post })));
  }

  res.json({
    success: true,
    query: q,
    count: results.length,
    data: results
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Day 17 API Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
