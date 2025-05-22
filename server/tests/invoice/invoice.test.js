const request = require('supertest');
const app = require('../../src/app');
const { expect } = require('chai');

describe('Invoice Service API Tests', () => {
  const baseUrl = '/api/v1/invoice-service';
  let authToken;
  let testInvoiceId;

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

  describe('GET /', () => {
    it('should get all invoices', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.be.an('array');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(baseUrl);

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /', () => {
    it('should create a new invoice', async () => {
      const invoiceData = {
        weddingId: 1,
        invoiceNumber: 'INV-2024-001',
        issueDate: '2024-01-01',
        dueDate: '2024-01-15',
        subtotal: 50000000,
        tax: 5000000,
        total: 55000000,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        notes: 'Test invoice'
      };

      const response = await request(app)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invoiceData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id');
      
      testInvoiceId = response.body.data.id;
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        invoiceNumber: 'INV-2024-002',
        // Missing required fields
      };

      const response = await request(app)
        .post(baseUrl)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success', false);
    });
  });

  describe('GET /:id', () => {
    it('should get invoice by ID', async () => {
      const response = await request(app)
        .get(`${baseUrl}/${testInvoiceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('id', testInvoiceId);
    });

    it('should fail with non-existent ID', async () => {
      const response = await request(app)
        .get(`${baseUrl}/99999`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(404);
    });
  });

  describe('PUT /:id', () => {
    it('should update invoice', async () => {
      const updateData = {
        status: 'paid',
        paymentDate: '2024-01-10',
        notes: 'Updated test invoice'
      };

      const response = await request(app)
        .put(`${baseUrl}/${testInvoiceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.data).to.have.property('status', 'paid');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete invoice', async () => {
      const response = await request(app)
        .delete(`${baseUrl}/${testInvoiceId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success', true);
    });
  });
}); 