const request = require('supertest');
const app = require('../../src/app');
const { expect } = require('chai');

describe('Wedding Service API Tests', () => {
  const baseUrl = '/api/v1/wedding-service';
  let authToken;
  let testWeddingId;

  before(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth-service/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  describe('GET /tiec-cuoi', () => {
    it('should get all wedding parties', async () => {
      const response = await request(app)
        .get(`${baseUrl}/tiec-cuoi`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`${baseUrl}/tiec-cuoi`);

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /tiec-cuoi', () => {
    it('should create a new wedding party', async () => {
      const weddingData = {
        customerName: 'Test Customer',
        weddingDate: '2024-12-31',
        hallId: 1,
        numberOfGuests: 200,
        menuId: 1,
        totalAmount: 50000000,
        depositAmount: 10000000,
        status: 'pending'
      };

      const response = await request(app)
        .post(`${baseUrl}/tiec-cuoi`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(weddingData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id');
      
      testWeddingId = response.body.data.id;
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        customerName: 'Test Customer',
        // Missing required fields
      };

      const response = await request(app)
        .post(`${baseUrl}/tiec-cuoi`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
    });
  });

  describe('GET /tiec-cuoi/:id', () => {
    it('should get wedding party by ID', async () => {
      const response = await request(app)
        .get(`${baseUrl}/tiec-cuoi/${testWeddingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testWeddingId);
    });

    it('should fail with non-existent ID', async () => {
      const response = await request(app)
        .get(`${baseUrl}/tiec-cuoi/99999`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });
  });

  describe('GET /ca-tiec', () => {
    it('should get all catering shifts', async () => {
      const response = await request(app)
        .get(`${baseUrl}/ca-tiec`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });
  });
}); 