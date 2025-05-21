CREATE DATABASE IF NOT EXISTS TiecCuoiDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE TiecCuoiDB;

CREATE TABLE TaiKhoan (
    ID_TaiKhoan INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

CREATE TABLE VaiTro (
    ID_VaiTro INT PRIMARY KEY AUTO_INCREMENT,
    TenVaiTro VARCHAR(100) UNIQUE NOT NULL,
    MoTa VARCHAR(255)
);

CREATE TABLE Quyen (
    ID_Quyen INT PRIMARY KEY AUTO_INCREMENT,
    Ten_Quyen VARCHAR(100) UNIQUE NOT NULL,
    MoTa VARCHAR(255),
    GiaTri INT NOT NULL
);

CREATE TABLE VaiTro_Quyen (
    ID_VaiTro INT,
    ID_Quyen INT,
    PRIMARY KEY (ID_VaiTro, ID_Quyen),
    FOREIGN KEY (ID_VaiTro) REFERENCES VaiTro(ID_VaiTro),
    FOREIGN KEY (ID_Quyen) REFERENCES Quyen(ID_Quyen)
);

CREATE TABLE TaiKhoan_VaiTro (
    ID_TaiKhoan INT,
    ID_VaiTro INT,
    PRIMARY KEY (ID_TaiKhoan, ID_VaiTro),
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan),
    FOREIGN KEY (ID_VaiTro) REFERENCES VaiTro(ID_VaiTro)
);

CREATE TABLE KhachHang (
    ID_KhachHang INT PRIMARY KEY AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);

CREATE TABLE NhanVien (
    ID_NhanVien INT PRIMARY KEY AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    ChucVu VARCHAR(50),
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);

CREATE TABLE LoaiSanh (
    ID_LoaiSanh INT PRIMARY KEY AUTO_INCREMENT,
    TenLoai CHAR(1) UNIQUE NOT NULL,
    GiaBanToiThieu DECIMAL(18,2) NOT NULL
);

CREATE TABLE CaTiec (
    ID_Ca INT PRIMARY KEY,
    TenCa VARCHAR(20) UNIQUE NOT NULL -- Chi có 2 ca là trưa và tối
);

CREATE TABLE SanhTiec (
    ID_SanhTiec INT PRIMARY KEY AUTO_INCREMENT,
    TenSanh VARCHAR(100) NOT NULL,
    SucChua INT NOT NULL,
    GiaThue DECIMAL(18,2) NOT NULL,
    ID_LoaiSanh INT NOT NULL,
    FOREIGN KEY (ID_LoaiSanh) REFERENCES LoaiSanh(ID_LoaiSanh)
);

CREATE TABLE TiecCuoi (
    ID_TiecCuoi INT PRIMARY KEY AUTO_INCREMENT,
    ID_KhachHang INT NOT NULL,
    ID_SanhTiec INT NOT NULL,
    NgayToChuc DATE NOT NULL,
    ID_Ca INT NOT NULL, 
    ThoiDiemDat DATETIME NOT NULL,
    SoLuongBan INT NOT NULL,
    SoBanDuTru INT,
    FOREIGN KEY (ID_KhachHang) REFERENCES KhachHang(ID_KhachHang),
    FOREIGN KEY (ID_SanhTiec) REFERENCES SanhTiec(ID_SanhTiec),
    FOREIGN KEY (ID_Ca) REFERENCES CaTiec(ID_Ca)
);

CREATE TABLE HoaDon (
    /* 
    Sau khi có hóa đơn là thanh toán đặt cọc thì sẽ tạo hóa đơn thanh toán còn lại song song
    (Hóa đơn ảo, Không thể xóa, chỉ xóa khi đã xóa hóa đơn Thanh toán đặt cọc, chỉ tồn tại trên UI)
    sau đó nếu xác nhận thanh toán thì sẽ lưu hóa đơn vào database và hiển thị trạng thái đã thanh toán.
    Hóa đơn được xác nhận thì sẽ insert phần lớn dữ liệu hiện tại của hóa đơn ảo.
    */
    ID_HoaDon INT PRIMARY KEY AUTO_INCREMENT, -- Nếu là hóa đơn ảo thì để là "Chưa cấp"
    ID_TiecCuoi INT NOT NULL,
    NgayLap DATE NOT NULL, 
    /* Nếu là hóa đơn ảo thì NgayLap = NgayLap của hóa đơn thanh toán đặt cọc tương ứng
       Nếu là hóa đơn thanh toán còn lại đã xác nhận thì NgayLap = Date.Now */
    TongTien DECIMAL(18,2) NOT NULL, 
    /* Với hóa đơn ảo tổng tiền = Tổng tiền của hóa đơn thanh toán đặt cọc tương ứng + tiền phạt
       Tiền phạt sẽ tính bằng cách lấy Ngày trễ hạn = (Date.Now - TiecCuoi.ThoiDiemDat) > 0 
       tương ứng cho phạt 1%/ngày. Nếu Ngày trễ hạn < 0 thì không phạt */
    TienThanhToan DECIMAL(18,2) NOT NULL, -- Với hóa đơn ảo có tiền thanh toán = Tổng tiền hóa đơn ảo - Tiền thanh toán của hóa đơn đặt cọc tương ứng
    LoaiHoaDon VARCHAR(50) NOT NULL, -- chỉ có 2 loại hóa đơn là thanh toán còn lại và thanh toán đặt cọc
    GhiChu VARCHAR(255),  -- ghi chú về hóa đơn
    FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi)
);

CREATE TABLE DichVu (
    ID_DichVu INT PRIMARY KEY AUTO_INCREMENT,
    TenDichVu VARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL
);

CREATE TABLE Tiec_DichVu (
    ID_TiecCuoi INT,
    ID_DichVu INT,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (ID_TiecCuoi, ID_DichVu),
    FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi),
    FOREIGN KEY (ID_DichVu) REFERENCES DichVu(ID_DichVu)
);

-- Insert sample data
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, N'Trưa'), (2, N'Tối');

INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu)
VALUES ('A', 1000000), ('B', 1100000), ('C', 1200000), ('D', 1400000), ('E', 1600000);

-- Insert roles
INSERT INTO VaiTro (TenVaiTro, MoTa) 
VALUES ('administrator', N'Quản trị viên hệ thống'), 
       ('user', N'Người dùng thông thường');

-- Insert permissions
INSERT INTO Quyen (Ten_Quyen, MoTa, GiaTri)
VALUES 
('view_customers', N'Xem thông tin khách hàng', 1),
('edit_customers', N'Chỉnh sửa thông tin khách hàng', 2),
('view_weddings', N'Xem tiệc cưới', 4),
('create_weddings', N'Tạo tiệc cưới', 8),
('manage_invoices', N'Quản lý hóa đơn', 16),
('manage_system', N'Quản lý hệ thống', 32);

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
VALUES (N'Administrator', N'Quản trị viên', 1);


-- Assign 'user' role (ID_VaiTro = 2) to the user accounts
-- Assuming ID_TaiKhoan = 2 for 'trinhhoang@gmail.com'
-- Assuming ID_TaiKhoan = 3 for 'trinhhoang2525@gmail.com'
-- Assuming ID_VaiTro = 2 for 'user' role.
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (2, 1), (3, 2)
ON DUPLICATE KEY UPDATE ID_TaiKhoan = VALUES(ID_TaiKhoan), ID_VaiTro = VALUES(ID_VaiTro); -- Or handle error if already exists

-- Create KhachHang records for these user accounts
-- Assuming ID_KhachHang auto-increments and these are the first two customers, or use appropriate IDs.
-- Let's assume ID_KhachHang 1 is for ID_TaiKhoan 2, and ID_KhachHang 2 is for ID_TaiKhoan 3.
INSERT INTO KhachHang (HoTen, SoDienThoai, Email, ID_TaiKhoan)
VALUES
(N'Trịnh Văn Hoàng', '0905123456', 'trinhhoang@gmail.com', 2), -- Linked to ID_TaiKhoan = 2
(N'Nguyễn Thị Mai', '0905654321', 'trinhhoang2525@gmail.com', 3); -- Linked to ID_TaiKhoan = 3
-- We will refer to these KhachHang by their auto-generated IDs.
-- For the sake of this script, let's assume ID_KhachHang = 1 for Trịnh Văn Hoàng and ID_KhachHang = 2 for Nguyễn Thị Mai.

-- Insert sample SanhTiec records (Wedding Halls)
-- These depend on LoaiSanh already inserted (IDs 1-5 for A-E)
INSERT INTO SanhTiec (TenSanh, SucChua, GiaThue, ID_LoaiSanh) VALUES
(N'Sảnh Kim Cương', 200, 20000000.00, 5), -- Assumed ID_SanhTiec = 1
(N'Sảnh Vàng', 150, 15000000.00, 4),   -- Assumed ID_SanhTiec = 2
(N'Sảnh Bạc', 100, 12000000.00, 3),    -- Assumed ID_SanhTiec = 3
(N'Sảnh Đồng', 80, 8000000.00, 2);     -- Assumed ID_SanhTiec = 4
-- For the script, we'll use ID_SanhTiec 1, 2, 3, 4 for these.

-- Insert sample DichVu records (Services)
INSERT INTO DichVu (TenDichVu, DonGia) VALUES
(N'Trang trí hoa tươi cao cấp', 5000000.00), -- Assumed ID_DichVu = 1
(N'Ban nhạc acoustic', 3000000.00),          -- Assumed ID_DichVu = 2
(N'MC chuyên nghiệp', 2500000.00),           -- Assumed ID_DichVu = 3
(N'Quay phim & Chụp hình tiệc cưới', 7000000.00),      -- Assumed ID_DichVu = 4
(N'Vũ đoàn khai mạc', 4000000.00);                    -- Assumed ID_DichVu = 5
-- For the script, we'll use ID_DichVu 1, 2, 3, 4, 5 for these.

-- Helper variables (conceptual, actual IDs would be auto-generated or fetched)
-- SET @KhachHang1_ID = 1; -- Trịnh Văn Hoàng
-- SET @KhachHang2_ID = 2; -- Nguyễn Thị Mai

-- SET @SanhKimCuong_ID = 1; SET @SanhKimCuong_Gia = 20000000.00;
-- SET @SanhVang_ID = 2;     SET @SanhVang_Gia = 15000000.00;
-- SET @SanhBac_ID = 3;      SET @SanhBac_Gia = 12000000.00;
-- SET @SanhDong_ID = 4;     SET @SanhDong_Gia = 8000000.00;

-- SET @DichVuTrangTri_ID = 1; SET @DichVuTrangTri_Gia = 5000000.00;
-- SET @DichVuBanNhac_ID = 2;  SET @DichVuBanNhac_Gia = 3000000.00;
-- SET @DichVuMC_ID = 3;       SET @DichVuMC_Gia = 2500000.00;
-- SET @DichVuQuayPhim_ID = 4; SET @DichVuQuayPhim_Gia = 7000000.00;
-- SET @DichVuVuDoan_ID = 5;   SET @DichVuVuDoan_Gia = 4000000.00;

-- CaTiec IDs are 1 (Trưa) and 2 (Tối)

-- Generate 15 TiecCuoi records, with associated Tiec_DichVu and HoaDon
-- We assume ID_TiecCuoi will auto-increment starting from 1 for these new records.
-- If TiecCuoi table is not empty, these IDs would be different.
-- The script will use explicit IDs from 1 to 15 for ID_TiecCuoi for simplicity.

-- TiecCuoi 1
SET @CurrentTiecCuoiID = 1;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 1; -- Sảnh Kim Cương
SET @GiaThueSanhCurrent = 20000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-07-10', 1, '2025-05-01 10:00:00', 18, 2);
SET @DV1_Gia = 5000000.00; SET @DV2_Gia = 3000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia), (@CurrentTiecCuoiID, 2, 1, @DV2_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV2_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-05-02', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-07-11', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 2
SET @CurrentTiecCuoiID = 2;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 2; -- Sảnh Vàng
SET @GiaThueSanhCurrent = 15000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-07-15', 2, '2025-05-10 14:00:00', 12, 1);
SET @DV3_Gia = 2500000.00; SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 3, 1, @DV3_Gia), (@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV3_Gia + @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-05-11', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-07-16', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 3
SET @CurrentTiecCuoiID = 3;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 3; -- Sảnh Bạc
SET @GiaThueSanhCurrent = 12000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-07-20', 1, '2025-05-15 09:00:00', 8, 1);
SET @DV1_Gia = 5000000.00; SET @DV5_Gia = 4000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia), (@CurrentTiecCuoiID, 5, 1, @DV5_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV5_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-05-16', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-07-21', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 4
SET @CurrentTiecCuoiID = 4;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 4; -- Sảnh Đồng
SET @GiaThueSanhCurrent = 8000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-07-25', 2, '2025-05-20 11:00:00', 6, 1);
SET @DV2_Gia = 3000000.00; SET @DV3_Gia = 2500000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 2, 1, @DV2_Gia), (@CurrentTiecCuoiID, 3, 1, @DV3_Gia);
SET @TongTienDichVuCurrent = @DV2_Gia + @DV3_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-05-21', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-07-26', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 5
SET @CurrentTiecCuoiID = 5;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 1; -- Sảnh Kim Cương
SET @GiaThueSanhCurrent = 20000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-01', 1, '2025-06-01 15:00:00', 15, 2);
SET @DV4_Gia = 7000000.00; SET @DV5_Gia = 4000000.00; SET @DV1_Gia = 5000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 4, 1, @DV4_Gia), (@CurrentTiecCuoiID, 5, 1, @DV5_Gia), (@CurrentTiecCuoiID, 1, 1, @DV1_Gia);
SET @TongTienDichVuCurrent = @DV4_Gia + @DV5_Gia + @DV1_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-02', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-02', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 6
SET @CurrentTiecCuoiID = 6;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 2; -- Sảnh Vàng
SET @GiaThueSanhCurrent = 15000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-05', 2, '2025-06-05 10:30:00', 14, 1);
SET @DV1_Gia = 5000000.00; SET @DV2_Gia = 3000000.00; SET @DV3_Gia = 2500000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia),(@CurrentTiecCuoiID, 2, 1, @DV2_Gia),(@CurrentTiecCuoiID, 3, 1, @DV3_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV2_Gia + @DV3_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-06', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-06', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 7
SET @CurrentTiecCuoiID = 7;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 3; -- Sảnh Bạc
SET @GiaThueSanhCurrent = 12000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-10', 1, '2025-06-10 11:00:00', 9, 1);
SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-11', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-11', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 8
SET @CurrentTiecCuoiID = 8;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 4; -- Sảnh Đồng
SET @GiaThueSanhCurrent = 8000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-15', 2, '2025-06-15 16:00:00', 7, 1);
SET @DV5_Gia = 4000000.00; SET @DV2_Gia = 3000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 5, 1, @DV5_Gia), (@CurrentTiecCuoiID, 2, 1, @DV2_Gia);
SET @TongTienDichVuCurrent = @DV5_Gia + @DV2_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-16', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-16', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 9
SET @CurrentTiecCuoiID = 9;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 1; -- Sảnh Kim Cương
SET @GiaThueSanhCurrent = 20000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-20', 1, '2025-06-20 09:30:00', 19, 2);
SET @DV1_Gia = 5000000.00; SET @DV3_Gia = 2500000.00; SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia), (@CurrentTiecCuoiID, 3, 1, @DV3_Gia), (@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV3_Gia + @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-21', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-21', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 10
SET @CurrentTiecCuoiID = 10;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 2; -- Sảnh Vàng
SET @GiaThueSanhCurrent = 15000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-08-25', 2, '2025-06-25 14:30:00', 13, 1);
SET @DV2_Gia = 3000000.00; SET @DV5_Gia = 4000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 2, 1, @DV2_Gia), (@CurrentTiecCuoiID, 5, 1, @DV5_Gia);
SET @TongTienDichVuCurrent = @DV2_Gia + @DV5_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-06-26', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-08-26', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 11
SET @CurrentTiecCuoiID = 11;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 3; -- Sảnh Bạc
SET @GiaThueSanhCurrent = 12000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-09-01', 1, '2025-07-01 10:00:00', 10, 1);
SET @DV1_Gia = 5000000.00; SET @DV2_Gia = 3000000.00; SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia),(@CurrentTiecCuoiID, 2, 1, @DV2_Gia),(@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV2_Gia + @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-07-02', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-09-02', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 12
SET @CurrentTiecCuoiID = 12;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 4; -- Sảnh Đồng
SET @GiaThueSanhCurrent = 8000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-09-05', 2, '2025-07-05 14:00:00', 7, 1);
SET @DV3_Gia = 2500000.00; SET @DV5_Gia = 4000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 3, 1, @DV3_Gia), (@CurrentTiecCuoiID, 5, 1, @DV5_Gia);
SET @TongTienDichVuCurrent = @DV3_Gia + @DV5_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-07-06', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-09-06', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 13
SET @CurrentTiecCuoiID = 13;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 1; -- Sảnh Kim Cương
SET @GiaThueSanhCurrent = 20000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-09-10', 1, '2025-07-10 09:00:00', 20, 2);
SET @DV1_Gia = 5000000.00; SET @DV2_Gia = 3000000.00; SET @DV3_Gia = 2500000.00; SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia), (@CurrentTiecCuoiID, 2, 1, @DV2_Gia), (@CurrentTiecCuoiID, 3, 1, @DV3_Gia), (@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV2_Gia + @DV3_Gia + @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-07-11', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-09-11', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 14
SET @CurrentTiecCuoiID = 14;
SET @KhachHangIDCurrent = 2; -- Nguyễn Thị Mai
SET @SanhTiecIDCurrent = 2; -- Sảnh Vàng
SET @GiaThueSanhCurrent = 15000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-09-15', 2, '2025-07-15 11:00:00', 11, 1);
SET @DV1_Gia = 5000000.00; SET @DV5_Gia = 4000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 1, 1, @DV1_Gia), (@CurrentTiecCuoiID, 5, 1, @DV5_Gia);
SET @TongTienDichVuCurrent = @DV1_Gia + @DV5_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-07-16', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-09-16', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));

-- TiecCuoi 15
SET @CurrentTiecCuoiID = 15;
SET @KhachHangIDCurrent = 1; -- Trịnh Văn Hoàng
SET @SanhTiecIDCurrent = 4; -- Sảnh Đồng
SET @GiaThueSanhCurrent = 8000000.00;
INSERT INTO TiecCuoi (ID_TiecCuoi, ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, ThoiDiemDat, SoLuongBan, SoBanDuTru)
VALUES (@CurrentTiecCuoiID, @KhachHangIDCurrent, @SanhTiecIDCurrent, '2025-09-20', 1, '2025-07-20 15:30:00', 8, 1);
SET @DV2_Gia = 3000000.00; SET @DV3_Gia = 2500000.00; SET @DV4_Gia = 7000000.00;
INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) VALUES
(@CurrentTiecCuoiID, 2, 1, @DV2_Gia),(@CurrentTiecCuoiID, 3, 1, @DV3_Gia),(@CurrentTiecCuoiID, 4, 1, @DV4_Gia);
SET @TongTienDichVuCurrent = @DV2_Gia + @DV3_Gia + @DV4_Gia;
SET @TienDatCocCurrent = @GiaThueSanhCurrent * 0.30;
SET @TongChiPhiTiecCurrent = @GiaThueSanhCurrent + @TongTienDichVuCurrent;
INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon, GhiChu) VALUES
(@CurrentTiecCuoiID, '2025-07-21', @TienDatCocCurrent, @TienDatCocCurrent, N'Thanh toán đặt cọc', N'Đặt cọc cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR)),
(@CurrentTiecCuoiID, '2025-09-21', @TongChiPhiTiecCurrent - @TienDatCocCurrent, @TongChiPhiTiecCurrent - @TienDatCocCurrent, N'Thanh toán còn lại', N'Thanh toán còn lại cho tiệc cưới ID ' + CAST(@CurrentTiecCuoiID AS CHAR));