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
    TenCa VARCHAR(20) UNIQUE NOT NULL
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
    TrangThai VARCHAR(50) DEfAULT 'Đã đặt',
    FOREIGN KEY (ID_KhachHang) REFERENCES KhachHang(ID_KhachHang),
    FOREIGN KEY (ID_SanhTiec) REFERENCES SanhTiec(ID_SanhTiec),
    FOREIGN KEY (ID_Ca) REFERENCES CaTiec(ID_Ca)
);

CREATE TABLE HoaDon (
    ID_HoaDon INT PRIMARY KEY AUTO_INCREMENT,
    ID_TiecCuoi INT NOT NULL,
    NgayLap DATE NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    TienThanhToan DECIMAL(18,2) NOT NULL,
    LoaiHoaDon VARCHAR(50) NOT NULL,
    GhiChu VARCHAR(255),
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

-- Bảng Quy Định
CREATE TABLE QuyDinh (
    ID_QuyDinh VARCHAR(10) PRIMARY KEY,
    TenQuyDinh VARCHAR(100) NOT NULL,
    MoTa TEXT,
    GhiChu TEXT
);

-- Bảng chi tiết quy định về sảnh (QD1)
CREATE TABLE QD_Sanh (
    ID_QuyDinh VARCHAR(10),
    LoaiSanh CHAR(1),
    GiaBanToiThieu DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (ID_QuyDinh, LoaiSanh),
    FOREIGN KEY (ID_QuyDinh) REFERENCES QuyDinh(ID_QuyDinh)
);

-- Bảng chi tiết quy định về ca và dịch vụ (QD2)
CREATE TABLE QD_CaDichVu (
    ID_QuyDinh VARCHAR(10),
    SoLuongDichVuToiDa INT NOT NULL,
    SoLuongMonAnToiDa INT NOT NULL,
    PRIMARY KEY (ID_QuyDinh),
    FOREIGN KEY (ID_QuyDinh) REFERENCES QuyDinh(ID_QuyDinh)
);

-- Bảng chi tiết quy định về phạt (QD4)
CREATE TABLE QD_PhatTre (
    ID_QuyDinh VARCHAR(10),
    TyLePhat DECIMAL(5,2) NOT NULL,
    ApDung BOOLEAN DEFAULT true,
    PRIMARY KEY (ID_QuyDinh),
    FOREIGN KEY (ID_QuyDinh) REFERENCES QuyDinh(ID_QuyDinh)
);

-- Dữ liệu mẫu cho bảng QuyDinh
INSERT INTO QuyDinh (ID_QuyDinh, TenQuyDinh, MoTa) VALUES
('QD1', 'Qui định 1', 'Có 5 loại Sảnh (A, B, C, D, E) với đơn giá bàn tối thiểu tương ứng là (1.000.000, 1.100.000, 1.200.000, 1.400.000, 1.600.000)'),
('QD2', 'Qui định 2', 'Chỉ nhận đặt tiệc khi sảnh chưa có người đặt (tương ứng với ngày và ca). Có hai ca (Trưa, Tối). Ngoài ra có 20 dịch vụ, 100 món ăn.'),
('QD4', 'Qui định 4', 'Đơn giá thanh toán các dich vụ được tính theo đơn giá trong phiếu đặt tiệc cưới. Ngày thanh toán trùng với ngày đãi tiệc, thanh toán trễ phạt 1% ngày.');

-- Dữ liệu mẫu cho QD1
INSERT INTO QD_Sanh (ID_QuyDinh, LoaiSanh, GiaBanToiThieu) VALUES
('QD1', 'A', 1000000),
('QD1', 'B', 1100000),
('QD1', 'C', 1200000),
('QD1', 'D', 1400000),
('QD1', 'E', 1600000);

-- Dữ liệu mẫu cho QD2
INSERT INTO QD_CaDichVu (ID_QuyDinh, SoLuongDichVuToiDa, SoLuongMonAnToiDa) VALUES
('QD2', 20, 100);

-- Dữ liệu mẫu cho QD4
INSERT INTO QD_PhatTre (ID_QuyDinh, TyLePhat, ApDung) VALUES
('QD4', 1.00, true);

INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, 'Trưa'), (2, 'Tối');

INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu)
VALUES ('A', 1000000), ('B', 1100000), ('C', 1200000), ('D', 1400000), ('E', 1600000);
