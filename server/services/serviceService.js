const db = require('../config/db');

class ServiceService {
  // Lấy tất cả dịch vụ
  async getAllServices() {
    try {
      const [services] = await db.query(`
        SELECT ID_DichVu, TenDichVu, DonGia
        FROM DichVu
        ORDER BY ID_DichVu
      `);
      return services;
    } catch (error) {
      console.error('Error in getAllServices service:', error);
      throw error;
    }
  }

  // Lấy dịch vụ theo ID
  async getServiceById(serviceId) {
    try {
      const [services] = await db.query(`
        SELECT ID_DichVu, TenDichVu, DonGia
        FROM DichVu
        WHERE ID_DichVu = ?
      `, [serviceId]);
      
      // Nếu không tìm thấy dịch vụ
      if (services.length === 0) {
        return null;
      }

      return services[0];
    } catch (error) {
      console.error(`Error in getServiceById service for ID ${serviceId}:`, error);
      throw error;
    }
  }

  // Thêm dịch vụ mới
  async createService(serviceData) {
    try {
      const { TenDichVu, DonGia } = serviceData;
      
      const [result] = await db.query(`
        INSERT INTO DichVu (TenDichVu, DonGia)
        VALUES (?, ?)
      `, [TenDichVu, DonGia]);
      
      // Trả về ID của dịch vụ vừa tạo
      return {
        ID_DichVu: result.insertId,
        TenDichVu,
        DonGia
      };
    } catch (error) {
      console.error('Error in createService service:', error);
      throw error;
    }
  }

  // Cập nhật dịch vụ
  async updateService(serviceId, serviceData) {
    try {
      const { TenDichVu, DonGia } = serviceData;
      
      const [result] = await db.query(`
        UPDATE DichVu
        SET TenDichVu = ?, DonGia = ?
        WHERE ID_DichVu = ?
      `, [TenDichVu, DonGia, serviceId]);
      
      // Kiểm tra xem có bản ghi nào được cập nhật không
      if (result.affectedRows === 0) {
        return null;
      }
      
      return {
        ID_DichVu: serviceId,
        TenDichVu,
        DonGia
      };
    } catch (error) {
      console.error(`Error in updateService service for ID ${serviceId}:`, error);
      throw error;
    }
  }

  // Xóa dịch vụ
  async deleteService(serviceId) {
    try {
      // Kiểm tra xem dịch vụ đã được sử dụng trong bảng Tiec_DichVu chưa
      const [usedServices] = await db.query(`
        SELECT ID_TiecCuoi
        FROM Tiec_DichVu
        WHERE ID_DichVu = ?
        LIMIT 1
      `, [serviceId]);
      
      // Nếu dịch vụ đã được sử dụng, không cho phép xóa
      if (usedServices.length > 0) {
        throw new Error('Không thể xóa dịch vụ đã được sử dụng trong tiệc cưới');
      }
      
      const [result] = await db.query(`
        DELETE FROM DichVu
        WHERE ID_DichVu = ?
      `, [serviceId]);
      
      // Kiểm tra xem có bản ghi nào bị xóa không
      if (result.affectedRows === 0) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error in deleteService service for ID ${serviceId}:`, error);
      throw error;
    }
  }
}

module.exports = new ServiceService();