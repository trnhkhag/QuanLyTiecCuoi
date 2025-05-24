# Frontend Routes và Quyền Truy Cập - QuanLyTiecCuoi

## 🗺️ **Toàn Bộ Routes Frontend**

### 📊 **Main Routes (App.js)**

| Route | Component | Quyền Hiện Tại | Quyền Đề Xuất | Mô Tả |
|-------|-----------|-----------------|----------------|-------|
| `/` | → `/dashboard` | None | None | Redirect |
| `/login` | LoginPage | Public | Public | Đăng nhập |
| `/register` | RegisterPage | Public | Public | Đăng ký |
| `/dashboard` | DashboardPage | Authenticated | Any Authenticated | Tổng quan |
| `/invoices` | InvoicesPage | `MANAGE_INVOICES` | `MANAGE_INVOICES` | Danh sách hóa đơn |
| `/invoice/:id` | InvoiceInformationPage | `MANAGE_INVOICES` | `MANAGE_INVOICES` | Chi tiết hóa đơn |
| `/reports` | MonthlyReportPage | `VIEW_REPORTS` | `VIEW_REPORTS` | Báo cáo tháng |
| `/profile` | ProfilePage | `VIEW_PROFILE` | `VIEW_PROFILE` | Thông tin cá nhân |

### 🏛️ **Admin Routes (/admin/\*)**

| Route | Component | Quyền Hiện Tại | Quyền Đề Xuất | Mô Tả |
|-------|-----------|-----------------|----------------|-------|
| `/admin/` | DashboardPage | `MANAGE_REGULATIONS \| MANAGE_HALLS` | `MANAGE_HALLS` | Admin Dashboard |
| `/admin/halls` | HallManagementPage | `MANAGE_REGULATIONS \| MANAGE_HALLS` | `MANAGE_HALLS` | Quản lý sảnh |
| `/admin/regulations` | RegulationManagementPage | `MANAGE_REGULATIONS \| MANAGE_HALLS` | `MANAGE_REGULATIONS` | Quản lý quy định |

### 🎭 **Booking Routes (/booking/\*)**

| Route | Component | Quyền Hiện Tại | Quyền Đề Xuất | Mô Tả |
|-------|-----------|-----------------|----------------|-------|
| `/booking/` | BookingHomePage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Trang chủ booking |
| `/booking/new` | BookingFormPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS` | Tạo đặt tiệc mới |
| `/booking/list` | BookingListPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Danh sách đặt tiệc |
| `/booking/halls` | HallListPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Danh sách sảnh |
| `/booking/halls/:id` | HallDetailPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Chi tiết sảnh |
| `/booking/detail/:id` | HallDetailPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Chi tiết booking |
| `/booking/success` | BookingSuccessPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS` | Thành công |
| `/booking/success/:id` | BookingSuccessPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_BOOKINGS` | Thành công |
| `/booking/regulations` | RegulationListPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | Any Authenticated | Xem quy định |
| `/booking/regulations/manage` | RegulationManagementPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `MANAGE_REGULATIONS` | Quản lý quy định |
| `/booking/lookup` | WeddingLookupPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `SEARCH_WEDDINGS` | Tra cứu tiệc cưới |
| `/booking/weddings/:id` | WeddingDetailPage | `MANAGE_BOOKINGS \| SEARCH_WEDDINGS` | `SEARCH_WEDDINGS` | Chi tiết tiệc cưới |

---

## 🎯 **Đề Xuất Mapping Route-Permission**

### 🔄 **Quyền Truy Cập Thông Minh**

| Nghiệp Vụ | Route Main | Sub Routes | Quyền Cần | Logic |
|-----------|------------|------------|-----------|-------|
| **Quản lý Sảnh (BM1)** | `/admin/halls` | - | `MANAGE_HALLS` | Admin/Manager/AdminStaff |
| **Đặt Tiệc (BM2)** | `/booking/*` | `new`, `success` | `MANAGE_BOOKINGS` | Receptionist tạo đặt tiệc |
| **Tra cứu Tiệc (BM3)** | `/booking/*` | `lookup`, `weddings/:id`, `list` | `SEARCH_WEDDINGS` | Manager/Receptionist/Kitchen xem |
| **Hóa Đơn (BM4)** | `/invoices` | `:id` | `MANAGE_INVOICES` | Accountant |
| **Báo Cáo (BM5)** | `/reports` | - | `VIEW_REPORTS` | Manager/Accountant |
| **Quy Định (QĐ6)** | `/admin/regulations` | `/booking/regulations/manage` | `MANAGE_REGULATIONS` | Admin |

### 🎭 **Logic Truy Cập Trang**

**Nguyên tắc:** *Nếu có 1 phần quyền → cho phép truy cập trang, ẩn những chức năng không có quyền*

1. **Trang `/booking/*`:**
   - Có `MANAGE_BOOKINGS` → Thấy tất cả (tạo, sửa, xóa)
   - Có `SEARCH_WEDDINGS` → Chỉ thấy tra cứu, xem danh sách
   - Không có quyền nào → Ẩn toàn bộ

2. **Trang `/admin/*`:**
   - Có `MANAGE_HALLS` → Thấy quản lý sảnh
   - Có `MANAGE_REGULATIONS` → Thấy quản lý quy định
   - Không có quyền nào → Ẩn toàn bộ

---

## 👥 **Permission Matrix by Role**

| Vai Trò | Dashboard | Booking | Admin | Invoices | Reports | Profile |
|---------|-----------|---------|--------|----------|---------|---------|
| **Admin** | ✅ | ✅ Full | ✅ Full | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ Read Only | ✅ Halls Only | ❌ | ✅ | ✅ |
| **Receptionist** | ✅ | ✅ Full | ❌ | ❌ | ❌ | ✅ |
| **Accountant** | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Kitchen** | ✅ | ✅ Read Only | ❌ | ❌ | ❌ | ✅ |
| **Admin Staff** | ✅ | ❌ | ✅ Halls Only | ❌ | ❌ | ✅ |
| **Customer** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🔧 **Cần Điều Chỉnh**

### 1. **Route Permission Updates**
- [ ] `/admin/*` routes: Tách quyền `MANAGE_HALLS` và `MANAGE_REGULATIONS` riêng biệt
- [ ] `/booking/regulations/manage`: Cần quyền `MANAGE_REGULATIONS` thay vì dùng chung

### 2. **UI Permission Handling**  
- [ ] Component-level permission checks cho buttons/forms
- [ ] Ẩn/hiện menu items dựa trên quyền
- [ ] Ẩn/hiện action buttons dựa trên quyền

### 3. **Navigation Menu Updates**
- [ ] ✅ `DashboardNavbar.jsx` đã implement permission-based menu
- [ ] Cần áp dụng tương tự cho sub-menus trong AdminRoutes và BookingRoutes 