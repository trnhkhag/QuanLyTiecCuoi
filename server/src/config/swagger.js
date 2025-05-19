const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Management System - Auth Service API',
      version: '1.0.0',
      description: 'API documentation for the Authentication Service of the Wedding Management System',
      contact: {
        name: 'API Support',
        email: 'support@weddingmanagement.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'password123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the operation was successful',
              example: true
            },
            token: {
              type: 'string',
              description: 'JWT token for authentication',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'User ID',
                  example: 1
                },
                name: {
                  type: 'string',
                  description: 'User full name',
                  example: 'John Doe'
                },
                email: {
                  type: 'string',
                  description: 'User email address',
                  example: 'john@example.com'
                },
                role: {
                  type: 'string',
                  description: 'User role',
                  example: 'user'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the operation was successful',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid credentials'
            }
          }
        }
      }
    }
  },
  apis: [path.resolve(__dirname, '../routes/*.js')] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 