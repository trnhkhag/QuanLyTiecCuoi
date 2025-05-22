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
      },
      {
        name: 'Hall Management',
        description: 'Wedding hall and hall type management'
      },
      {
        name: 'Service Management',
        description: 'Wedding service management'
      },
      {
        name: 'Regulation Management',
        description: 'System regulations management'
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
                  example: 'user',
                  enum: ['admin', 'manager', 'user']
                },
                customerId: {
                  type: 'integer',
                  description: 'Customer ID if user is a customer',
                  example: 1,
                  nullable: true
                },
                employeeId: {
                  type: 'integer',
                  description: 'Employee ID if user is an employee',
                  example: 1,
                  nullable: true
                },
                permissions: {
                  type: 'array',
                  description: 'List of user permissions',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Permission name',
                        example: 'VIEW_DASHBOARD',
                        enum: [
                          'VIEW_DASHBOARD',
                          'MANAGE_PROFILE',
                          'VIEW_WEDDINGS',
                          'CREATE_WEDDING',
                          'EDIT_WEDDING',
                          'DELETE_WEDDING',
                          'VIEW_PAYMENTS',
                          'MANAGE_PAYMENTS',
                          'MANAGE_USERS',
                          'SYSTEM_SETTINGS'
                        ]
                      },
                      value: {
                        type: 'integer',
                        description: 'Permission value (bitwise flag)',
                        example: 1
                      }
                    }
                  }
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
            id: { type: 'integer' },
            name: { type: 'string' },
            date: { type: 'string', format: 'date' },
            hallId: { type: 'integer' },
            serviceId: { type: 'integer' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Hall: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string' },
            capacity: { type: 'integer' },
            price: { type: 'number' },
            image: { type: 'string' },
            status: { type: 'string' }
          }
        },
        HallType: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            status: { type: 'string' }
          }
        },
        Regulation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            content: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string' }
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
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs; 