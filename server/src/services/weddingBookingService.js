const { pool } = require('../config/db');

class WeddingBookingService {
  /**
   * Check if hall is available for a specific date and shift
   */  async checkHallAvailability(hallId, date, shiftId) {
    try {
      console.log(`Checking availability for hall: ${hallId}, date: ${date}, shift: ${shiftId}`);
      
      // Format date to YYYY-MM-DD if it's in ISO format
      let formattedDate = date;
      if (date && date.includes('T')) {
        formattedDate = date.split('T')[0];
        console.log(`Formatted date for availability check: ${formattedDate}`);
      }
      
      // Query to check if the hall is already booked
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS bookingCount
         FROM TiecCuoi
         WHERE ID_SanhTiec = ? AND NgayToChuc = ? AND ID_Ca = ?`,
        [hallId, formattedDate, shiftId]
      );
      
      // If count is 0, hall is available
      const isAvailable = rows[0].bookingCount === 0;
      console.log(`Hall available: ${isAvailable}`);
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking hall availability:', error);
      throw error;
    }
  }
  
  /**
   * Tạo mới đặt tiệc
   */  async createBooking(bookingData) {
    const connection = await pool.getConnection();
    
    try {
      console.log('Starting transaction for booking creation with data:', {
        customerId: bookingData.customerId,
        hallId: bookingData.hallId,
        weddingDate: bookingData.weddingDate,
        shiftId: bookingData.shiftId
      });
      
      await connection.beginTransaction();
      
      // Kiểm tra sảnh có sẵn không
      const isAvailable = await this.checkHallAvailability(
        bookingData.hallId, 
        bookingData.weddingDate, 
        bookingData.shiftId
      );
      
      if (!isAvailable) {
        console.error('Hall not available:', {
          hallId: bookingData.hallId,
          date: bookingData.weddingDate,
          shift: bookingData.shiftId
        });
        throw new Error('Sảnh đã được đặt vào ngày và ca này');
      }
      
      console.log('Hall is available, proceeding with booking creation');
      
      console.log('Creating booking with data:', {
        customerId: bookingData.customerId,
        hallId: bookingData.hallId,
        weddingDate: bookingData.weddingDate,
        shiftId: bookingData.shiftId,
        numberOfGuests: bookingData.numberOfGuests,
        numberOfTables: bookingData.numberOfTables
      });      // 1. Tạo đặt tiệc cơ bản
      console.log('Inserting booking with params:', {
        customerId: bookingData.customerId,
        hallId: bookingData.hallId,
        weddingDate: bookingData.weddingDate,
        shiftId: bookingData.shiftId,
        tableCount: bookingData.tableCount || 0,
        reserveTableCount: bookingData.reserveTableCount || 0
      });
      
      // Format the date to MySQL format (YYYY-MM-DD)
      let formattedDate = bookingData.weddingDate;
      try {
        // If the date is in ISO format, convert it to YYYY-MM-DD
        if (bookingData.weddingDate && bookingData.weddingDate.includes('T')) {
          formattedDate = bookingData.weddingDate.split('T')[0];
        }
        console.log('Formatted wedding date for MySQL:', formattedDate);
      } catch (dateError) {
        console.error('Error formatting date:', dateError);
        // Default to original format if any error occurs
        formattedDate = bookingData.weddingDate;
      }
      
      let bookingId;      
      try {        
        const [result] = await connection.query(
          `INSERT INTO TiecCuoi (
            ID_KhachHang, ID_SanhTiec, NgayToChuc, ID_Ca, 
            ThoiDiemDat, SoLuongBan, SoBanDuTru, TrangThai
          ) VALUES (?, ?, ?, ?, NOW(), ?, ?, "Chưa thanh toán còn lại")`,
          [
            bookingData.customerId,
            bookingData.hallId,
            formattedDate, // Use the formatted date
            bookingData.shiftId,
            bookingData.tableCount || 0,
            bookingData.reserveTableCount || 0,
          ]
        );
        
        bookingId = result.insertId;
        console.log('Created booking with ID:', bookingId);
      } catch (queryError) {
        console.error('Error inserting booking:', queryError);
        throw queryError;
      }
      console.log('Created booking with ID:', bookingId);        // 2. Thêm các dịch vụ đã chọn
      if (bookingData.services && bookingData.services.length > 0) {
        console.log('Adding services:', bookingData.services);
        
        // Insert services one by one to avoid errors with multiple value insert syntax
        for (const service of bookingData.services) {
          try {
            // Ensure service ID is correctly mapped
            const serviceId = service.serviceId || service.id;
            
            if (!serviceId) {
              console.error('Missing service ID, skipping service:', service);
              continue;
            }
            
            console.log(`Adding service: ID=${serviceId}, quantity=${service.quantity}, price=${service.price}`);
              const quantity = parseInt(service.quantity) || 1;
            const price = parseFloat(service.price) || 0;
            
            await connection.query(
              `INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) 
               VALUES (?, ?, ?, ?)`,
              [
                bookingId,
                serviceId,
                quantity,
                price
              ]
            );
          } catch (serviceError) {
            console.error('Error inserting service:', serviceError);
          }
        }
      }      // Thêm mới: Xử lý thêm món ăn
      if (bookingData.foods && Array.isArray(bookingData.foods) && bookingData.foods.length > 0) {
        console.log('Adding foods array:', bookingData.foods);
        
        for (const foodItem of bookingData.foods) {
          try {
            const foodId = foodItem.id || foodItem.foodId;
            const quantity = parseInt(foodItem.quantity) || 0;
            
            if (!foodId || quantity <= 0) {
              console.error('Invalid food data, skipping:', foodItem);
              continue;
            }
            
            console.log(`Adding food: ID=${foodId}, quantity=${quantity}`);
            
            // Get food price if not provided
            let price = parseFloat(foodItem.price) || 0;
            if (!price) {
              const [foodResult] = await connection.query(
                'SELECT DonGia FROM MonAn WHERE ID_MonAn = ?',
                [foodId]
              );
              
              if (!foodResult || foodResult.length === 0) {
                console.warn(`Food with ID ${foodId} not found, skipping`);
                continue;
              }
              
              price = parseFloat(foodResult[0].DonGia) || 0;
            }
            
            // Add food to Tiec_MonAn table
            await connection.query(
              `INSERT INTO Tiec_MonAn (ID_TiecCuoi, ID_MonAn, SoLuong, DonGia) 
               VALUES (?, ?, ?, ?)`,
              [
                bookingId,
                foodId,
                quantity,
                price
              ]
            );
            console.log(`Food added successfully: ID=${foodId}, quantity=${quantity}, price=${price}`);
          } catch (foodError) {
            console.error('Error inserting food:', foodError);
          }
        }
      }
      // Backward compatibility: Handle foods as object format
      else if (bookingData.foods && typeof bookingData.foods === 'object' && Object.keys(bookingData.foods).length > 0) {
        console.log('Adding foods object:', bookingData.foods);
        
        for (const [foodId, quantity] of Object.entries(bookingData.foods)) {
          try {
            if (!foodId || !quantity || quantity <= 0) {
              console.error('Invalid food data, skipping:', { foodId, quantity });
              continue;
            }
            
            console.log(`Adding food: ID=${foodId}, quantity=${quantity}`);
            
            // Lấy đơn giá của món ăn
            const [foodResult] = await connection.query(
              'SELECT DonGia FROM MonAn WHERE ID_MonAn = ?',
              [foodId]
            );
            
            if (!foodResult || foodResult.length === 0) {
              console.warn(`Food with ID ${foodId} not found, skipping`);
              continue;
            }
            
            const price = parseFloat(foodResult[0].DonGia) || 0;
            
            // Thêm món ăn vào bảng Tiec_MonAn
            await connection.query(
              `INSERT INTO Tiec_MonAn (ID_TiecCuoi, ID_MonAn, SoLuong, DonGia) 
               VALUES (?, ?, ?, ?)`,
              [
                bookingId,
                foodId,
                quantity,
                price
              ]
            );
            console.log(`Food added successfully: ID=${foodId}, quantity=${quantity}, price=${price}`);
          } catch (foodError) {
            console.error('Error inserting food:', foodError);
          }
        }
      }        // Get hall price and table minimum price
      const [hallResult] = await connection.query(
        `SELECT s.GiaThue, l.GiaBanToiThieu 
         FROM SanhTiec s
         JOIN LoaiSanh l ON s.ID_LoaiSanh = l.ID_LoaiSanh
         WHERE s.ID_SanhTiec = ?`,
        [bookingData.hallId]
      );
      
      const hallPrice = hallResult[0] ? hallResult[0].GiaThue : 0;
      const tableMinPrice = hallResult[0] ? hallResult[0].GiaBanToiThieu : 0;
      const tableCount = bookingData.tableCount || 0;
      const tableTotal = tableMinPrice * tableCount;
      
      console.log('Hall price:', hallPrice);
      console.log('Table minimum price:', tableMinPrice);
      console.log('Table count:', tableCount);
      console.log('Table total price:', tableTotal);
        // Calculate services total
      let servicesTotal = 0;
      if (bookingData.services && bookingData.services.length > 0) {
        try {
          for (const service of bookingData.services) {
            // Get the service ID - might be directly in id field or in serviceId field
            const serviceId = service.serviceId || service.id;
            if (!serviceId) {
              console.warn('Service missing ID, skipping in total calculation');
              continue;
            }
            
            console.log(`Getting price for service ID: ${serviceId}`);
            const [serviceResult] = await connection.query(
              'SELECT DonGia FROM DichVu WHERE ID_DichVu = ?',
              [serviceId]
            );
            
            const quantity = parseInt(service.quantity) || 1;
            const servicePrice = serviceResult[0] ? serviceResult[0].DonGia : 0;
            const serviceTotal = servicePrice * quantity;
            
            console.log(`Service ${serviceId}: Price=${servicePrice}, Quantity=${quantity}, Total=${serviceTotal}`);
            servicesTotal += serviceTotal;
          }
        } catch (calcError) {
          console.error('Error calculating services total:', calcError);
          // Continue with whatever total we've calculated so far
        }
      }
      console.log('Services total calculated:', servicesTotal);
        // Thêm mới: Tính tổng tiền món ăn
      let foodsTotal = 0;
      
      // Xử lý trường hợp foods là mảng (định dạng mới)
      if (bookingData.foods && Array.isArray(bookingData.foods) && bookingData.foods.length > 0) {
        try {
          for (const foodItem of bookingData.foods) {
            const foodId = foodItem.id || foodItem.foodId;
            const quantity = parseInt(foodItem.quantity) || 0;
            
            if (!foodId || quantity <= 0) continue;
            
            console.log(`Getting price for food ID: ${foodId}`);
            // Nếu đã có giá trong dữ liệu thì dùng luôn
            let foodPrice = parseFloat(foodItem.price) || 0;
            
            // Nếu không có giá thì query từ DB
            if (!foodPrice) {
              const [foodResult] = await connection.query(
                'SELECT DonGia FROM MonAn WHERE ID_MonAn = ?',
                [foodId]
              );
              foodPrice = foodResult[0] ? foodResult[0].DonGia : 0;
            }
            
            const foodTotal = foodPrice * quantity;
            console.log(`Food ${foodId}: Price=${foodPrice}, Quantity=${quantity}, Total=${foodTotal}`);
            foodsTotal += foodTotal;
          }
        } catch (calcError) {
          console.error('Error calculating foods total (array format):', calcError);
        }
      } 
      // Xử lý trường hợp foods là object (định dạng cũ)
      else if (bookingData.foods && typeof bookingData.foods === 'object' && Object.keys(bookingData.foods).length > 0) {
        try {
          for (const [foodId, quantity] of Object.entries(bookingData.foods)) {
            if (!foodId || !quantity || quantity <= 0) continue;
            
            console.log(`Getting price for food ID: ${foodId}`);
            const [foodResult] = await connection.query(
              'SELECT DonGia FROM MonAn WHERE ID_MonAn = ?',
              [foodId]
            );
            
            const foodPrice = foodResult[0] ? foodResult[0].DonGia : 0;
            const foodTotal = foodPrice * quantity;
            
            console.log(`Food ${foodId}: Price=${foodPrice}, Quantity=${quantity}, Total=${foodTotal}`);
            foodsTotal += foodTotal;
          }
        } catch (calcError) {
          console.error('Error calculating foods total (object format):', calcError);
        }
      }
      
      console.log('Foods total calculated:', foodsTotal);
          // Convert to numbers and add to ensure proper numeric addition
      const hallPriceNum = parseFloat(hallPrice) || 0;
      const tableTotalNum = parseFloat(tableTotal) || 0;
      const servicesTotalNum = parseFloat(servicesTotal) || 0;
      const foodsTotalNum = parseFloat(foodsTotal) || 0;
      const totalAmount = hallPriceNum + tableTotalNum + servicesTotalNum + foodsTotalNum;
      
      // Use provided deposit or calculate 50% of total
      const depositAmount = bookingData.deposit ? parseInt(bookingData.deposit) : Math.round(totalAmount * 0.5);
      
      console.log('Final calculation:');
      console.log('- Hall price:', hallPriceNum);
      console.log('- Table total:', tableTotalNum);
      console.log('- Services total:', servicesTotalNum);
      console.log('- Foods total:', foodsTotalNum);
      console.log('- Total amount:', totalAmount);
      console.log('- Deposit amount:', depositAmount);
        // 3. Tạo hóa đơn đặt cọc
      try {
        console.log('Creating invoice with data:', {
          bookingId,
          totalAmount,
          depositAmount
        });
        
        await connection.query(
          `INSERT INTO HoaDon (ID_TiecCuoi, NgayLap, TongTien, TienThanhToan, LoaiHoaDon) 
           VALUES (?, CURDATE(), ?, ?, 'Thanh toán đặt cọc')`,
          [bookingId, totalAmount, depositAmount]
        );
        
        console.log('Successfully created invoice for booking ID:', bookingId);
        await connection.commit();
        console.log('Transaction committed successfully');
        
        return { 
          ID_TiecCuoi: bookingId, 
          message: 'Đặt tiệc thành công',
          totalAmount,
          depositAmount,
          TrangThai: "Chưa thanh toán còn lại"
        };
      } catch (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
        throw new Error(`Lỗi tạo hóa đơn: ${invoiceError.message}`);
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Lấy danh sách đặt tiệc
   */
  async getAllBookings(filters = {}) {
    try {
      let query = `
        SELECT t.*, s.TenSanh, s.GiaThue, c.TenCa, kh.TenKhachHang, kh.SoDienThoai
        FROM TiecCuoi t
        JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
        JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
        JOIN KhachHang kh ON t.ID_KhachHang = kh.ID_KhachHang
        WHERE 1=1
      `;
      
      const queryParams = [];
      
      // Lọc theo ngày
      if (filters.date) {
        query += " AND t.NgayToChuc = ?";
        queryParams.push(filters.date);
      }
      
      // Lọc theo tên khách hàng
      if (filters.customerName) {
        query += " AND kh.TenKhachHang LIKE ?";
        queryParams.push(`%${filters.customerName}%`);
      }
      
      // Chỉ lọc theo 2 loại trạng thái hợp lệ
      if (filters.status) {
        if (filters.status.toLowerCase() === 'completed' || 
            filters.status.toLowerCase() === 'đã thanh toán') {
          query += " AND t.TrangThai = 'Đã thanh toán'";
        } else {
          query += " AND t.TrangThai = 'Chưa thanh toán còn lại'";
        }
      }
      
      query += " ORDER BY t.NgayToChuc DESC";
      
      const [rows] = await pool.query(query, queryParams);
      
      // Đảm bảo chỉ có 2 loại trạng thái khi trả về kết quả
      const standardizedRows = rows.map(row => {
        if (row.TrangThai !== 'Đã thanh toán') {
          row.TrangThai = 'Chưa thanh toán còn lại';
        }
        return row;
      });
      
      return standardizedRows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết đặt tiệc
   */
  async getBookingById(bookingId) {
    try {
      // 1. Lấy thông tin cơ bản về đặt tiệc
      const [bookingRows] = await pool.query(
        `SELECT t.*, k.HoTen AS TenKhachHang, k.SoDienThoai,
                s.TenSanh, s.GiaThue, c.TenCa,
                h.TienThanhToan AS TienCoc
         FROM TiecCuoi t
         JOIN KhachHang k ON t.ID_KhachHang = k.ID_KhachHang
         JOIN SanhTiec s ON t.ID_SanhTiec = s.ID_SanhTiec
         JOIN CaTiec c ON t.ID_Ca = c.ID_Ca
         LEFT JOIN HoaDon h ON t.ID_TiecCuoi = h.ID_TiecCuoi AND h.LoaiHoaDon = 'Thanh toán đặt cọc'
         WHERE t.ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      if (bookingRows.length === 0) {
        throw new Error('Không tìm thấy đặt tiệc');
      }
      
      const booking = bookingRows[0];
      
      // 2. Lấy thông tin dịch vụ
      const [serviceRows] = await pool.query(
        `SELECT td.*, d.TenDichVu
         FROM Tiec_DichVu td
         JOIN DichVu d ON td.ID_DichVu = d.ID_DichVu
         WHERE td.ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      booking.services = serviceRows;
      
      // Thêm mới: Lấy thông tin món ăn
      const [foodRows] = await pool.query(
        `SELECT tm.*, m.TenMonAn
         FROM Tiec_MonAn tm
         JOIN MonAn m ON tm.ID_MonAn = m.ID_MonAn
         WHERE tm.ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      booking.foods = foodRows;
      
      // Chuẩn hóa trạng thái
      if (booking.TrangThai !== 'Đã thanh toán') {
        booking.TrangThai = 'Chưa thanh toán còn lại';
      }
      
      return booking;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin đặt tiệc
   */
  async updateBooking(bookingId, updateData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Chuẩn hóa trạng thái
      let status = 'Chưa thanh toán còn lại';
      if (updateData.status === 'Đã thanh toán' || 
          updateData.status === 'completed' || 
          updateData.status === 'paid') {
        status = 'Đã thanh toán';
      }
      
      // 1. Cập nhật thông tin cơ bản
      await connection.query(
        `UPDATE TiecCuoi 
         SET SoLuongBan = ?, SoBanDuTru = ?, TrangThai = ?
         WHERE ID_TiecCuoi = ?`,
        [updateData.tableCount, updateData.reserveTableCount, status, bookingId]
      );
      
      // 2. Xóa dịch vụ cũ
      await connection.query(
        `DELETE FROM Tiec_DichVu WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      // Thêm mới: Xóa món ăn cũ
      await connection.query(
        `DELETE FROM Tiec_MonAn WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      // 3. Thêm dịch vụ mới
      if (updateData.services && updateData.services.length > 0) {
        const serviceValues = updateData.services.map(service => [
          bookingId,
          service.serviceId,
          service.quantity,
          service.price
        ]);
        
        await connection.query(
          `INSERT INTO Tiec_DichVu (ID_TiecCuoi, ID_DichVu, SoLuong, DonGia) 
           VALUES ?`,
          [serviceValues]
        );
      }
      
      // Thêm mới: Thêm món ăn mới
      if (updateData.foods && Object.keys(updateData.foods).length > 0) {
        for (const [foodId, quantity] of Object.entries(updateData.foods)) {
          try {
            if (!foodId || !quantity || quantity <= 0) continue;
            
            const [foodResult] = await connection.query(
              'SELECT DonGia FROM MonAn WHERE ID_MonAn = ?',
              [foodId]
            );
            
            if (!foodResult || foodResult.length === 0) continue;
            
            const price = parseFloat(foodResult[0].DonGia) || 0;
            
            await connection.query(
              `INSERT INTO Tiec_MonAn (ID_TiecCuoi, ID_MonAn, SoLuong, DonGia) 
               VALUES (?, ?, ?, ?)`,
              [bookingId, foodId, quantity, price]
            );
          } catch (foodError) {
            console.error('Error inserting updated food:', foodError);
          }
        }
      }
      
      await connection.commit();
      
      return { 
        message: 'Cập nhật đặt tiệc thành công',
        status: status
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Thay đổi trạng thái thanh toán tiệc cưới
   */
  async updateBookingStatus(bookingId, isFullyPaid = false) {
    try {
      const status = isFullyPaid ? 'Đã thanh toán' : 'Chưa thanh toán còn lại';
      
      const [result] = await pool.query(
        `UPDATE TiecCuoi SET TrangThai = ? WHERE ID_TiecCuoi = ?`,
        [status, bookingId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy tiệc cưới');
      }
      
      return { 
        success: true, 
        message: `Cập nhật trạng thái thành ${status}`,
        status: status
      };
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Hủy đặt tiệc
   */
  async cancelBooking(bookingId, reason) {
    try {
      await pool.query(
        `DELETE FROM Tiec_DichVu WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      await pool.query(
        `DELETE FROM HoaDon WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      await pool.query(
        `DELETE FROM TiecCuoi WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      return { message: 'Hủy đặt tiệc thành công' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa đặt tiệc
   */
  async deleteBooking(bookingId) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. Xóa các dịch vụ liên quan
      await connection.query(
        `DELETE FROM Tiec_DichVu WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      // 2. Xóa các hóa đơn liên quan
      await connection.query(
        `DELETE FROM HoaDon WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      // 3. Xóa đặt tiệc
      const [result] = await connection.query(
        `DELETE FROM TiecCuoi WHERE ID_TiecCuoi = ?`,
        [bookingId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Không tìm thấy đặt tiệc');
      }
      
      await connection.commit();
      return { message: 'Xóa đặt tiệc thành công' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new WeddingBookingService();