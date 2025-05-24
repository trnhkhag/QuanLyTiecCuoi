SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Insert sample data
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, 'Trưa'), (2, 'Tối');

INSERT INTO LoaiSanh (ID_LoaiSanh, TenLoai, GiaBanToiThieu)
VALUES 
(1, 'A', 1000000),
(2, 'B', 1100000),
(3, 'C', 1200000),
(4, 'D', 1400000),
(5, 'E', 1600000);

-- Insert roles
INSERT INTO VaiTro (ID_VaiTro, TenVaiTro, MoTa) 
VALUES 
(1, 'admin', 'Quản lý cấp cao - Tất cả quyền'), 
(2, 'manager', 'Quản lý - Quyền quản lý nghiệp vụ chính'),
(3, 'receptionist', 'Lễ tân - Đặt tiệc và tra cứu'),
(4, 'accountant', 'Kế toán - Hóa đơn và báo cáo'),
(5, 'kitchen', 'Bộ phận bếp - Tra cứu tiệc để chuẩn bị'),
(6, 'admin_staff', 'Nhân viên hành chính - Quản lý sảnh'),
(7, 'customer', 'Khách hàng');

-- Insert permissions
INSERT INTO Quyen (ID_Quyen, Ten_Quyen, MoTa, GiaTri)
VALUES 
-- Quản lý sảnh
(1, 'manage_halls', 'Quản lý sảnh (xem, thêm, sửa, xóa)', 1),
-- Quản lý đặt tiệc
(2, 'manage_bookings', 'Quản lý đặt tiệc (xem, thêm, sửa, xóa)', 2),
-- Tra cứu tiệc cưới
(3, 'search_weddings', 'Tra cứu thông tin tiệc cưới', 4),
-- Quản lý hóa đơn
(4, 'manage_invoices', 'Lập và quản lý hóa đơn', 8),
-- Xem báo cáo
(5, 'view_reports', 'Xem báo cáo doanh thu', 16),
-- Quản lý quy định (chỉ admin)
(6, 'manage_regulations', 'Quản lý quy định hệ thống', 32),
-- Quản lý người dùng (chỉ admin)  
(7, 'manage_users', 'Quản lý người dùng', 64),
-- Xem thông tin cá nhân (tất cả user)
(8, 'view_profile', 'Xem và sửa thông tin cá nhân', 128);

-- Create admin account
INSERT INTO TaiKhoan (ID_TaiKhoan, Username, PasswordHash)
VALUES 
(1, 'admin@example.com', '$2a$10$gYfELbVDT3m3AbP3R2RQSODTjCFhzBn9i7n3jnGHJm.tFcXfPAU8u'), -- 'admin123' hashed
(2, 'manager@example.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(3, 'receptionist@example.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(4, 'accountant@example.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(5, 'kitchen@example.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(6, 'adminstaff@example.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(7, 'trinhhoang@gmail.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(8, 'trinhhoang2525@gmail.com', '$2a$10$k4TTTEAQt140CP/P56SY7.nlGBJZtpwlSt/OAyzhiBWvJvivAP6VC'); -- 'password123' hashed

-- Assign permissions to roles
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
VALUES 
-- Admin (Quản lý cấp cao) - Tất cả quyền
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),

-- Manager (Quản lý) - BM1, BM3, BM5
(2, 1), -- MANAGE_HALLS (Quản lý Sảnh)
(2, 3), -- SEARCH_WEDDINGS (Tra cứu Tiệc Cưới) 
(2, 5), -- VIEW_REPORTS (Lập Báo Cáo Tháng)
(2, 8), -- VIEW_PROFILE

-- Receptionist (Lễ tân) - BM2, BM3  
(3, 2), -- MANAGE_BOOKINGS (Nhận Đặt Tiệc Cưới)
(3, 3), -- SEARCH_WEDDINGS (Tra cứu Tiệc Cưới)
(3, 8), -- VIEW_PROFILE

-- Accountant (Kế toán) - BM4, BM5
(4, 4), -- MANAGE_INVOICES (Lập Hóa Đơn Thanh Toán)
(4, 5), -- VIEW_REPORTS (Lập Báo Cáo Tháng)
(4, 8), -- VIEW_PROFILE

-- Kitchen (Bộ phận bếp) - BM3
(5, 3), -- SEARCH_WEDDINGS (Tra cứu Tiệc Cưới)
(5, 8), -- VIEW_PROFILE

-- Admin Staff (Nhân viên hành chính) - BM1
(6, 1), -- MANAGE_HALLS (Quản lý Sảnh)
(6, 8), -- VIEW_PROFILE

-- Customer - Chỉ có quyền xem thông tin cá nhân
(7, 8);

-- Assign roles to accounts
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES 
(1, 1),  -- Admin account gets admin role
(2, 2),  -- Manager account
(3, 3),  -- Receptionist account  
(4, 4),  -- Accountant account
(5, 5),  -- Kitchen account
(6, 6),  -- Admin staff account
(7, 7),  -- Customer accounts
(8, 7);

-- Create admin as staff
INSERT INTO NhanVien (ID_NhanVien, HoTen, ChucVu, ID_TaiKhoan)
VALUES 
(1, 'Administrator', 'Quản lý cấp cao', 1),
(2, 'Nguyễn Văn Quản', 'Quản lý', 2),
(3, 'Trần Thị Lệ', 'Lễ tân', 3),
(4, 'Lê Văn Kế', 'Kế toán', 4),
(5, 'Phạm Thị Bếp', 'Bộ phận bếp', 5),
(6, 'Hoàng Văn Hành', 'Nhân viên hành chính', 6);

-- Create KhachHang records for customer accounts
INSERT INTO KhachHang (ID_KhachHang, HoTen, SoDienThoai, Email, ID_TaiKhoan)
VALUES
(1, 'Trịnh Văn Hoàng', '0905123456', 'trinhhoang@gmail.com', 7),
(2, 'Nguyễn Thị Mai', '0905654321', 'trinhhoang2525@gmail.com', 8);

-- Insert sample SanhTiec records (Wedding Halls)
INSERT INTO SanhTiec (ID_SanhTiec, TenSanh, SucChua, GiaThue, ID_LoaiSanh) VALUES
(1, 'Sảnh Kim Cương', 200, 20000000.00, 5),
(2, 'Sảnh Vàng', 150, 15000000.00, 4),
(3, 'Sảnh Bạc', 100, 12000000.00, 3),
(4, 'Sảnh Đồng', 80, 8000000.00, 2);

-- Insert sample DichVu records (Services)
INSERT INTO DichVu (ID_DichVu, TenDichVu, DonGia) VALUES
(1, 'Trang trí hoa tươi cao cấp', 5000000.00),
(2, 'Ban nhạc acoustic', 3000000.00),
(3, 'MC chuyên nghiệp', 2500000.00),
(4, 'Quay phim & Chụp hình tiệc cưới', 7000000.00),
(5, 'Vũ đoàn khai mạc', 4000000.00);

-- Generate 15 TiecCuoi records, with associated Tiec_DichVu and HoaDon
-- TiecCuoi 1
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (1, 1, 1, '2025-07-10', 1, '2025-05-01 10:00:00', 18, 2, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(1, 1, 1, 5000000.00), 
(1, 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(1, 1, '2025-05-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 1'),
(2, 1, '2025-07-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 1');

-- TiecCuoi 2
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (2, 2, 2, '2025-07-15', 2, '2025-05-10 14:00:00', 12, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(2, 3, 1, 2500000.00), 
(2, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(3, 2, '2025-05-11', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 2'),
(4, 2, '2025-07-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 2');

-- TiecCuoi 3
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (3, 1, 3, '2025-07-20', 1, '2025-05-15 09:00:00', 8, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(3, 1, 1, 5000000.00), 
(3, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(5, 3, '2025-05-16', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 3'),
(6, 3, '2025-07-21', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 3');

-- TiecCuoi 4
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (4, 2, 4, '2025-07-25', 2, '2025-05-20 11:00:00', 6, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(4, 2, 1, 3000000.00), 
(4, 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(7, 4, '2025-05-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 4'),
(8, 4, '2025-07-26', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 4');

-- TiecCuoi 5
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (5, 1, 1, '2025-08-01', 1, '2025-06-01 15:00:00', 15, 2, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(5, 4, 1, 7000000.00), 
(5, 5, 1, 4000000.00),
(5, 1, 1, 5000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(9, 5, '2025-06-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 5'),
(10, 5, '2025-08-02', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 5');

-- TiecCuoi 6
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (6, 2, 2, '2025-08-05', 2, '2025-06-05 10:30:00', 14, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(6, 1, 1, 5000000.00),
(6, 2, 1, 3000000.00),
(6, 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(11, 6, '2025-06-06', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 6'),
(12, 6, '2025-08-06', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 6');

-- TiecCuoi 7
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (7, 1, 3, '2025-08-10', 1, '2025-06-10 11:00:00', 9, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(7, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(13, 7, '2025-06-11', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 7'),
(14, 7, '2025-08-11', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 7');

-- TiecCuoi 8
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (8, 2, 4, '2025-08-15', 2, '2025-06-15 16:00:00', 7, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(8, 5, 1, 4000000.00),
(8, 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(15, 8, '2025-06-16', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 8'),
(16, 8, '2025-08-16', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 8');

-- TiecCuoi 9
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (9, 1, 1, '2025-08-20', 1, '2025-06-20 09:30:00', 19, 2, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(9, 1, 1, 5000000.00),
(9, 3, 1, 2500000.00),
(9, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(17, 9, '2025-06-21', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 9'),
(18, 9, '2025-08-21', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 9');

-- TiecCuoi 10
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (10, 2, 2, '2025-08-25', 2, '2025-06-25 14:30:00', 13, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(10, 2, 1, 3000000.00),
(10, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(19, 10, '2025-06-26', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 10'),
(20, 10, '2025-08-26', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 10');

-- TiecCuoi 11
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (11, 1, 3, '2025-09-01', 1, '2025-07-01 10:00:00', 10, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(11, 1, 1, 5000000.00),
(11, 2, 1, 3000000.00),
(11, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(21, 11, '2025-07-02', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 11'),
(22, 11, '2025-09-02', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 11');

-- TiecCuoi 12
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (12, 2, 4, '2025-09-05', 2, '2025-07-05 14:00:00', 7, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(12, 3, 1, 2500000.00),
(12, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(23, 12, '2025-07-06', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 12'),
(24, 12, '2025-09-06', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 12');

-- TiecCuoi 13
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (13, 1, 1, '2025-09-10', 1, '2025-07-10 09:00:00', 20, 2, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(13, 1, 1, 5000000.00),
(13, 2, 1, 3000000.00),
(13, 3, 1, 2500000.00),
(13, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(25, 13, '2025-07-11', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 13'),
(26, 13, '2025-09-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 13');

-- TiecCuoi 14
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (14, 2, 2, '2025-09-15', 2, '2025-07-15 11:00:00', 11, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(14, 1, 1, 5000000.00),
(14, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(27, 14, '2025-07-16', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 14'),
(28, 14, '2025-09-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 14');

-- TiecCuoi 15
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai)
VALUES (15, 1, 4, '2025-09-20', 1, '2025-07-20 15:30:00', 8, 1, 'Đã thanh toán');

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(15, 2, 1, 3000000.00),
(15, 3, 1, 2500000.00),
(15, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(29, 15, '2025-07-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 15'),
(30, 15, '2025-09-21', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 15');

-- Dữ liệu mẫu cho bảng QuyDinh
INSERT INTO QuyDinh (ID_QuyDinh, TenQuyDinh, MoTa) VALUES
('QD1', 'Qui định 1', 'Có 5 loại Sảnh (A, B, C, D, E) với đơn giá bàn tối thiểu tương ứng là (1.000.000, 1.100.000, 1.200.000, 1.400.000, 1.600.000)'),
('QD2', 'Qui định 2', 'Chỉ nhận đặt tiệc khi sảnh chưa có người đặt (tương ứng với ngày và ca). Có hai ca (Trưa, Tối). Ngoài ra có 20 dịch vụ, 100 món ăn.'),
('QD4', 'Qui định 4', 'Đơn giá thanh toán các dich vụ được tính theo đơn giá trong phiếu đặt tiệc cưới. Ngày thanh toán trùng với ngày đãi tiệc, thanh toán trễ phạt 1% ngày.'); 