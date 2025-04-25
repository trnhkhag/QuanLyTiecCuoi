
CREATE TABLE TaiKhoan (
    ID_TaiKhoan INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) UNIQUE,
    PasswordHash NVARCHAR(255)
);

CREATE TABLE VaiTro (
    ID_VaiTro INT PRIMARY KEY IDENTITY(1,1),
    TenVaiTro NVARCHAR(100) UNIQUE,
    MoTa NVARCHAR(255)
);

CREATE TABLE Quyen (
    ID_Quyen INT PRIMARY KEY IDENTITY(1,1),
    Ten_Quyen NVARCHAR(100) UNIQUE,
    MoTa NVARCHAR(255),
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
    ID_KhachHang INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100),
    SoDienThoai VARCHAR(15),
    Email VARCHAR(100),
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);

CREATE TABLE NhanVien (
    ID_NhanVien INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100),
    ChucVu NVARCHAR(50),
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);


CREATE TABLE LoaiSanh (
    ID_LoaiSanh INT PRIMARY KEY IDENTITY(1,1),
    TenLoai CHAR(1) UNIQUE,
    GiaBanToiThieu DECIMAL(18,2)
);

CREATE TABLE CaTiec (
    ID_Ca INT PRIMARY KEY,
    TenCa NVARCHAR(20) UNIQUE
);


CREATE TABLE SanhTiec (
    ID_SanhTiec INT PRIMARY KEY IDENTITY(1,1),
    TenSanh NVARCHAR(100),
    SucChua INT,
    GiaThue DECIMAL(18,2),
    ID_LoaiSanh INT,
    FOREIGN KEY (ID_LoaiSanh) REFERENCES LoaiSanh(ID_LoaiSanh)
);


CREATE TABLE TiecCuoi (
    ID_TiecCuoi INT PRIMARY KEY IDENTITY(1,1),
    ID_KhachHang INT FOREIGN KEY REFERENCES KhachHang(ID_KhachHang),
    ID_SanhTiec INT FOREIGN KEY REFERENCES SanhTiec(ID_SanhTiec),
    NgayToChuc DATE,
    ID_Ca INT NOT NULL,
    ThoiDiemDat DATETIME,
    SoLuongBan INT,
    SoBanDuTru INT,
    FOREIGN KEY (ID_Ca) REFERENCES CaTiec(ID_Ca)
);


CREATE TABLE HoaDon (
    ID_HoaDon INT PRIMARY KEY IDENTITY(1,1),
    ID_TiecCuoi INT FOREIGN KEY REFERENCES TiecCuoi(ID_TiecCuoi),
    NgayLap DATE,
    TongTien DECIMAL(18,2),
    TienDatCoc DECIMAL(18,2),
    ConLai AS (TongTien - TienDatCoc)
);


CREATE TABLE MonAn (
    ID_MonAn INT PRIMARY KEY IDENTITY(1,1),
    TenMonAn NVARCHAR(100),
    DonGia DECIMAL(18,2)
);

CREATE TABLE DichVu (
    ID_DichVu INT PRIMARY KEY IDENTITY(1,1),
    TenDichVu NVARCHAR(100),
    DonGia DECIMAL(18,2)
);


CREATE TABLE Tiec_MonAn (
    ID_TiecCuoi INT,
    ID_MonAn INT,
    DonGia DECIMAL(18,2),
    PRIMARY KEY (ID_TiecCuoi, ID_MonAn),
    FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi),
    FOREIGN KEY (ID_MonAn) REFERENCES MonAn(ID_MonAn)
);

CREATE TABLE Tiec_DichVu (
    ID_TiecCuoi INT,
    ID_DichVu INT,
    SoLuong INT,
    DonGia DECIMAL(18,2),
    PRIMARY KEY (ID_TiecCuoi, ID_DichVu),
    FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi),
    FOREIGN KEY (ID_DichVu) REFERENCES DichVu(ID_DichVu)
);

--Template 2 ca
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, 'Trưa'), (2, 'Tối');

--Template 5 cái sảnh có giá bàn 
INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu)
VALUES ('A', 1000000), ('B', 1100000), ('C', 1200000), ('D', 1400000), ('E', 1600000);

