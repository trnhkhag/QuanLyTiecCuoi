# JWT Authentication System - Hệ thống Quản lý Tiệc Cưới

## Tổng quan

Hệ thống JWT Authentication đã được triển khai đầy đủ với các tính năng:

### ✅ Tính năng đã có:
- **Authentication**: Login/Register với JWT token
- **Authorization**: Role-based và permission-based access control
- **Protected Routes**: Middleware bảo vệ các endpoints
- **Profile Management**: Lấy thông tin user hiện tại
- **Token Security**: Verify token, check user status

## API Endpoints

### Authentication (Public)
```
POST /api/v1/auth-service/login
POST /api/v1/auth-service/register
GET  /api/v1/auth-service/profile    [Requires JWT]
POST /api/v1/auth-service/logout     [Requires JWT]
```

### Protected Endpoints

#### Service Management 
```
GET    /api/v1/wedding-service/services     [JWT Required]
GET    /api/v1/wedding-service/services/:id [JWT Required]
POST   /api/v1/wedding-service/services     [JWT + Admin/Manager]
PUT    /api/v1/wedding-service/services/:id [JWT + Admin/Manager]
DELETE /api/v1/wedding-service/services/:id [JWT + Admin/Manager]
```

#### Hall Management
```
GET    /api/v1/wedding-service/lobby/halls     [JWT Required]
GET    /api/v1/wedding-service/lobby/halls/:id [JWT Required]
POST   /api/v1/wedding-service/lobby/halls     [JWT + Admin/Manager]
PUT    /api/v1/wedding-service/lobby/halls/:id [JWT + Admin/Manager]
DELETE /api/v1/wedding-service/lobby/halls/:id [JWT + Admin/Manager]
```

#### Regulation Management 
```
GET    /api/v1/wedding-service/regulations     [JWT Required]
GET    /api/v1/wedding-service/regulations/:id [JWT Required]
POST   /api/v1/wedding-service/regulations     [JWT + Admin Only]
PUT    /api/v1/wedding-service/regulations/:id [JWT + Admin Only]
DELETE /api/v1/wedding-service/regulations/:id [JWT + Admin Only]
```

#### Invoice Management
```
GET    /api/v1/invoice-service           [JWT + Admin/Manager]
GET    /api/v1/invoice-service/:id       [JWT Required]
POST   /api/v1/invoice-service           [JWT + Admin/Manager]
PUT    /api/v1/invoice-service/:id       [JWT + Admin/Manager]
DELETE /api/v1/invoice-service/:id       [JWT + Admin Only]
```

#### Report Service
```
GET    /api/v1/report-service/monthly    [JWT + Admin/Manager]
GET    /api/v1/report-service/revenue    [JWT + Admin/Manager]
GET    /api/v1/report-service/trending   [JWT + Admin/Manager]
```

#### Wedding Lookup (Mixed)
```
GET    /api/v1/wedding-service/lookup         [Public]
GET    /api/v1/wedding-service/lookup/shifts  [Public]
GET    /api/v1/wedding-service/lookup/:id     [JWT Required]
```

## Cách sử dụng

### 1. Login để lấy token
```javascript
POST /api/v1/auth-service/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### 2. Sử dụng token trong requests
```javascript
// Header required cho protected routes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Test với Swagger UI
- Truy cập: `http://localhost:3001/api-docs`
- Click "Authorize" button 
- Nhập: `Bearer your_jwt_token_here`
- Bây giờ có thể test tất cả protected endpoints

## Middleware System

### authenticateToken
- Verify JWT token
- Check user existence and status
- Add user info to req.user

### requireRole(['admin', 'manager'])
- Kiểm tra user có role được yêu cầu không
- Sử dụng sau authenticateToken

### requirePermission('PERMISSION_NAME')
- Kiểm tra user có permission cụ thể không
- Query database để verify permissions

## Error Responses

### 401 Unauthorized
```javascript
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden
```javascript
{
  "success": false, 
  "message": "Insufficient permissions"
}
```

### Token Expired
```javascript
{
  "success": false,
  "message": "Token has expired"
}
```

## Security Levels

### 🔓 Public Endpoints
- Health checks
- Login/Register
- Wedding lookup (basic search)
- Shifts listing

### 🔐 JWT Required (Any Role)
- Profile information
- View services/halls/regulations
- Wedding booking details

### 👨‍💼 Admin/Manager Only
- Create/Edit/Delete services
- Create/Edit/Delete halls
- Manage invoices
- View reports

### 👑 Admin Only
- Manage regulations
- Delete invoices
- System-wide permissions

## Cấu hình bảo mật

### Environment Variables
```env
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
```

### Roles trong hệ thống
- **admin**: Toàn quyền, quản lý quy định
- **manager**: Quản lý sảnh, dịch vụ, báo cáo
- **user**: Khách hàng thông thường, xem thông tin cơ bản

## Swagger Documentation

Tất cả protected endpoints đã được cập nhật với:
```yaml
security:
  - bearerAuth: []
```

Truy cập: `http://localhost:3001/api-docs` để test với Swagger UI.

## Lưu ý bảo mật

1. **JWT Secret**: Phải set trong environment variable
2. **Token Expiry**: Mặc định 24h, có thể cấu hình
3. **HTTPS**: Nên sử dụng HTTPS trong production
4. **Token Storage**: Client nên lưu token an toàn
5. **Role Separation**: Các endpoints được phân quyền rõ ràng

## Tính năng có thể mở rộng

### 🔄 Refresh Token
- Implement refresh token mechanism
- Auto refresh expired tokens

### 🚫 Token Blacklist  
- Blacklist tokens khi logout
- Revoke tokens when needed

### 🔐 Rate Limiting
- Limit login attempts
- Prevent brute force attacks

### 📱 Multi-device Support
- Track active sessions
- Device-specific tokens

### 🔑 Password Reset
- Forgot password functionality
- Email-based reset tokens 