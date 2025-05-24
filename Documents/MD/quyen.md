# API Permission Mapping - QuanLyTiecCuoi

## **Từng Quyền Có Thể Gọi API Nào**

### **Tổng Quan Permission Values**

| Quyền | Giá Trị Bit | Mô Tả | Vai Trò Sở Hữu |
|-------|-------------|-------|-----------------|
| `MANAGE_HALLS` | 1 | Quản lý sảnh tiệc | Admin, Manager, Admin Staff |
| `MANAGE_BOOKINGS` | 2 | Quản lý đặt tiệc | Admin, Receptionist |
| `SEARCH_WEDDINGS` | 4 | Tra cứu tiệc cưới | Admin, Manager, Receptionist, Kitchen |
| `MANAGE_INVOICES` | 8 | Quản lý hóa đơn | Admin, Accountant |
| `VIEW_REPORTS` | 16 | Xem báo cáo | Admin, Manager, Accountant |
| `MANAGE_REGULATIONS` | 32 | Quản lý quy định | Admin |
| `MANAGE_USERS` | 64 | Quản lý người dùng | Admin |
| `VIEW_PROFILE` | 128 | Xem thông tin cá nhân | Tất cả |

---

##  **Chi Tiết API Theo Từng Quyền**

### **1. MANAGE_HALLS (Quyền: 1)**

**Nghiệp Vụ**: Quản lý Sảnh (BM1, QĐ1)  
**Vai Trò**: Admin, Manager, Admin Staff

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **POST** | `/api/v1/wedding-service/lobby/halls` | Tạo sảnh tiệc mới | `hallManagementController.createHall` |
| **PUT** | `/api/v1/wedding-service/lobby/halls/:id` | Cập nhật thông tin sảnh | `hallManagementController.updateHall` |
| **DELETE** | `/api/v1/wedding-service/lobby/halls/:id` | Xóa sảnh tiệc | `hallManagementController.deleteHall` |
| **POST** | `/api/v1/wedding-service/lobby/hall-types` | Tạo loại sảnh mới | `hallManagementController.createHallType` |
| **PUT** | `/api/v1/wedding-service/lobby/hall-types/:id` | Cập nhật loại sảnh | `hallManagementController.updateHallType` |
| **DELETE** | `/api/v1/wedding-service/lobby/hall-types/:id` | Xóa loại sảnh | `hallManagementController.deleteHallType` |

#### **API Công Khai (Không Cần Quyền):**
- **GET** `/api/v1/wedding-service/lobby/halls` - Xem danh sách sảnh
- **GET** `/api/v1/wedding-service/lobby/halls/:id` - Xem chi tiết sảnh
- **GET** `/api/v1/wedding-service/lobby/hall-types` - Xem loại sảnh

---

###  **2. MANAGE_BOOKINGS (Quyền: 2)**

**Nghiệp Vụ**: Nhận Đặt Tiệc Cưới (BM2, QĐ2)  
**Vai Trò**: Admin, Receptionist

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **GET** | `/api/v1/wedding-service/bookings` | Lấy danh sách đặt tiệc | `weddingBookingController.getAllBookings` |
| **GET** | `/api/v1/wedding-service/bookings/:id` | Lấy chi tiết đặt tiệc | `weddingBookingController.getBookingById` |
| **POST** | `/api/v1/wedding-service/bookings` | Tạo đặt tiệc mới | `weddingBookingController.createBooking` |
| **PUT** | `/api/v1/wedding-service/bookings/:id` | Cập nhật đặt tiệc | `weddingBookingController.updateBooking` |
| **DELETE** | `/api/v1/wedding-service/bookings/:id` | Xóa đặt tiệc | `weddingBookingController.deleteBooking` |

#### **Legacy API (Backward Compatibility):**
- **GET/POST** `/api/bookings/*` - Các endpoint cũ

---

###  **3. SEARCH_WEDDINGS (Quyền: 4)**

**Nghiệp Vụ**: Tra cứu Tiệc Cưới (BM3)  
**Vai Trò**: Admin, Manager, Receptionist, Kitchen

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **GET** | `/api/v1/wedding-service/lookup` | Tìm kiếm tiệc cưới | `weddingLookupController.searchBookings` |
| **GET** | `/api/v1/wedding-service/lookup/:id` | Chi tiết tiệc cưới | `weddingLookupController.getBookingDetail` |

#### **API Công Khai (Không Cần Quyền):**
- **GET** `/api/v1/wedding-service/lookup/shifts` - Xem ca tiệc

---

###  **4. MANAGE_INVOICES (Quyền: 8)**

**Nghiệp Vụ**: Lập Hóa Đơn Thanh Toán (BM4, QĐ4)  
**Vai Trò**: Admin, Accountant

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **GET** | `/api/v1/invoice-service` | Lấy danh sách hóa đơn | `invoiceController.getAllInvoices` |
| **GET** | `/api/v1/invoice-service/:id` | Chi tiết hóa đơn | `invoiceController.getInvoiceById` |
| **POST** | `/api/v1/invoice-service` | Tạo hóa đơn mới | `invoiceController.createInvoice` |
| **PUT** | `/api/v1/invoice-service/:id` | Cập nhật hóa đơn | `invoiceController.updateInvoice` |
| **DELETE** | `/api/v1/invoice-service/:id` | Xóa hóa đơn | `invoiceController.deleteInvoice` |

#### **Legacy API (Backward Compatibility):**
- **GET/POST** `/api/invoices/*` - Các endpoint cũ

---

### **5. VIEW_REPORTS (Quyền: 16)**

**Nghiệp Vụ**: Lập Báo Cáo Tháng (BM5)  
**Vai Trò**: Admin, Manager, Accountant

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **GET** | `/api/v1/report-service/monthly` | Báo cáo tháng | `reportController.getMonthlyReport` |
| **GET** | `/api/v1/report-service/yearly` | Báo cáo năm | `reportController.getYearlyReport` |
| **GET** | `/api/v1/report-service/revenue-trend` | Xu hướng doanh thu | `reportController.getRevenueTrend` |

---

### **6. MANAGE_REGULATIONS (Quyền: 32)**

**Nghiệp Vụ**: Thay đổi Quy định (QĐ6)  
**Vai Trò**: Admin

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **POST** | `/api/v1/wedding-service/regulations` | Tạo quy định mới | `regulationController.createRegulation` |
| **PUT** | `/api/v1/wedding-service/regulations/:id` | Cập nhật quy định | `regulationController.updateRegulation` |
| **DELETE** | `/api/v1/wedding-service/regulations/:id` | Xóa quy định | `regulationController.deleteRegulation` |

#### **API Công Khai (Không Cần Quyền):**
- **GET** `/api/v1/wedding-service/regulations` - Xem danh sách quy định
- **GET** `/api/v1/wedding-service/regulations/:id` - Xem chi tiết quy định

---

### **7. MANAGE_USERS (Quyền: 64)**

**Nghiệp Vụ**: Quản lý Người dùng  
**Vai Trò**: Admin

#### **API Endpoints:**
*Chưa được implement trong codebase hiện tại*

**Đề Xuất API:**
- **GET** `/api/v1/user-service/users` - Danh sách người dùng
- **POST** `/api/v1/user-service/users` - Tạo người dùng
- **PUT** `/api/v1/user-service/users/:id` - Cập nhật người dùng
- **DELETE** `/api/v1/user-service/users/:id` - Xóa người dùng
- **PUT** `/api/v1/user-service/users/:id/permissions` - Phân quyền

---

###  **8. VIEW_PROFILE (Quyền: 128)**

**Nghiệp Vụ**: Xem và chỉnh sửa thông tin cá nhân  
**Vai Trò**: Tất cả

#### **API Endpoints:**

| Method | Endpoint | Mô Tả | Controller |
|--------|----------|-------|------------|
| **GET** | `/api/v1/profile-service/profile` | Xem thông tin cá nhân | `profileController.getProfile` |
| **PUT** | `/api/v1/profile-service/customer` | Cập nhật hồ sơ khách hàng | `profileController.updateCustomerProfile` |
| **PUT** | `/api/v1/profile-service/employee` | Cập nhật hồ sơ nhân viên | `profileController.updateEmployeeProfile` |
| **PUT** | `/api/v1/profile-service/change-password` | Đổi mật khẩu | `profileController.changePassword` |
| **GET** | `/api/v1/profile-service/permissions` | Xem quyền của mình | `profileController.getUserPermissions` |

---

## **API Công Khai (Không Cần Quyền)**

### **Authentication APIs:**
- **POST** `/api/v1/auth-service/login` - Đăng nhập
- **POST** `/api/v1/auth-service/register` - Đăng ký

### **Health Check APIs:**
- **GET** `/health` - Tổng thể
- **GET** `/api/v1/*/health` - Từng service

### **Public Information APIs:**
- **GET** `/api/v1/wedding-service/lobby/halls` - Danh sách sảnh
- **GET** `/api/v1/wedding-service/lobby/halls/:id` - Chi tiết sảnh
- **GET** `/api/v1/wedding-service/lobby/hall-types` - Loại sảnh
- **GET** `/api/v1/wedding-service/regulations` - Quy định
- **GET** `/api/v1/wedding-service/lookup/shifts` - Ca tiệc

---

## **Permission Matrix by API Service**

| Service | Public APIs | Auth Required | Permissions Needed |
|---------|-------------|---------------|-------------------|
| **Auth Service** | login, register | ❌ | None |
| **Hall Management** | view halls/types | ✅ | MANAGE_HALLS |
| **Wedding Bookings** | ❌ | ✅ | MANAGE_BOOKINGS |
| **Wedding Lookup** | view shifts | ✅ | SEARCH_WEDDINGS |
| **Invoice Service** | ❌ | ✅ | MANAGE_INVOICES |
| **Report Service** | ❌ | ✅ | VIEW_REPORTS |
| **Regulations** | view regulations | ✅ | MANAGE_REGULATIONS |
| **Profile Service** | ❌ | ✅ | VIEW_PROFILE |

---

## **API Route Structure**

### **Microservice Style (Recommended):**
```
/api/v1/{service-name}/{resource}
```

### **Legacy Style (Backward Compatibility):**
```
/api/{resource}
```

### **Examples:**
- Modern: `/api/v1/wedding-service/bookings`
- Legacy: `/api/bookings`

---

## **Security Implementation**

### **Authentication Flow:**
1. **Login** → Nhận JWT token chứa user info + permissions
2. **API Call** → Gửi `Authorization: Bearer {token}`
3. **authMiddleware** → Verify token + extract user
4. **requirePermission** → Check bitwise permission

### **Permission Check Logic:**
```javascript
// Bitwise AND check
(userPermissions & requiredPermission) === requiredPermission
```

### **Example:**
- User có permissions: 7 (1+2+4 = MANAGE_HALLS + MANAGE_BOOKINGS + SEARCH_WEDDINGS)
- API cần permission: 2 (MANAGE_BOOKINGS)  
- Check: (7 & 2) === 2 → ✅ Allowed