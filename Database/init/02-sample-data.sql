-- Insert sample data
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, 'Trưa'), (2, 'Tối');

INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu)
VALUES ('A', 1000000), ('B', 1100000), ('C', 1200000), ('D', 1400000), ('E', 1600000);

-- Insert roles
INSERT INTO VaiTro (TenVaiTro, MoTa) 
VALUES ('administrator', 'Quản trị viên hệ thống'), 
       ('user', 'Người dùng thông thường');

-- Insert permissions
INSERT INTO Quyen (Ten_Quyen, MoTa, GiaTri)
VALUES 
('view_customers', 'Xem thông tin khách hàng', 1),
('edit_customers', 'Chỉnh sửa thông tin khách hàng', 2),
('view_weddings', 'Xem tiệc cưới', 4),
('create_weddings', 'Tạo tiệc cưới', 8),
('manage_invoices', 'Quản lý hóa đơn', 16),
('manage_system', 'Quản lý hệ thống', 32);

-- Create admin account
INSERT INTO TaiKhoan (Username, PasswordHash)
VALUES ('admin@example.com', '$2a$10$gYfELbVDT3m3AbP3R2RQSODTjCFhzBn9i7n3jnGHJm.tFcXfPAU8u'), -- 'admin123' hashed
('trinhhoang@gmail.com', '$2a$10$Z..kHQ/9renYhfzEwxUps.t0g23z7lZMrRdY8PASbV4HXpigL83e.'), -- 'password123' hashed
('trinhhoang2525@gmail.com', '$2a$10$k4TTTEAQt140CP/P56SY7.nlGBJZtpwlSt/OAyzhiBWvJvivAP6VC'); -- 'password123' hashed

-- Assign admin role
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- Admin gets all permissions
(2, 1), (2, 3), (2, 4); -- Regular user gets view and create permissions

-- Assign admin role to admin account
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (1, 1);  -- Admin account gets admin role

-- Create admin as staff
INSERT INTO NhanVien (HoTen, ChucVu, ID_TaiKhoan)
VALUES ('Administrator', 'Quản trị viên', 1);

-- Assign 'user' role (ID_VaiTro = 2) to the user accounts
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (2, 1), (3, 2)
ON DUPLICATE KEY UPDATE ID_TaiKhoan = VALUES(ID_TaiKhoan), ID_VaiTro = VALUES(ID_VaiTro);

-- Create KhachHang records for these user accounts
INSERT INTO KhachHang (HoTen, SoDienThoai, Email, ID_TaiKhoan)
VALUES
('Trịnh Văn Hoàng', '0905123456', 'trinhhoang@gmail.com', 2),
('Nguyễn Thị Mai', '0905654321', 'trinhhoang2525@gmail.com', 3);

-- Insert sample SanhTiec records (Wedding Halls)
INSERT INTO SanhTiec (TenSanh, SucChua, GiaThue, ID_LoaiSanh) VALUES
('Sảnh Kim Cương', 200, 20000000.00, 5),
('Sảnh Vàng', 150, 15000000.00, 4),
('Sảnh Bạc', 100, 12000000.00, 3),
('Sảnh Đồng', 80, 8000000.00, 2);

-- Insert sample DichVu records (Services)
INSERT INTO DichVu (TenDichVu, DonGia) VALUES
('Trang trí hoa tươi cao cấp', 5000000.00),
('Ban nhạc acoustic', 3000000.00),
('MC chuyên nghiệp', 2500000.00),
('Quay phim & Chụp hình tiệc cưới', 7000000.00),
('Vũ đoàn khai mạc', 4000000.00);

-- Generate 15 TiecCuoi records, with associated Tiec_DichVu and HoaDon
-- TiecCuoi 1
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 1, '2025-07-10', 1, '2025-05-01 10:00:00', 18, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00), 
(LAST_INSERT_ID(), 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-05-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 1'),
(LAST_INSERT_ID(), '2025-07-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 1');

-- TiecCuoi 2
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 2, '2025-07-15', 2, '2025-05-10 14:00:00', 12, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 3, 1, 2500000.00), 
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-05-11', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 2'),
(LAST_INSERT_ID(), '2025-07-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 2');

-- TiecCuoi 3
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 3, '2025-07-20', 1, '2025-05-15 09:00:00', 8, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00), 
(LAST_INSERT_ID(), 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-05-16', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 3'),
(LAST_INSERT_ID(), '2025-07-21', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 3');

-- TiecCuoi 4
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 4, '2025-07-25', 2, '2025-05-20 11:00:00', 6, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 2, 1, 3000000.00), 
(LAST_INSERT_ID(), 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-05-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 4'),
(LAST_INSERT_ID(), '2025-07-26', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 4');

-- TiecCuoi 5
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 1, '2025-08-01', 1, '2025-06-01 15:00:00', 15, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 4, 1, 7000000.00), 
(LAST_INSERT_ID(), 5, 1, 4000000.00),
(LAST_INSERT_ID(), 1, 1, 5000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-02', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 5'),
(LAST_INSERT_ID(), '2025-08-02', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 5');

-- TiecCuoi 6
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 2, '2025-08-05', 2, '2025-06-05 10:30:00', 14, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00),
(LAST_INSERT_ID(), 2, 1, 3000000.00),
(LAST_INSERT_ID(), 3, 1, 2500000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-06', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 6'),
(LAST_INSERT_ID(), '2025-08-06', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 6');

-- TiecCuoi 7
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 3, '2025-08-10', 1, '2025-06-10 11:00:00', 9, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-11', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 7'),
(LAST_INSERT_ID(), '2025-08-11', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 7');

-- TiecCuoi 8
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 4, '2025-08-15', 2, '2025-06-15 16:00:00', 7, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 5, 1, 4000000.00),
(LAST_INSERT_ID(), 2, 1, 3000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-16', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 8'),
(LAST_INSERT_ID(), '2025-08-16', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 8');

-- TiecCuoi 9
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 1, '2025-08-20', 1, '2025-06-20 09:30:00', 19, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00),
(LAST_INSERT_ID(), 3, 1, 2500000.00),
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-21', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 9'),
(LAST_INSERT_ID(), '2025-08-21', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 9');

-- TiecCuoi 10
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 2, '2025-08-25', 2, '2025-06-25 14:30:00', 13, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 2, 1, 3000000.00),
(LAST_INSERT_ID(), 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-06-26', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 10'),
(LAST_INSERT_ID(), '2025-08-26', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 10');

-- TiecCuoi 11
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 3, '2025-09-01', 1, '2025-07-01 10:00:00', 10, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00),
(LAST_INSERT_ID(), 2, 1, 3000000.00),
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-07-02', 3600000.00, 3600000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 11'),
(LAST_INSERT_ID(), '2025-09-02', 8400000.00, 8400000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 11');

-- TiecCuoi 12
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 4, '2025-09-05', 2, '2025-07-05 14:00:00', 7, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 3, 1, 2500000.00),
(LAST_INSERT_ID(), 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-07-06', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 12'),
(LAST_INSERT_ID(), '2025-09-06', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 12');

-- TiecCuoi 13
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 1, '2025-09-10', 1, '2025-07-10 09:00:00', 20, 2);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00),
(LAST_INSERT_ID(), 2, 1, 3000000.00),
(LAST_INSERT_ID(), 3, 1, 2500000.00),
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-07-11', 6000000.00, 6000000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 13'),
(LAST_INSERT_ID(), '2025-09-11', 14000000.00, 14000000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 13');

-- TiecCuoi 14
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (2, 2, '2025-09-15', 2, '2025-07-15 11:00:00', 11, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 1, 1, 5000000.00),
(LAST_INSERT_ID(), 5, 1, 4000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-07-16', 4500000.00, 4500000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 14'),
(LAST_INSERT_ID(), '2025-09-16', 10500000.00, 10500000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 14');

-- TiecCuoi 15
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (1, 4, '2025-09-20', 1, '2025-07-20 15:30:00', 8, 1);

INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(LAST_INSERT_ID(), 2, 1, 3000000.00),
(LAST_INSERT_ID(), 3, 1, 2500000.00),
(LAST_INSERT_ID(), 4, 1, 7000000.00);

INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(LAST_INSERT_ID(), '2025-07-21', 2400000.00, 2400000.00, 'Thanh toán đặt cọc', 'Đặt cọc cho tiệc cưới ID 15'),
(LAST_INSERT_ID(), '2025-09-21', 5600000.00, 5600000.00, 'Thanh toán còn lại', 'Thanh toán còn lại cho tiệc cưới ID 15'); 