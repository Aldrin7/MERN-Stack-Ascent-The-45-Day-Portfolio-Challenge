const request = require('supertest');
const app = require('../server');

describe('Posts API', () => {
  beforeEach(() => {
    // Reset the in-memory data before each test
    app.locals = {};
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('content');
    });

    it('should return posts with correct structure', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      const post = response.body.data[0];
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('userId');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post by ID', async () => {
      const response = await request(app)
        .get('/api/posts/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.title).toBe('First Post');
      expect(response.body.data.content).toBe('This is the first post');
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid data', async () => {
      const newPost = {
        title: 'New Test Post',
        content: 'This is a test post content',
        userId: 1
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newPost.title);
      expect(response.body.data.content).toBe(newPost.content);
      expect(response.body.data.userId).toBe(newPost.userId);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ title: 'Test Title' }) // Missing content
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should set default userId when not provided', async () => {
      const newPost = {
        title: 'Default User Post',
        content: 'Content without userId'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(1); // Default userId
    });
  });
});

describe('Search API', () => {
  beforeEach(() => {
    // Reset the in-memory data before each test
    app.locals = {};
  });

  describe('GET /api/search', () => {
    it('should search users by name', async () => {
      const response = await request(app)
        .get('/api/search?q=John')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.query).toBe('John');
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);

      const userResult = response.body.data.find(item => item.type === 'user');
      expect(userResult).toBeDefined();
      expect(userResult.data.name).toContain('John');
    });

    it('should search posts by title', async () => {
      const response = await request(app)
        .get('/api/search?q=First')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);

      const postResult = response.body.data.find(item => item.type === 'post');
      expect(postResult).toBeDefined();
      expect(postResult.data.title).toContain('First');
    });

    it('should search posts by content', async () => {
      const response = await request(app)
        .get('/api/search?q=post')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/search?q=John&type=users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(item => item.type === 'user')).toBe(true);
    });

    it('should return 400 for missing query', async () => {
      const response = await request(app)
        .get('/api/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/search?q=JOHN')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });
  });
});

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should return proper JSON structure', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(typeof response.body.timestamp).toBe('string');
      expect(typeof response.body.version).toBe('string');
      expect(typeof response.body.uptime).toBe('number');
    });
  });
});
