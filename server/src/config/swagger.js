const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Management System API',
      version: '1.0.0',
      description: 'API documentation for the Wedding Management System microservices',
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
    tags: [
      {
        name: 'Auth Service',
        description: 'Authentication and user management operations'
      },
      {
        name: 'Wedding Service',
        description: 'Wedding management and planning operations'
      },
      {
        name: 'Invoice Service',
        description: 'Invoice and payment operations'
      },
      {
        name: 'Report Service',
        description: 'Reporting and analytics operations'
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
        // Auth Service Schemas
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
        // Invoice Service Schemas
        Invoice: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Invoice ID',
              example: 1
            },
            weddingId: {
              type: 'integer',
              description: 'Associated wedding ID',
              example: 1
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Invoice date',
              example: '2023-09-15'
            },
            total: {
              type: 'number',
              description: 'Total amount',
              example: 50000000
            },
            payment: {
              type: 'number',
              description: 'Payment amount',
              example: 15000000
            },
            type: {
              type: 'string',
              description: 'Invoice type',
              example: 'Thanh toán đặt cọc'
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
              example: 'Đặt cọc 30%'
            }
          }
        },
        // Wedding Service Schemas
        Wedding: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Wedding ID',
              example: 1
            },
            customerId: {
              type: 'integer',
              description: 'Customer ID',
              example: 1
            },
            venueId: {
              type: 'integer', 
              description: 'Venue ID',
              example: 1
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Wedding date',
              example: '2023-09-15'
            },
            shiftId: {
              type: 'integer',
              description: 'Shift ID (1: Trưa, 2: Tối)',
              example: 1
            },
            bookingDate: {
              type: 'string',
              format: 'date-time',
              description: 'Booking date and time',
              example: '2023-08-01T09:30:00'
            },
            tables: {
              type: 'integer',
              description: 'Number of tables',
              example: 30
            },
            reserveTables: {
              type: 'integer',
              description: 'Number of reserve tables',
              example: 3
            }
          }
        },
        // Report Service Schemas
        MonthlyReport: {
          type: 'object',
          properties: {
            totalRevenue: {
              type: 'number',
              description: 'Total revenue for the month',
              example: 250000000
            },
            totalWeddings: {
              type: 'integer',
              description: 'Total number of weddings',
              example: 5
            },
            averageRevenue: {
              type: 'number',
              description: 'Average revenue per wedding',
              example: 50000000
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