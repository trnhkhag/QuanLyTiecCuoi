# Hệ Thống Vai Trò và Quyền - QuanLyTiecCuoi

## Quy Trình Nghiệp Vụ và Phân Quyền

### 🎯 **Mapping Quy Trình Nghiệp Vụ**

| STT | Nghiệp vụ | Mã Quyền | Người phụ trách | Ghi chú |
|-----|-----------|----------|-----------------|---------|
| 1 | Quản lý Sảnh (BM1, QĐ1) | `MANAGE_HALLS` | Quản lý / Nhân viên hành chính | Cập nhật Tên, Loại, Sức chứa, Giá bàn tối thiểu |
| 2 | Nhận Đặt Tiệc Cưới (BM2, QĐ2) | `MANAGE_BOOKINGS` | Lễ tân | Kiểm tra sảnh, ngày, ca, thu cọc, ghi thông tin |
| 3 | Tra cứu Tiệc Cưới (BM3) | `SEARCH_WEDDINGS` | Lễ tân, Quản lý, Bộ phận bếp | Danh sách tiệc để chuẩn bị |
| 4 | Lập Hóa Đơn Thanh Toán (BM4, QĐ4) | `MANAGE_INVOICES` | Kế toán | Hoàn tất trong ngày tiệc, tính phạt |
| 5 | Lập Báo Cáo Tháng (BM5) | `VIEW_REPORTS` | Quản lý / Kế toán | Tổng kết doanh thu, số tiệc |
| 6 | Thay đổi Quy định (QĐ6) | `MANAGE_REGULATIONS` | Quản lý cấp cao | Cập nhật quy định hệ thống |

---

## 👥 **Định Nghĩa Vai Trò**

### 1. **Admin (Quản lý cấp cao)**
- **ID:** 1
- **Quyền:** ALL PERMISSIONS (255)
- **Mô tả:** Tất cả quyền hệ thống

### 2. **Manager (Quản lý)**  
- **ID:** 2
- **Quyền:** BM1 + BM3 + BM5 (145)
  - `MANAGE_HALLS` (1)
  - `SEARCH_WEDDINGS` (4) 
  - `VIEW_REPORTS` (16)
  - `VIEW_PROFILE` (128)

### 3. **Receptionist (Lễ tân)**
- **ID:** 3  
- **Quyền:** BM2 + BM3 (134)
  - `MANAGE_BOOKINGS` (2)
  - `SEARCH_WEDDINGS` (4)
  - `VIEW_PROFILE` (128)

### 4. **Accountant (Kế toán)**
- **ID:** 4
- **Quyền:** BM4 + BM5 (152)
  - `MANAGE_INVOICES` (8)
  - `VIEW_REPORTS` (16)
  - `VIEW_PROFILE` (128)

### 5. **Kitchen (Bộ phận bếp)**
- **ID:** 5
- **Quyền:** BM3 (132)
  - `SEARCH_WEDDINGS` (4)
  - `VIEW_PROFILE` (128)

### 6. **Admin Staff (Nhân viên hành chính)**
- **ID:** 6
- **Quyền:** BM1 (129)
  - `MANAGE_HALLS` (1)
  - `VIEW_PROFILE` (128)

### 7. **Customer (Khách hàng)**
- **ID:** 7
- **Quyền:** (128)
  - `VIEW_PROFILE` (128)

---

## 🔐 **Bảng Quyền Chi Tiết**

| ID | Tên Quyền | Mô tả | Giá trị Bitwise | Người sử dụng |
|----|-----------|-------|-----------------|---------------|
| 1 | `MANAGE_HALLS` | Quản lý sảnh (xem, thêm, sửa, xóa) | 1 | Admin, Manager, Admin Staff |
| 2 | `MANAGE_BOOKINGS` | Quản lý đặt tiệc (xem, thêm, sửa, xóa) | 2 | Admin, Receptionist |
| 3 | `SEARCH_WEDDINGS` | Tra cứu thông tin tiệc cưới | 4 | Admin, Manager, Receptionist, Kitchen |
| 4 | `MANAGE_INVOICES` | Lập và quản lý hóa đơn | 8 | Admin, Accountant |
| 5 | `VIEW_REPORTS` | Xem báo cáo doanh thu | 16 | Admin, Manager, Accountant |
| 6 | `MANAGE_REGULATIONS` | Quản lý quy định hệ thống | 32 | Admin |
| 7 | `MANAGE_USERS` | Quản lý người dùng | 64 | Admin |
| 8 | `VIEW_PROFILE` | Xem và sửa thông tin cá nhân | 128 | All Users |

---

## 👤 **Tài Khoản Mẫu**

| Email | Password | Vai trò | Tổng quyền |
|-------|----------|---------|------------|
| `admin@example.com` | `admin123` | Admin | 255 |
| `manager@example.com` | `password123` | Manager | 145 |
| `receptionist@example.com` | `password123` | Receptionist | 134 |
| `accountant@example.com` | `password123` | Accountant | 152 |
| `kitchen@example.com` | `password123` | Kitchen | 132 |
| `adminstaff@example.com` | `password123` | Admin Staff | 129 |
| `trinhhoang@gmail.com` | `password123` | Customer | 128 |

---

## 🌐 **Cấu Hình Hệ Thống**

- **Client Port:** 3000 (React.js)
- **Server Port:** 3001 (Node.js + Express)
- **Database Port:** 3306 (MySQL 8.0)

### URL Truy cập:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Database:** localhost:3306 (TiecCuoiDB)

---

## ✅ **Trạng Thái Triển Khai**

- [x] Database schema với bảng QuyDinh
- [x] 7 vai trò theo quy trình nghiệp vụ  
- [x] 8 quyền với bitwise operations
- [x] Tài khoản mẫu cho mỗi vai trò
- [x] Docker containers running
- [x] React client accessible (port 3000)
- [x] Node.js server running (port 3001)
- [x] MySQL database initialized (port 3306) 