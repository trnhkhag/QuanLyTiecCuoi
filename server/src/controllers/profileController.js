const { execute } = require('../config/db');
const bcrypt = require('bcryptjs');

// Get user profile information
exports.getProfile = async (req, res) => {
  try {
    const accountId = req.user.accountId; // Lấy từ middleware authentication
    
    // First, get account information with role
    const accountQuery = `
      SELECT 
        tk.ID_TaiKhoan,
        tk.Username,
        vt.TenVaiTro,
        vt.ID_VaiTro
      FROM TaiKhoan tk
      JOIN TaiKhoan_VaiTro tv ON tk.ID_TaiKhoan = tv.ID_TaiKhoan
      JOIN VaiTro vt ON tv.ID_VaiTro = vt.ID_VaiTro
      WHERE tk.ID_TaiKhoan = ?
    `;
    
    const accountResult = await execute(accountQuery, [accountId]);
    
    if (!accountResult || accountResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tài khoản'
      });
    }
    
    const account = accountResult[0];
    let profileData = {
      accountId: account.ID_TaiKhoan,
      username: account.Username,
      role: account.TenVaiTro,
      roleId: account.ID_VaiTro
    };
    
    // Check if user is a customer
    const customerQuery = `
      SELECT ID_KhachHang, HoTen, SoDienThoai, Email
      FROM KhachHang 
      WHERE ID_TaiKhoan = ?
    `;
    
    const customerResult = await execute(customerQuery, [accountId]);
    
    if (customerResult && customerResult.length > 0) {
      const customer = customerResult[0];
      profileData = {
        ...profileData,
        userType: 'customer',
        customerId: customer.ID_KhachHang,
        fullName: customer.HoTen,
        phoneNumber: customer.SoDienThoai,
        email: customer.Email
      };
      
      // Get customer's wedding history
      const weddingHistoryQuery = `
        SELECT 
          tc.ID_TiecCuoi,
          tc.NgayToChuc,
          tc.ThoiDiemDat,
          tc.SoLuongBan,
          tc.SoBanDuTru,
          tc.TrangThai,
          st.TenSanh,
          ct.TenCa,
          ls.TenLoai as LoaiSanh,
          COALESCE(SUM(hd.TienThanhToan), 0) as TongDaThanhToan
        FROM TiecCuoi tc
        JOIN SanhTiec st ON tc.ID_SanhTiec = st.ID_SanhTiec
        JOIN CaTiec ct ON tc.ID_Ca = ct.ID_Ca
        JOIN LoaiSanh ls ON st.ID_LoaiSanh = ls.ID_LoaiSanh
        LEFT JOIN HoaDon hd ON tc.ID_TiecCuoi = hd.ID_TiecCuoi
        WHERE tc.ID_KhachHang = ?
        GROUP BY tc.ID_TiecCuoi
        ORDER BY tc.NgayToChuc DESC
      `;
      
      const weddingHistory = await execute(weddingHistoryQuery, [customer.ID_KhachHang]);
      profileData.weddingHistory = weddingHistory;
      
    } else {
      // Check if user is an employee
      const employeeQuery = `
        SELECT ID_NhanVien, HoTen, ChucVu
        FROM NhanVien 
        WHERE ID_TaiKhoan = ?
      `;
      
      const employeeResult = await execute(employeeQuery, [accountId]);
      
      if (employeeResult && employeeResult.length > 0) {
        const employee = employeeResult[0];
        profileData = {
          ...profileData,
          userType: 'employee',
          employeeId: employee.ID_NhanVien,
          fullName: employee.HoTen,
          position: employee.ChucVu
        };
      } else {
        profileData.userType = 'unknown';
      }
    }
    
    res.status(200).json({
      success: true,
      data: profileData
    });
    
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin profile',
      error: error.message
    });
  }
};

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const accountId = req.user.accountId;
    const { fullName, phoneNumber, email } = req.body;
    
    // Validate required fields
    if (!fullName || !phoneNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: họ tên, số điện thoại, email'
      });
    }
    
    // Check if customer exists
    const checkCustomerQuery = `
      SELECT ID_KhachHang FROM KhachHang WHERE ID_TaiKhoan = ?
    `;
    
    const existingCustomer = await execute(checkCustomerQuery, [accountId]);
    
    if (!existingCustomer || existingCustomer.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin khách hàng'
      });
    }
    
    // Check for duplicate phone/email (excluding current user)
    const duplicateCheckQuery = `
      SELECT ID_KhachHang FROM KhachHang 
      WHERE (SoDienThoai = ? OR Email = ?) AND ID_TaiKhoan != ?
    `;
    
    const duplicateResult = await execute(duplicateCheckQuery, [phoneNumber, email, accountId]);
    
    if (duplicateResult && duplicateResult.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc email đã được sử dụng bởi tài khoản khác'
      });
    }
    
    // Update customer information
    const updateQuery = `
      UPDATE KhachHang 
      SET HoTen = ?, SoDienThoai = ?, Email = ?
      WHERE ID_TaiKhoan = ?
    `;
    
    await execute(updateQuery, [fullName, phoneNumber, email, accountId]);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin profile thành công',
      data: {
        fullName,
        phoneNumber,
        email
      }
    });
    
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin profile',
      error: error.message
    });
  }
};

// Update employee profile
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const accountId = req.user.accountId;
    const { fullName, position } = req.body;
    
    // Validate required fields
    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền họ tên'
      });
    }
    
    // Check if employee exists
    const checkEmployeeQuery = `
      SELECT ID_NhanVien FROM NhanVien WHERE ID_TaiKhoan = ?
    `;
    
    const existingEmployee = await execute(checkEmployeeQuery, [accountId]);
    
    if (!existingEmployee || existingEmployee.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin nhân viên'
      });
    }
    
    // Update employee information
    const updateQuery = `
      UPDATE NhanVien 
      SET HoTen = ?, ChucVu = ?
      WHERE ID_TaiKhoan = ?
    `;
    
    await execute(updateQuery, [fullName, position || null, accountId]);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin profile thành công',
      data: {
        fullName,
        position
      }
    });
    
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const accountId = req.user.accountId;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin mật khẩu'
      });
    }
    
    // Check if new password matches confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
      });
    }
    
    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }
    
    // Get current password hash
    const passwordQuery = `
      SELECT PasswordHash FROM TaiKhoan WHERE ID_TaiKhoan = ?
    `;
    
    const accountResult = await execute(passwordQuery, [accountId]);
    
    if (!accountResult || accountResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, accountResult[0].PasswordHash);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }
    
    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    const updatePasswordQuery = `
      UPDATE TaiKhoan SET PasswordHash = ? WHERE ID_TaiKhoan = ?
    `;
    
    await execute(updatePasswordQuery, [newPasswordHash, accountId]);
    
    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
    
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu',
      error: error.message
    });
  }
};

// Get user permissions
exports.getUserPermissions = async (req, res) => {
  try {
    const accountId = req.user.accountId;
    
    const permissionsQuery = `
      SELECT DISTINCT q.Ten_Quyen, q.MoTa, q.GiaTri
      FROM TaiKhoan tk
      JOIN TaiKhoan_VaiTro tv ON tk.ID_TaiKhoan = tv.ID_TaiKhoan
      JOIN VaiTro_Quyen vq ON tv.ID_VaiTro = vq.ID_VaiTro
      JOIN Quyen q ON vq.ID_Quyen = q.ID_Quyen
      WHERE tk.ID_TaiKhoan = ?
    `;
    
    const permissions = await execute(permissionsQuery, [accountId]);
    
    res.status(200).json({
      success: true,
      data: {
        permissions: permissions || []
      }
    });
    
  } catch (error) {
    console.error('Error getting user permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin quyền hạn',
      error: error.message
    });
  }
}; 