const request = require('supertest');
const app = require('../app');
const ChefModel = require('../models/Chef.Model');

describe('Chef API Tests', () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await ChefModel.deleteMany({});
  });

  describe('POST /chef/create', () => {
    it('should create a new chef successfully', async () => {
      const chefData = {
        name: 'Test Chef',
        email: 'test@chef.com',
        phone: '+1234567890',
        city: 'Test City',
        experience: 5,
        starRating: 4.5,
        aboutCook: 'Experienced chef specializing in Italian cuisine'
      };

      const response = await request(app)
        .post('/chef/create')
        .send(chefData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(chefData.name);
      expect(response.body.data.email).toBe(chefData.email);
    });

    it('should return validation error for missing required fields', async () => {
      const invalidData = {
        name: 'Test Chef'
        // Missing required fields
      };

      const response = await request(app)
        .post('/chef/create')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /chef/get', () => {
    it('should get all chefs', async () => {
      // Create test chef first
      await ChefModel.create({
        name: 'Test Chef',
        email: 'test@chef.com',
        phone: '+1234567890',
        city: 'Test City'
      });

      const response = await request(app)
        .get('/chef/get')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /chef/search', () => {
    beforeEach(async () => {
      // Create test chefs for search
      await ChefModel.create([
        {
          name: 'Italian Chef',
          email: 'italian@chef.com',
          city: 'New York',
          starRating: 4.5,
          experience: 10
        },
        {
          name: 'Chinese Chef',
          email: 'chinese@chef.com',
          city: 'San Francisco',
          starRating: 3.5,
          experience: 5
        }
      ]);
    });

    it('should search chefs by name', async () => {
      const response = await request(app)
        .get('/chef/search?q=Italian')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Italian Chef');
    });

    it('should search chefs by city', async () => {
      const response = await request(app)
        .get('/chef/search?city=New York')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].city).toBe('New York');
    });

    it('should filter chefs by minimum rating', async () => {
      const response = await request(app)
        .get('/chef/search?minRating=4')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].starRating).toBeGreaterThanOrEqual(4);
    });

    it('should return pagination information', async () => {
      const response = await request(app)
        .get('/chef/search?page=1&limit=5')
        .expect(200);

      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /chef/get/:id', () => {
    it('should get chef by ID', async () => {
      const chef = await ChefModel.create({
        name: 'Test Chef',
        email: 'test@chef.com',
        phone: '+1234567890',
        city: 'Test City'
      });

      const response = await request(app)
        .get(`/chef/get/${chef._id}`)
        .expect(200);

      expect(response.body.name).toBe(chef.name);
      expect(response.body.email).toBe(chef.email);
    });

    it('should return 404 for non-existent chef', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/chef/get/${fakeId}`)
        .expect(404);
    });
  });
});
