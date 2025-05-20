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
    TenCa VARCHAR(20) UNIQUE NOT NULL //Chi có 2 ca là trưa và tối
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

CREATE TABLE HoaDon ( // Sau khi có hóa đơn là thanh toán đặt cọc thì sẽ tạo hóa đơn thanh toán còn lại song song (Hóa đơn ảo, Không thể xóa,chỉ xóa khi đã xóa hóa đơn Thanh toán đặt cọc, chỉ tồn tại trên UI) sau đó nếu xác nhận thanh toán thì sẽ lưu hóa đơn vào database và hiển thị trạng thái đã thanh toán
    //Hóa đơn được xác nhận thì sẽ insert phần lớn dữ liệu hiện tại của hóa đơn ảo
    ID_HoaDon INT PRIMARY KEY AUTO_INCREMENT, //Nếu là hóa đơn ảo thì để là "Chưa cấp"
    ID_TiecCuoi INT NOT NULL,
    NgayLap DATE NOT NULL, 
    //Nếu là hóa đơn ảo thì NgayLap = NgayLap của hóa đơn thanh toán đặt cọc tương ứng
    // Nếu là hóa đơn thanh toán còn lại đã xác nhận thì NgayLap = Date.Now
    TongTien DECIMAL(18,2) NOT NULL, 
    //Với hóa đơn ảo tổng tiền = Tổng tiền của hóa đơn thanh toán đặt cọc tương ứng + tiền phạt
    // Tiền phạt sẽ tính bằng cách lấy Ngày trễ hạn = ( Date.Now - (Table)TiecCuoi.ThoiDiemDat)) > 0 tương ứng cho phạt 1%/ngày. Nếu Ngày trễ hạn < 0 thì không phạt
    TienThanhToan DECIMAL(18,2) NOT NULL, // Với hóa đơn ảo có tiền thanh toán = Tổng tiền hóa đơn ảo - Tiền thanh toán của hóa đơn đặt cọc tương ứng
    LoaiHoaDon VARCHAR(50) NOT NULL, //chỉ có 2 loại hóa đơn là thanh toán còn lại và thanh toán đặt cọc
    GhiChu VARCHAR(255),  //ghi chú về hóa đơn
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

-- Dữ liệu mẫu
INSERT INTO CaTiec (ID_Ca, TenCa) VALUES (1, 'Trưa'), (2, 'Tối');

INSERT INTO LoaiSanh (TenLoai, GiaBanToiThieu)
VALUES ('A', 1000000), ('B', 1100000), ('C', 1200000), ('D', 1400000), ('E', 1600000);
