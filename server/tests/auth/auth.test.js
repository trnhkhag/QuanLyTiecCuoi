const request = require('supertest');
const app = require('../../src/app');
const { expect } = require('chai');

describe('Auth Service API Tests', () => {
  const baseUrl = '/api/v1/auth-service';
  let authToken;

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('user');
      
      authToken = response.body.token;
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: 'wrong@example.com',
          password: 'wrongpass'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('success', false);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: 'test@example.com'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
    });
  });

  describe('POST /register', () => {
    it('should register successfully with valid data', async () => {
      const response = await request(app)
        .post(`${baseUrl}/register`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
          role: 'user'
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('user');
    });

    it('should fail with existing email', async () => {
      const response = await request(app)
        .post(`${baseUrl}/register`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'user'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post(`${baseUrl}/register`)
        .send({
          email: 'invalid-email',
          password: '123',
          name: 'Test User'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
    });
  });

  describe('GET /health', () => {
    it('should return service health status', async () => {
      const response = await request(app)
        .get(`${baseUrl}/health`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'OK');
      expect(response.body).to.have.property('service', 'auth-service');
    });
  });
}); 