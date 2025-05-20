const sql = require('mssql');

// Connection configuration
const config = {
  server: 'localhost',
  port: 1433,
  database: 'TiecCuoiDB',
  user: 'sa',
  password: '123',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// SQL Server script - converted from MySQL
const createTablesScript = `
-- Drop existing tables if they exist (in reverse order of creation to handle dependencies)
IF OBJECT_ID('Tiec_DichVu', 'U') IS NOT NULL DROP TABLE Tiec_DichVu;
IF OBJECT_ID('DichVu', 'U') IS NOT NULL DROP TABLE DichVu;
IF OBJECT_ID('HoaDon', 'U') IS NOT NULL DROP TABLE HoaDon;
IF OBJECT_ID('TiecCuoi', 'U') IS NOT NULL DROP TABLE TiecCuoi;
IF OBJECT_ID('SanhTiec', 'U') IS NOT NULL DROP TABLE SanhTiec;
IF OBJECT_ID('CaTiec', 'U') IS NOT NULL DROP TABLE CaTiec;
IF OBJECT_ID('LoaiSanh', 'U') IS NOT NULL DROP TABLE LoaiSanh;
IF OBJECT_ID('NhanVien', 'U') IS NOT NULL DROP TABLE NhanVien;
IF OBJECT_ID('KhachHang', 'U') IS NOT NULL DROP TABLE KhachHang;
IF OBJECT_ID('TaiKhoan_VaiTro', 'U') IS NOT NULL DROP TABLE TaiKhoan_VaiTro;
IF OBJECT_ID('VaiTro_Quyen', 'U') IS NOT NULL DROP TABLE VaiTro_Quyen;
IF OBJECT_ID('Quyen', 'U') IS NOT NULL DROP TABLE Quyen;
IF OBJECT_ID('VaiTro', 'U') IS NOT NULL DROP TABLE VaiTro;
IF OBJECT_ID('TaiKhoan', 'U') IS NOT NULL DROP TABLE TaiKhoan;

-- Create tables (converted from MySQL to SQL Server syntax)
CREATE TABLE TaiKhoan (
    ID_TaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL
);

CREATE TABLE VaiTro (
    ID_VaiTro INT IDENTITY(1,1) PRIMARY KEY,
    TenVaiTro NVARCHAR(100) UNIQUE NOT NULL,
    MoTa NVARCHAR(255) NULL
);

CREATE TABLE Quyen (
    ID_Quyen INT IDENTITY(1,1) PRIMARY KEY,
    Ten_Quyen NVARCHAR(100) UNIQUE NOT NULL,
    MoTa NVARCHAR(255) NULL,
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
    ID_KhachHang INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);

CREATE TABLE NhanVien (
    ID_NhanVien INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    ChucVu NVARCHAR(50) NULL,
    ID_TaiKhoan INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_TaiKhoan) REFERENCES TaiKhoan(ID_TaiKhoan)
);

CREATE TABLE LoaiSanh (
    ID_LoaiSanh INT IDENTITY(1,1) PRIMARY KEY,
    TenLoai NCHAR(1) UNIQUE NOT NULL,
    GiaBanToiThieu DECIMAL(18,2) NOT NULL
);

CREATE TABLE CaTiec (
    ID_Ca INT PRIMARY KEY,
    TenCa NVARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE SanhTiec (
    ID_SanhTiec INT IDENTITY(1,1) PRIMARY KEY,
    TenSanh NVARCHAR(100) NOT NULL,
    SucChua INT NOT NULL,
    GiaThue DECIMAL(18,2) NOT NULL,
    ID_LoaiSanh INT NOT NULL,
    FOREIGN KEY (ID_LoaiSanh) REFERENCES LoaiSanh(ID_LoaiSanh)
);

CREATE TABLE TiecCuoi (
    ID_TiecCuoi INT IDENTITY(1,1) PRIMARY KEY,
    ID_KhachHang INT NOT NULL,
    ID_SanhTiec INT NOT NULL,
    NgayToChuc DATE NOT NULL,
    ID_Ca INT NOT NULL, 
    ThoiDiemDat DATETIME NOT NULL,
    SoLuongBan INT NOT NULL,
    SoBanDuTru INT NULL,
    FOREIGN KEY (ID_KhachHang) REFERENCES KhachHang(ID_KhachHang),
    FOREIGN KEY (ID_SanhTiec) REFERENCES SanhTiec(ID_SanhTiec),
    FOREIGN KEY (ID_Ca) REFERENCES CaTiec(ID_Ca)
);

CREATE TABLE HoaDon ( 
    ID_HoaDon INT IDENTITY(1,1) PRIMARY KEY, 
    ID_TiecCuoi INT NOT NULL,
    NgayLap DATE NOT NULL, 
    TongTien DECIMAL(18,2) NOT NULL,
    TienThanhToan DECIMAL(18,2) NOT NULL, 
    LoaiHoaDon NVARCHAR(50) NOT NULL, 
    GhiChu NVARCHAR(255) NULL,  
    FOREIGN KEY (ID_TiecCuoi) REFERENCES TiecCuoi(ID_TiecCuoi)
);

CREATE TABLE DichVu (
    ID_DichVu INT IDENTITY(1,1) PRIMARY KEY,
    TenDichVu NVARCHAR(100) NOT NULL,
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
VALUES (N'A', 1000000), (N'B', 1100000), (N'C', 1200000), (N'D', 1400000), (N'E', 1600000);

-- Insert roles
INSERT INTO VaiTro (TenVaiTro, MoTa) 
VALUES (N'administrator', N'Quản trị viên hệ thống'), 
       (N'user', N'Người dùng thông thường');

-- Insert permissions
INSERT INTO Quyen (Ten_Quyen, MoTa, GiaTri)
VALUES 
(N'view_customers', N'Xem thông tin khách hàng', 1),
(N'edit_customers', N'Chỉnh sửa thông tin khách hàng', 2),
(N'view_weddings', N'Xem tiệc cưới', 4),
(N'create_weddings', N'Tạo tiệc cưới', 8),
(N'manage_invoices', N'Quản lý hóa đơn', 16),
(N'manage_system', N'Quản lý hệ thống', 32);

-- Assign permissions to roles
INSERT INTO VaiTro_Quyen (ID_VaiTro, ID_Quyen)
VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), -- Admin gets all permissions
(2, 1), (2, 3), (2, 4); -- Regular user gets view and create permissions

-- Create admin account
DECLARE @AdminPwdHash NVARCHAR(255) = N'$2a$10$gYfELbVDT3m3AbP3R2RQSODTjCFhzBn9i7n3jnGHJm.tFcXfPAU8u'; -- 'admin123' hashed
INSERT INTO TaiKhoan (Username, PasswordHash)
VALUES (N'admin@example.com', @AdminPwdHash);

-- Assign admin role
INSERT INTO TaiKhoan_VaiTro (ID_TaiKhoan, ID_VaiTro)
VALUES (1, 1);  -- Admin account gets admin role

-- Create admin as staff
INSERT INTO NhanVien (HoTen, ChucVu, ID_TaiKhoan)
VALUES (N'Administrator', N'Quản trị viên', 1);
`;

async function createDatabaseSchema() {
  try {
    console.log('Connecting to SQL Server...');
    await sql.connect(config);
    console.log('Connection successful ✅');
    
    console.log('Creating database schema...');
    await sql.query(createTablesScript);
    console.log('Database schema created successfully ✅');
    
    // Close the connection
    await sql.close();
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error creating database schema:', err);
    try {
      await sql.close();
    } catch {}
  }
}

createDatabaseSchema(); 