const request = require('supertest');
const app = require('../../src/app');
const { expect } = require('chai');

describe('Report Service API Tests', () => {
  const baseUrl = '/api/v1/report-service';
  let authToken;

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

  describe('GET /monthly', () => {
    it('should get monthly report for current month', async () => {
      const response = await request(app)
        .get(`${baseUrl}/monthly`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('month');
      expect(response.body.data).to.have.property('year');
      expect(response.body.data).to.have.property('totalRevenue');
      expect(response.body.data).to.have.property('totalWeddings');
    });

    it('should get monthly report for specific month', async () => {
      const response = await request(app)
        .get(`${baseUrl}/monthly?year=2024&month=1`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('month', 1);
      expect(response.body.data).to.have.property('year', 2024);
    });

    it('should fail with invalid month', async () => {
      const response = await request(app)
        .get(`${baseUrl}/monthly?year=2024&month=13`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(400);
    });
  });

  describe('GET /yearly', () => {
    it('should get yearly report for current year', async () => {
      const response = await request(app)
        .get(`${baseUrl}/yearly`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('year');
      expect(response.body.data).to.have.property('totalRevenue');
      expect(response.body.data).to.have.property('totalWeddings');
      expect(response.body.data).to.have.property('averageRevenue');
      expect(response.body.data).to.have.property('monthlyBreakdown');
    });

    it('should get yearly report for specific year', async () => {
      const response = await request(app)
        .get(`${baseUrl}/yearly?year=2023`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('year', 2023);
    });
  });

  describe('GET /revenue-trend', () => {
    it('should get revenue trend for default period', async () => {
      const response = await request(app)
        .get(`${baseUrl}/revenue-trend`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('numberOfMonths', 6);
      expect(response.body.data).to.have.property('startDate');
      expect(response.body.data).to.have.property('endDate');
      expect(response.body.data).to.have.property('totalRevenue');
      expect(response.body.data).to.have.property('totalWeddings');
      expect(response.body.data).to.have.property('averageMonthlyRevenue');
      expect(response.body.data).to.have.property('trend');
    });

    it('should get revenue trend for custom period', async () => {
      const response = await request(app)
        .get(`${baseUrl}/revenue-trend?months=12`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('numberOfMonths', 12);
    });

    it('should fail with invalid period', async () => {
      const response = await request(app)
        .get(`${baseUrl}/revenue-trend?months=0`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(400);
    });
  });

  describe('GET /health', () => {
    it('should return service health status', async () => {
      const response = await request(app)
        .get(`${baseUrl}/health`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'OK');
      expect(response.body).to.have.property('service', 'report-service');
    });
  });
}); 