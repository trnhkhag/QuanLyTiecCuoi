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
(1, 'administrator', 'Quản trị viên hệ thống'), 
(2, 'user', 'Người dùng thông thường');

-- Insert permissions
INSERT INTO Quyen (ID_Quyen, Ten_Quyen, MoTa, GiaTri)
VALUES 
(1, 'view_customers', 'Xem thông tin khách hàng', 1),
(2, 'edit_customers', 'Chỉnh sửa thông tin khách hàng', 2),
(3, 'view_weddings', 'Xem tiệc cưới', 4),
(4, 'create_weddings', 'Tạo tiệc cưới', 8),
(5, 'manage_invoices', 'Quản lý hóa đơn', 16),
(6, 'manage_system', 'Quản lý hệ thống', 32);

-- Create admin account
INSERT INTO TaiKhoan (ID_TaiKhoan, Username, PasswordHash)
VALUES 
(1, 'admin@example.com', '$2a$10$gYfELbVDT3m3AbP3R2RQSODTjCFhzBn9i7n3jnGHJm.tFcXfPAU8u'), -- 'admin123' hashed
(2, 'trinhhoang@gmail.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
(3, 'trinhhoang2525@gmail.com', '$2a$10$k4TTTEAQt140CP/P56SY7.nlGBJZtpwlSt/OAyzhiBWvJvivAP6VC'); -- 'password123' hashed

-- Assign admin role
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- Admin gets all permissions
(2, 1), (2, 3), (2, 4); -- Regular user gets view and create permissions

-- Assign admin role to admin account
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (1, 1);  -- Admin account gets admin role

-- Create admin as staff
INSERT INTO NhanVien (ID_NhanVien, HoTen, ChucVu, ID_TaiKhoan)
VALUES (1, 'Administrator', 'Quản trị viên', 1);

-- Assign 'user' role to the user accounts
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (2, 1), (3, 2);

-- Create KhachHang records for these user accounts
INSERT INTO KhachHang (ID_KhachHang, HoTen, SoDienThoai, Email, ID_TaiKhoan)
VALUES
(1, 'Trịnh Văn Hoàng', '0905123456', 'trinhhoang@gmail.com', 2),
(2, 'Nguyễn Thị Mai', '0905654321', 'trinhhoang2525@gmail.com', 3);

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
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 1, 1, '2025-07-10', 1, '2025-05-01 10:00:00', 18, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(1, 1, 1, 5000000.00), 
(1, 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(1, 1, '2025-05-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 1'),
(2, 1, '2025-07-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 1');

-- TiecCuoi 2
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 2, 2, '2025-07-15', 2, '2025-05-10 14:00:00', 12, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(2, 3, 1, 2500000.00), 
(2, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(3, 2, '2025-05-11', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 2'),
(4, 2, '2025-07-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 2');

-- TiecCuoi 3
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (3, 1, 3, '2025-07-20', 1, '2025-05-15 09:00:00', 8, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(3, 1, 1, 5000000.00), 
(3, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(5, 3, '2025-05-16', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 3'),
(6, 3, '2025-07-21', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 3');

-- TiecCuoi 4
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (4, 2, 4, '2025-07-25', 2, '2025-05-20 11:00:00', 6, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(4, 2, 1, 3000000.00), 
(4, 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(7, 4, '2025-05-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 4'),
(8, 4, '2025-07-26', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 4');

-- TiecCuoi 5
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (5, 1, 1, '2025-08-01', 1, '2025-06-01 15:00:00', 15, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(5, 4, 1, 7000000.00), 
(5, 5, 1, 4000000.00),
(5, 1, 1, 5000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(9, 5, '2025-06-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 5'),
(10, 5, '2025-08-02', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 5');

-- TiecCuoi 6
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (6, 2, 2, '2025-08-05', 2, '2025-06-05 10:30:00', 14, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(6, 1, 1, 5000000.00),
(6, 2, 1, 3000000.00),
(6, 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(11, 6, '2025-06-06', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 6'),
(12, 6, '2025-08-06', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 6');

-- TiecCuoi 7
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (7, 1, 3, '2025-08-10', 1, '2025-06-10 11:00:00', 9, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(7, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(13, 7, '2025-06-11', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 7'),
(14, 7, '2025-08-11', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 7');

-- TiecCuoi 8
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (8, 2, 4, '2025-08-15', 2, '2025-06-15 16:00:00', 7, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(8, 5, 1, 4000000.00),
(8, 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(15, 8, '2025-06-16', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 8'),
(16, 8, '2025-08-16', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 8');

-- TiecCuoi 9
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (9, 1, 1, '2025-08-20', 1, '2025-06-20 09:30:00', 19, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(9, 1, 1, 5000000.00),
(9, 3, 1, 2500000.00),
(9, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(17, 9, '2025-06-21', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 9'),
(18, 9, '2025-08-21', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 9');

-- TiecCuoi 10
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (10, 2, 2, '2025-08-25', 2, '2025-06-25 14:30:00', 13, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(10, 2, 1, 3000000.00),
(10, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(19, 10, '2025-06-26', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 10'),
(20, 10, '2025-08-26', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 10');

-- TiecCuoi 11
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (11, 1, 3, '2025-09-01', 1, '2025-07-01 10:00:00', 10, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(11, 1, 1, 5000000.00),
(11, 2, 1, 3000000.00),
(11, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(21, 11, '2025-07-02', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 11'),
(22, 11, '2025-09-02', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 11');

-- TiecCuoi 12
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (12, 2, 4, '2025-09-05', 2, '2025-07-05 14:00:00', 7, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(12, 3, 1, 2500000.00),
(12, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(23, 12, '2025-07-06', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 12'),
(24, 12, '2025-09-06', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 12');

-- TiecCuoi 13
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (13, 1, 1, '2025-09-10', 1, '2025-07-10 09:00:00', 20, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(13, 1, 1, 5000000.00),
(13, 2, 1, 3000000.00),
(13, 3, 1, 2500000.00),
(13, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(25, 13, '2025-07-11', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 13'),
(26, 13, '2025-09-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 13');

-- TiecCuoi 14
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (14, 2, 2, '2025-09-15', 2, '2025-07-15 11:00:00', 11, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(14, 1, 1, 5000000.00),
(14, 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(27, 14, '2025-07-16', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 14'),
(28, 14, '2025-09-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 14');

-- TiecCuoi 15
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (15, 1, 4, '2025-09-20', 1, '2025-07-20 15:30:00', 8, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(15, 2, 1, 3000000.00),
(15, 3, 1, 2500000.00),
(15, 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_HoaDon, ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(29, 15, '2025-07-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 15'),
(30, 15, '2025-09-21', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 15'); 