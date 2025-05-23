const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hệ thống Quản lý Tiệc Cưới - API',
      version: '1.0.0',
      description: 'Tài liệu API cho hệ thống quản lý tiệc cưới',
      contact: {
        name: 'Hỗ trợ API',
        email: 'support@weddingmanagement.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Localhost'
      }
    ],
    tags: [
      {
        name: 'Auth Service',
        description: 'Xác thực và quản lý người dùng'
      },
      {
        name: 'Wedding Service',
        description: 'Quản lý và lập kế hoạch tiệc cưới'
      },
      {
        name: 'Invoice Service',
        description: 'Quản lý hóa đơn và thanh toán'
      },
      {
        name: 'Report Service',
        description: 'Báo cáo và phân tích'
      },
      {
        name: 'Hall Management',
        description: 'Quản lý sảnh tiệc và loại sảnh'
      },
      {
        name: 'Service Management',
        description: 'Quản lý dịch vụ tiệc cưới'
      },
      {
        name: 'Regulation Management',
        description: 'Quản lý quy định hệ thống'
      },
      {
        name: 'Wedding Lookup',
        description: 'Tra cứu và tìm kiếm tiệc cưới'
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
        // Schemas cho Dịch vụ Xác thực
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Địa chỉ email người dùng',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mật khẩu người dùng',
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
              description: 'Họ và tên đầy đủ',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Địa chỉ email người dùng',
              example: 'nguyenvana@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Mật khẩu người dùng',
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Cho biết thao tác có thành công hay không',
              example: true
            },
            token: {
              type: 'string',
              description: 'JWT token để xác thực',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID người dùng',
                  example: 1
                },
                name: {
                  type: 'string',
                  description: 'Họ và tên đầy đủ',
                  example: 'Nguyễn Văn A'
                },
                email: {
                  type: 'string',
                  description: 'Địa chỉ email người dùng',
                  example: 'nguyenvana@example.com'
                },
                role: {
                  type: 'string',
                  description: 'Vai trò người dùng',
                  example: 'user',
                  enum: ['admin', 'manager', 'user']
                },
                customerId: {
                  type: 'integer',
                  description: 'ID khách hàng nếu là khách hàng',
                  example: 1,
                  nullable: true
                },
                employeeId: {
                  type: 'integer',
                  description: 'ID nhân viên nếu là nhân viên',
                  example: 1,
                  nullable: true
                },
                permissions: {
                  type: 'array',
                  description: 'Danh sách quyền của người dùng',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Tên quyền',
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
                        description: 'Giá trị quyền (cờ bitwise)',
                        example: 1
                      }
                    }
                  }
                }
              }
            }
          }
        },
        // Schemas cho Dịch vụ Hóa đơn
        Invoice: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID hóa đơn',
              example: 1
            },
            weddingId: {
              type: 'integer',
              description: 'ID tiệc cưới liên quan',
              example: 1
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Ngày lập hóa đơn',
              example: '2023-09-15'
            },
            total: {
              type: 'number',
              description: 'Tổng số tiền',
              example: 50000000
            },
            payment: {
              type: 'number',
              description: 'Số tiền thanh toán',
              example: 15000000
            },
            type: {
              type: 'string',
              description: 'Loại hóa đơn',
              example: 'Thanh toán đặt cọc'
            },
            notes: {
              type: 'string',
              description: 'Ghi chú bổ sung',
              example: 'Đặt cọc 30%'
            }
          }
        },
        // Schemas cho Dịch vụ Tiệc cưới
        Wedding: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              description: 'ID tiệc cưới'
            },
            name: { 
              type: 'string',
              description: 'Tên tiệc cưới'
            },
            date: { 
              type: 'string', 
              format: 'date',
              description: 'Ngày tổ chức'
            },
            hallId: { 
              type: 'integer',
              description: 'ID sảnh tiệc'
            },
            serviceId: { 
              type: 'integer',
              description: 'ID dịch vụ'
            },
            status: { 
              type: 'string',
              description: 'Trạng thái tiệc cưới'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Thời gian tạo'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Thời gian cập nhật'
            }
          }
        },
        Hall: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              description: 'ID sảnh tiệc'
            },
            name: { 
              type: 'string',
              description: 'Tên sảnh tiệc'
            },
            type: { 
              type: 'string',
              description: 'Loại sảnh'
            },
            capacity: { 
              type: 'integer',
              description: 'Sức chứa'
            },
            price: { 
              type: 'number',
              description: 'Giá thuê'
            },
            image: { 
              type: 'string',
              description: 'Hình ảnh sảnh'
            },
            status: { 
              type: 'string',
              description: 'Trạng thái'
            }
          }
        },
        HallType: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              description: 'ID loại sảnh'
            },
            name: { 
              type: 'string',
              description: 'Tên loại sảnh'
            },
            description: { 
              type: 'string',
              description: 'Mô tả'
            }
          }
        },
        Service: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              description: 'ID dịch vụ'
            },
            name: { 
              type: 'string',
              description: 'Tên dịch vụ'
            },
            description: { 
              type: 'string',
              description: 'Mô tả dịch vụ'
            },
            price: { 
              type: 'number',
              description: 'Giá dịch vụ'
            },
            status: { 
              type: 'string',
              description: 'Trạng thái'
            }
          }
        },
        Regulation: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer',
              description: 'ID quy định'
            },
            name: { 
              type: 'string',
              description: 'Tên quy định'
            },
            content: { 
              type: 'string',
              description: 'Nội dung quy định'
            },
            type: { 
              type: 'string',
              description: 'Loại quy định'
            },
            status: { 
              type: 'string',
              description: 'Trạng thái'
            }
          }
        },
        // Schemas cho Dịch vụ Báo cáo
        MonthlyReport: {
          type: 'object',
          properties: {
            totalRevenue: {
              type: 'number',
              description: 'Tổng doanh thu trong tháng',
              example: 250000000
            },
            totalWeddings: {
              type: 'integer',
              description: 'Tổng số tiệc cưới',
              example: 5
            },
            averageRevenue: {
              type: 'number',
              description: 'Doanh thu trung bình mỗi tiệc',
              example: 50000000
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Cho biết thao tác có thành công hay không',
              example: false
            },
            message: {
              type: 'string',
              description: 'Thông báo lỗi',
              example: 'Thông tin đăng nhập không hợp lệ'
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