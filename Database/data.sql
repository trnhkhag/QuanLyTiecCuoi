USE TiecCuoiDB;

-- Clear existing data (if any) in reverse order of foreign key dependencies
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Tiec_DichVu;
TRUNCATE TABLE DichVu;
TRUNCATE TABLE HoaDon;
TRUNCATE TABLE TiecCuoi;
TRUNCATE TABLE SanhTiec;
TRUNCATE TABLE CaTiec;
TRUNCATE TABLE LoaiSanh;
TRUNCATE TABLE NhanVien;
TRUNCATE TABLE KhachHang;
TRUNCATE TABLE TaiKhoan_VaiTro;
TRUNCATE TABLE VaiTro_Quyen;
TRUNCATE TABLE Quyen;
TRUNCATE TABLE VaiTro;
TRUNCATE TABLE TaiKhoan;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert data into TaiKhoan
INSERT INTO TaiKhoan (Username, PasswordHash) VALUES 
('admin', '$2a$12$gNV.PSY0DZMgz15JhT8mNOjnUTdWlnVSb8WYY5JLTM0FzfBVamVp2'), -- Password: admin123
('user1', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('user2', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('user3', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('customer1', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('customer2', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('customer3', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('customer4', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('customer5', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('staff1', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('staff2', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'), -- Password: user123
('staff3', '$2a$12$1DKJjnMDRGsVqNg6UPQSXe1bVlGI9sbZ/IkRymCL1vVnpb8JeSKxW'); -- Password: user123

-- Insert data into VaiTro
INSERT INTO VaiTro (TenVaiTro, MoTa) VALUES 
('Admin', 'Quản trị viên hệ thống'),
('NhanVien', 'Nhân viên quản lý tiệc cưới'),
('KhachHang', 'Khách hàng đặt tiệc');

-- Insert data into Quyen
INSERT INTO Quyen (Ten_Quyen, MoTa, GiaTri) VALUES 
('QuanLyNguoiDung', 'Quản lý thông tin người dùng', 1),
('QuanLyTiecCuoi', 'Quản lý thông tin tiệc cưới', 2),
('QuanLyHoaDon', 'Quản lý hóa đơn', 4),
('QuanLyDichVu', 'Quản lý dịch vụ', 8),
('XemBaoCao', 'Xem báo cáo doanh thu', 16),
('DatTiec', 'Đặt tiệc cưới', 32);

-- Insert data into VaiTro_Quyen
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Admin has all permissions
(2, 2), (2, 3), (2, 4), (2, 5), -- NhanVien has most permissions except user management
(3, 6); -- KhachHang can only book weddings

-- Insert data into TaiKhoan_VaiTro
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro) VALUES 
(1, 1), -- admin is Admin
(2, 2), (3, 2), (4, 2), -- user1, user2, user3 are NhanVien
(5, 3), (6, 3), (7, 3), (8, 3), (9, 3), -- customer1-5 are KhachHang
(10, 2), (11, 2), (12, 2); -- staff1-3 are NhanVien

-- Insert data into KhachHang
INSERT INTO KhachHang (HoTen, SoDienThoai, Email, ID_TaiKhoan) VALUES 
('Nguyễn Văn A', '0901234567', 'nguyenvana@gmail.com', 5),
('Trần Thị B', '0912345678', 'tranthib@gmail.com', 6),
('Lê Văn C', '0923456789', 'levanc@gmail.com', 7),
('Phạm Thị D', '0934567890', 'phamthid@gmail.com', 8),
('Hoàng Văn E', '0945678901', 'hoangvane@gmail.com', 9);

-- Insert data into NhanVien
INSERT INTO NhanVien (HoTen, ChucVu, ID_TaiKhoan) VALUES 
('Admin System', 'Quản Trị Viên', 1),
('Nhân Viên 1', 'Nhân viên bán hàng', 2),
('Nhân Viên 2', 'Nhân viên kế toán', 3),
('Nhân Viên 3', 'Nhân viên quản lý sảnh', 4),
('Nguyễn Thị F', 'Nhân viên lễ tân', 10),
('Trần Văn G', 'Nhân viên kế toán', 11),
('Lê Thị H', 'Nhân viên bán hàng', 12);

-- Insert data into LoaiSanh (already exists in schema but adding here for completeness)
INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu) VALUES 
('A', 1000000),
('B', 1100000),
('C', 1200000),
('D', 1400000),
('E', 1600000);

-- Insert data into CaTiec (already exists in schema but adding here for completeness)
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES 
(1, 'Trưa'),
(2, 'Tối');

-- Insert data into SanhTiec
INSERT INTO SanhTiec (TenSanh, SucChua, GiaThue, ID_LoaiSanh) VALUES 
('Royal Palace', 200, 50000000, 1),
('Diamond Hall', 250, 60000000, 2),
('Crystal Garden', 300, 70000000, 3),
('Golden Crown', 350, 80000000, 4),
('Platinum Sky', 400, 90000000, 5),
('Ruby Star', 220, 55000000, 1),
('Emerald Bay', 270, 65000000, 2),
('Sapphire Moon', 320, 75000000, 3),
('Pearl Ocean', 370, 85000000, 4),
('Silver Cloud', 420, 95000000, 5);

-- Insert data into DichVu
INSERT INTO DichVu (TenDichVu, DonGia) VALUES 
('Trang trí hoa tươi', 5000000),
('Ban nhạc sống', 8000000),
('Chụp ảnh cưới', 10000000),
('MC chuyên nghiệp', 3000000),
('Đội ngũ bê tráp', 2000000),
('Màn hình LED', 7000000),
('Xe hoa cưới', 4000000),
('Pháo hiệu', 1500000),
('Đội múa chuyên nghiệp', 6000000),
('Quay phim 4K', 15000000);

-- Insert data into MonAn
INSERT INTO MonAn (TenMonAn, DonGia) VALUES
('Gà hấp lá chanh', 250000),
('Bò lúc lắc', 300000),
('Tôm nướng muối ớt', 350000),
('Súp cua', 150000),
('Chè hạt sen', 100000);

-- Insert data into TiecCuoi
-- Create weddings in the past, present, and future
INSERT INTO TiecCuoi (ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru) VALUES 
-- Past weddings
(1, 1, '2023-09-15', 1, '2023-08-01 09:30:00', 30, 3),
(2, 3, '2023-10-20', 2, '2023-09-05 14:00:00', 40, 4),
(3, 5, '2023-11-12', 1, '2023-10-10 10:15:00', 50, 5),
(4, 2, '2023-12-05', 2, '2023-11-01 16:30:00', 35, 3),
(5, 4, '2024-01-18', 1, '2023-12-15 11:00:00', 45, 4),

-- Present/near future weddings
(1, 6, '2024-02-25', 2, '2024-01-10 09:00:00', 38, 4),
(2, 8, '2024-03-08', 1, '2024-02-01 15:30:00', 42, 4),
(3, 10, '2024-04-12', 2, '2024-03-05 10:00:00', 55, 5),

-- Future weddings
(4, 7, '2024-05-20', 1, '2024-04-10 14:45:00', 33, 3),
(5, 9, '2024-06-15', 2, '2024-05-15 13:30:00', 48, 5),
(1, 2, '2024-07-22', 1, '2024-06-10 11:15:00', 36, 3),
(2, 4, '2024-08-14', 2, '2024-07-01 16:00:00', 44, 4);

-- Insert data into HoaDon
-- For each wedding, create a deposit invoice and a final payment invoice
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES 
-- Past weddings - deposit and final payment
(1, '2023-08-01', 50000000, 15000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(1, '2023-09-15', 50000000, 35000000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

(2, '2023-09-05', 70000000, 21000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(2, '2023-10-20', 70000000, 49000000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

(3, '2023-10-10', 90000000, 27000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(3, '2023-11-12', 90000000, 63000000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

(4, '2023-11-01', 60000000, 18000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(4, '2023-12-05', 60000000, 42000000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

(5, '2023-12-15', 80000000, 24000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(5, '2024-01-18', 80000000, 56000000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

-- Present/near future weddings - only deposit for some
(6, '2024-01-10', 55000000, 16500000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(6, '2024-02-25', 55000000, 38500000, 'Thanh toán còn lại', 'Thanh toán phần còn lại'),

(7, '2024-02-01', 75000000, 22500000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
-- No final payment yet

(8, '2024-03-05', 95000000, 28500000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
-- No final payment yet

-- Future weddings - only deposit
(9, '2024-04-10', 65000000, 19500000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(10, '2024-05-15', 85000000, 25500000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(11, '2024-06-10', 60000000, 18000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%'),
(12, '2024-07-01', 80000000, 24000000, 'Thanh toán đặt cọc', 'Đặt cọc 30%');

-- Insert data into Tiec_DichVu
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES 
-- Wedding 1 services
(1, 1, 1, 5000000), -- Hoa tươi
(1, 3, 1, 10000000), -- Chụp ảnh
(1, 4, 1, 3000000), -- MC

-- Wedding 2 services
(2, 1, 1, 5000000), -- Hoa tươi
(2, 2, 1, 8000000), -- Ban nhạc
(2, 4, 1, 3000000), -- MC
(2, 7, 1, 4000000), -- Xe hoa

-- Wedding 3 services
(3, 1, 1, 5000000), -- Hoa tươi
(3, 2, 1, 8000000), -- Ban nhạc
(3, 3, 1, 10000000), -- Chụp ảnh
(3, 4, 1, 3000000), -- MC
(3, 6, 1, 7000000), -- Màn hình LED

-- Wedding 4 services
(4, 1, 1, 5000000), -- Hoa tươi
(4, 3, 1, 10000000), -- Chụp ảnh
(4, 5, 1, 2000000), -- Bê tráp

-- Wedding 5 services
(5, 1, 1, 5000000), -- Hoa tươi
(5, 2, 1, 8000000), -- Ban nhạc
(5, 3, 1, 10000000), -- Chụp ảnh
(5, 10, 1, 15000000), -- Quay phim 4K

-- Wedding 6 services
(6, 1, 1, 5000000), -- Hoa tươi
(6, 4, 1, 3000000), -- MC
(6, 7, 1, 4000000), -- Xe hoa

-- Wedding 7 services
(7, 1, 1, 5000000), -- Hoa tươi
(7, 3, 1, 10000000), -- Chụp ảnh
(7, 9, 1, 6000000), -- Đội múa

-- Wedding 8 services
(8, 1, 1, 5000000), -- Hoa tươi
(8, 2, 1, 8000000), -- Ban nhạc
(8, 3, 1, 10000000), -- Chụp ảnh
(8, 4, 1, 3000000), -- MC
(8, 10, 1, 15000000), -- Quay phim 4K

-- Wedding 9 services
(9, 1, 1, 5000000), -- Hoa tươi
(9, 4, 1, 3000000), -- MC
(9, 8, 2, 1500000), -- Pháo hiệu (2 sets)

-- Wedding 10 services
(10, 1, 1, 5000000), -- Hoa tươi
(10, 2, 1, 8000000), -- Ban nhạc
(10, 6, 1, 7000000), -- Màn hình LED

-- Wedding 11 services
(11, 1, 1, 5000000), -- Hoa tươi
(11, 3, 1, 10000000), -- Chụp ảnh
(11, 5, 2, 2000000), -- Bê tráp (2 teams)

-- Wedding 12 services
(12, 1, 1, 5000000), -- Hoa tươi
(12, 2, 1, 8000000), -- Ban nhạc
(12, 3, 1, 10000000), -- Chụp ảnh
(12, 7, 1, 4000000); -- Xe hoa 