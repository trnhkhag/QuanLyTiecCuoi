-- Create the database with appropriate collation for Unicode support
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TiecCuoiDB')
BEGIN
    CREATE DATABASE TiecCuoiDB COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE TiecCuoiDB;
GO

-- Create TaiKhoan table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaiKhoan')
BEGIN
    CREATE TABLE TaiKhoan (
        ID_TaiKhoan INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(100) NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        CONSTRAINT UQ_TaiKhoan_Username UNIQUE (Username)
    );
END
GO

-- Create VaiTro table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VaiTro')
BEGIN
    CREATE TABLE VaiTro (
        ID_VaiTro INT PRIMARY KEY IDENTITY(1,1),
        TenVaiTro NVARCHAR(100) NOT NULL,
        MoTa NVARCHAR(255) NULL,
        CONSTRAINT UQ_VaiTro_TenVaiTro UNIQUE (TenVaiTro)
    );
END
GO

-- Create Quyen table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Quyen')
BEGIN
    CREATE TABLE Quyen (
        ID_Quyen INT PRIMARY KEY IDENTITY(1,1),
        Ten_Quyen NVARCHAR(100) NOT NULL,
        MoTa NVARCHAR(255) NULL,
        GiaTri INT NOT NULL,
        CONSTRAINT UQ_Quyen_Ten_Quyen UNIQUE (Ten_Quyen)
    );
END
GO

-- Create VaiTro_Quyen junction table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VaiTro_Quyen')
BEGIN
    CREATE TABLE VaiTro_Quyen (
        ID_VaiTro INT NOT NULL,
        ID_Quyen INT NOT NULL,
        CONSTRAINT PK_VaiTro_Quyen PRIMARY KEY (ID_VaiTro, ID_Quyen),
        CONSTRAINT FK_VaiTro_Quyen_VaiTro FOREIGN KEY (ID_VaiTro) REFERENCES VaiTro(ID_VaiTro),
        CONSTRAINT FK_VaiTro_Quyen_Quyen FOREIGN KEY (ID_Quyen) REFERENCES Quyen(ID_Quyen)
    );
END
GO

-- Create TaiKhoan_VaiTro junction table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TaiKhoan_VaiTro')
BEGIN
    CREATE TABLE TaiKhoan_VaiTro (
        ID_TaiKhoan INT NOT NULL,
        ID_VaiTro INT NOT NULL,
        CONSTRAINT PK_TaiKhoan_VaiTro PRIMARY KEY (ID_TaiKhoan, ID_VaiTro),
        CONSTRAINT FK_TaiKhoan_VaiTro_TaiKhoan FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan),
        CONSTRAINT FK_TaiKhoan_VaiTro_VaiTro FOREIGN KEY (ID_VaiTro) REFERENCES VaiTro(ID_VaiTro)
    );
END
GO

-- Create KhachHang table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'KhachHang')
BEGIN
    CREATE TABLE KhachHang (
        ID_KhachHang INT PRIMARY KEY IDENTITY(1,1),
        HoTen NVARCHAR(100) NOT NULL,
        SoDienThoai NVARCHAR(15) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        ID_TaiKhoan INT NOT NULL,
        CONSTRAINT UQ_KhachHang_SoDienThoai UNIQUE (SoDienThoai),
        CONSTRAINT UQ_KhachHang_Email UNIQUE (Email),
        CONSTRAINT UQ_KhachHang_ID_TaiKhoan UNIQUE (ID_TaiKhoan),
        CONSTRAINT FK_KhachHang_TaiKhoan FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
    );
END
GO

-- Create NhanVien table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'NhanVien')
BEGIN
    CREATE TABLE NhanVien (
        ID_NhanVien INT PRIMARY KEY IDENTITY(1,1),
        HoTen NVARCHAR(100) NOT NULL,
        ChucVu NVARCHAR(50) NULL,
        ID_TaiKhoan INT NOT NULL,
        CONSTRAINT UQ_NhanVien_ID_TaiKhoan UNIQUE (ID_TaiKhoan),
        CONSTRAINT FK_NhanVien_TaiKhoan FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
    );
END
GO

-- Create LoaiSanh table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoaiSanh')
BEGIN
    CREATE TABLE LoaiSanh (
        ID_LoaiSanh INT PRIMARY KEY IDENTITY(1,1),
        TenLoai NCHAR(1) NOT NULL,
        GiaBanToiThieu DECIMAL(18,2) NOT NULL,
        CONSTRAINT UQ_LoaiSanh_TenLoai UNIQUE (TenLoai)
    );
END
GO

-- Create CaTiec table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CaTiec')
BEGIN
    CREATE TABLE CaTiec (
        ID_Ca INT PRIMARY KEY, -- Only two shifts: Lunch and Dinner
        TenCa NVARCHAR(20) NOT NULL,
        CONSTRAINT UQ_CaTiec_TenCa UNIQUE (TenCa)
    );
END
GO

-- Create SanhTiec table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SanhTiec')
BEGIN
    CREATE TABLE SanhTiec (
        ID_SanhTiec INT PRIMARY KEY IDENTITY(1,1),
        TenSanh NVARCHAR(100) NOT NULL,
        SucChua INT NOT NULL,
        GiaThue DECIMAL(18,2) NOT NULL,
        ID_LoaiSanh INT NOT NULL,
        CONSTRAINT FK_SanhTiec_LoaiSanh FOREIGN KEY (ID_LoaiSanh) REFERENCES LoaiSanh(ID_LoaiSanh)
    );
END
GO

-- Create TiecCuoi table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TiecCuoi')
BEGIN
    CREATE TABLE TiecCuoi (
        ID_TiecCuoi INT PRIMARY KEY IDENTITY(1,1),
        ID_KhachHang INT NOT NULL,
        ID_SanhTiec INT NOT NULL,
        NgayToChuc DATE NOT NULL,
        ID_Ca INT NOT NULL,
        ThoiDiemDat DATETIME NOT NULL,
        SoLuongBan INT NOT NULL,
        SoBanDuTru INT NULL,
        CONSTRAINT FK_TiecCuoi_KhachHang FOREIGN KEY (ID_KhachHang) REFERENCES KhachHang(ID_KhachHang),
        CONSTRAINT FK_TiecCuoi_SanhTiec FOREIGN KEY (ID_SanhTiec) REFERENCES SanhTiec(ID_SanhTiec),
        CONSTRAINT FK_TiecCuoi_CaTiec FOREIGN KEY (ID_Ca) REFERENCES CaTiec(ID_Ca)
    );
END
GO

-- Create HoaDon table
-- Note: Comments from MySQL schema:
-- After creating a deposit invoice, a remaining payment invoice is created (virtual invoice)
-- Virtual invoice only exists in UI until payment confirmation
-- Virtual invoice can only be deleted when deposit invoice is deleted
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HoaDon')
BEGIN
    CREATE TABLE HoaDon (
        ID_HoaDon INT PRIMARY KEY IDENTITY(1,1), -- For virtual invoices, shown as "Chưa cấp" in UI
        ID_TiecCuoi INT NOT NULL,
        NgayLap DATE NOT NULL, -- For virtual invoice, equals date of corresponding deposit invoice
                             -- For confirmed remaining payment invoice, equals current date
        TongTien DECIMAL(18,2) NOT NULL, -- For virtual invoice, equals deposit invoice total + penalty
                                       -- Penalty calculated as 1% per day if (Current Date - Booking Date) > 0
        TienThanhToan DECIMAL(18,2) NOT NULL, -- For virtual invoice, equals virtual invoice total - deposit payment
        LoaiHoaDon NVARCHAR(50) NOT NULL, -- Only two types: deposit payment and remaining payment
        GhiChu NVARCHAR(255) NULL, -- Invoice notes
        CONSTRAINT FK_HoaDon_TiecCuoi FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi)
    );
END
GO

-- Create DichVu table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DichVu')
BEGIN
    CREATE TABLE DichVu (
        ID_DichVu INT PRIMARY KEY IDENTITY(1,1),
        TenDichVu NVARCHAR(100) NOT NULL,
        DonGia DECIMAL(18,2) NOT NULL
    );
END
GO

-- Create Tiec_DichVu junction table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tiec_DichVu')
BEGIN
    CREATE TABLE Tiec_DichVu (
        ID_TiecCuoi INT NOT NULL,
        ID_DichVu INT NOT NULL,
        SoLuong INT NOT NULL,
        DonGia DECIMAL(18,2) NOT NULL,
        CONSTRAINT PK_Tiec_DichVu PRIMARY KEY (ID_TiecCuoi, ID_DichVu),
        CONSTRAINT FK_Tiec_DichVu_TiecCuoi FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi),
        CONSTRAINT FK_Tiec_DichVu_DichVu FOREIGN KEY (ID_DichVu) REFERENCES DichVu(ID_DichVu)
    );
END
GO

-- Insert sample data
-- Insert CaTiec (Wedding Shifts)
IF NOT EXISTS (SELECT * FROM CaTiec WHERE ID_Ca = 1)
BEGIN
    INSERT INTO CaTiec (ID_Ca, TenCa) VALUES 
    (1, N'Trưa'), 
    (2, N'Tối');
END
GO

-- Insert LoaiSanh (Hall Types)
IF NOT EXISTS (SELECT * FROM LoaiSanh WHERE TenLoai = 'A')
BEGIN
    INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu) VALUES 
    ('A', 1000000), 
    ('B', 1100000), 
    ('C', 1200000), 
    ('D', 1400000), 
    ('E', 1600000);
END
GO 