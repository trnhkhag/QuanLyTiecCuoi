import { useState, useEffect } from 'react';
import axios from 'axios';

// Lấy API URL từ biến môi trường hoặc sử dụng giá trị mặc định
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Hook xử lý form và danh sách tiệc cưới
 */
export function useBookingForm() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: null,
    customerName: '',
    status: ''
  });

  // Thiết lập config cho axios
  const axiosConfig = {
    timeout: 10000, // 10 giây timeout
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Khởi tạo - fetch dữ liệu khi component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Chuyển đổi status từ tiếng Anh sang tiếng Việt
  const convertStatusToVietnamese = (status) => {
    if (!status) return 'Chưa thanh toán còn lại';
    
    switch (status.toLowerCase()) {
      case 'completed': 
      case 'paid': 
        return 'Đã thanh toán';
      case 'pending':
      case 'confirmed':
      case 'cancelled':
      default:
        return 'Chưa thanh toán còn lại';
    }
  };

  // Cập nhật một trường trong filter
  const updateFilter = (field, value) => {
    console.log(`Updating filter: ${field} = `, value);
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Áp dụng bộ lọc
  const applyFilters = () => {
    console.log('Applying filters:', filters);
    fetchFilteredBookings();
  };

  // Reset các bộ lọc
  const resetFilters = () => {
    console.log('Resetting filters');
    setFilters({
      date: null,
      customerName: '',
      status: ''
    });
    fetchBookings();
  };

  // Fetch danh sách tiệc cưới từ API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Thêm thông báo để debug
      console.log(`Đang gọi API: ${API_URL}/weddings`);
      
      // Gọi API lấy danh sách tiệc cưới
      const response = await axios.get(`${API_URL}/weddings`, axiosConfig);
      
      console.log('Dữ liệu trả về từ API:', response.data);
      
      // Kiểm tra format dữ liệu trả về
      let data = [];
      
      if (response.data && Array.isArray(response.data)) {
        data = response.data;
        console.log('Dữ liệu là mảng trực tiếp');
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
        console.log('Dữ liệu nằm trong response.data.data');
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        data = response.data.data;
        console.log('Dữ liệu nằm trong response.data.success.data');
      } else if (response.data && typeof response.data === 'object') {
        // Nếu dữ liệu là object đơn lẻ, chuyển thành mảng
        data = [response.data];
        console.log('Dữ liệu là object đơn, đã chuyển thành mảng');
      } else {
        console.error('Format dữ liệu không đúng:', response.data);
        throw new Error('Format dữ liệu không đúng');
      }
      
      // Kiểm tra nếu data là mảng rỗng
      if (data.length === 0) {
        console.log('Không có dữ liệu tiệc cưới');
        setBookings([]);
        return;
      }
      
      console.log(`Đã nhận ${data.length} tiệc cưới`);
      
      // Standardize dữ liệu để cả hai format cũ và mới đều có thể hiển thị
      const formattedData = data.map(booking => {
        console.log('Processing booking:', booking);
        
        // Chuẩn hóa trạng thái thành "Chưa thanh toán còn lại" hoặc "Đã thanh toán"
        let status = booking.TrangThai || convertStatusToVietnamese(booking.status);
        if (status !== 'Đã thanh toán') {
          status = 'Chưa thanh toán còn lại';
        }
        
        return {
          id: booking.ID_TiecCuoi || booking.id,
          ID_TiecCuoi: booking.ID_TiecCuoi || booking.id,
          ID_KhachHang: booking.ID_KhachHang || booking.customerId,
          ID_SanhTiec: booking.ID_SanhTiec || booking.hallId,
          NgayToChuc: booking.NgayToChuc || booking.weddingDate,
          ID_Ca: booking.ID_Ca || booking.shiftId,
          ThoiDiemDat: booking.ThoiDiemDat || booking.bookingDate, 
          SoLuongBan: booking.SoLuongBan || booking.tableCount,
          SoBanDuTru: booking.SoBanDuTru || booking.reserveTables || 0,
          TrangThai: status,
          // Các trường bổ sung
          TenSanh: booking.TenSanh || booking.hallName,
          TenCa: booking.TenCa || booking.shiftName,
          GiaThue: booking.GiaThue || booking.hallPrice,
          TenKhachHang: booking.TenKhachHang || booking.customerName,
          SoDienThoai: booking.SoDienThoai || booking.customerPhone,
          TienCoc: booking.TienCoc || booking.deposit || 0
        };
      });
      
      console.log('Dữ liệu đã xử lý:', formattedData);
      setBookings(formattedData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách tiệc cưới');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách đã lọc
  const fetchFilteredBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Xây dựng query params
      const params = {};

      if (filters.date) {
        // Sửa cách xử lý ngày để giữ múi giờ địa phương
        const date = new Date(filters.date);
        params.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        console.log("Filter date being sent:", params.date);
      }

      if (filters.customerName && filters.customerName.trim() !== '') {
        params.customerName = filters.customerName.trim();
      }

      if (filters.status) {
        // Chuyển đổi giá trị status để backend hiểu được
        if (filters.status === 'completed') {
          params.status = 'Đã thanh toán';
        } else {
          params.status = 'Chưa thanh toán còn lại';
        }
      }

      console.log(`Đang gọi API filter với params:`, params);
      const response = await axios.get(`${API_URL}/weddings`, { 
        ...axiosConfig, 
        params
      });
      
      console.log('Filter API response:', response.data);
      
      // Xử lý data tương tự như fetchBookings
      let data = [];
      
      if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        data = [response.data];
      } else {
        throw new Error('Format dữ liệu không đúng');
      }
      
      const formattedData = data.map(booking => {
        // Chuẩn hóa trạng thái thành "Chưa thanh toán còn lại" hoặc "Đã thanh toán"
        let status = booking.TrangThai || convertStatusToVietnamese(booking.status);
        if (status !== 'Đã thanh toán') {
          status = 'Chưa thanh toán còn lại';
        }
        
        return {
          id: booking.ID_TiecCuoi || booking.id,
          ID_TiecCuoi: booking.ID_TiecCuoi || booking.id,
          ID_KhachHang: booking.ID_KhachHang || booking.customerId,
          ID_SanhTiec: booking.ID_SanhTiec || booking.hallId,
          NgayToChuc: booking.NgayToChuc || booking.weddingDate,
          ID_Ca: booking.ID_Ca || booking.shiftId,
          ThoiDiemDat: booking.ThoiDiemDat || booking.bookingDate,
          SoLuongBan: booking.SoLuongBan || booking.tableCount,
          SoBanDuTru: booking.SoBanDuTru || booking.reserveTables || 0,
          TrangThai: status,
          // Các trường bổ sung
          TenSanh: booking.TenSanh || booking.hallName,
          TenCa: booking.TenCa || booking.shiftName,
          GiaThue: booking.GiaThue || booking.hallPrice,
          TenKhachHang: booking.TenKhachHang || booking.customerName,
          SoDienThoai: booking.SoDienThoai || booking.customerPhone,
          TienCoc: booking.TienCoc || booking.deposit || 0
        };
      });
      
      console.log('Filtered data:', formattedData);
      setBookings(formattedData);
    } catch (err) {
      console.error('Error fetching filtered bookings:', err);
      setError('Không thể lọc danh sách tiệc cưới');
      setBookings([]); // Reset to empty array
    } finally {
      setLoading(false);
    }
  };

  // Thêm phương thức để kiểm tra kết nối API
  const checkApiConnection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/health`, { 
        timeout: 5000 
      });
      
      if (response.data && response.data.status === 'ok') {
        return true;
      }
      return false;
    } catch (err) {
      console.error('API connection check failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    fetchBookings,
    checkApiConnection
  };
}
