import { useState, useEffect } from 'react';
import { message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import HallService from '../../services/HallService';
import ServiceService from '../../services/ServiceService';
import ShiftService from '../../services/ShiftService';
import BookingService from '../../services/BookingService';

export function useBookingForm(preSelectedHallId) {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [services, setServices] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch all initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch hall details if preSelectedHallId exists
  useEffect(() => {
    if (preSelectedHallId) {
      fetchHallDetails(preSelectedHallId);
    }
  }, [preSelectedHallId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [hallsRes, servicesRes, shiftsRes] = await Promise.all([
        HallService.getHalls(),
        ServiceService.getServices(),
        ShiftService.getShifts(),
      ]);

      console.log('Services response:', servicesRes);

      // Process halls data
      setHalls(hallsRes.data || []);
      
      // Process services data
      if (Array.isArray(servicesRes)) {
        setServices(servicesRes);
      } else {
        setServices(servicesRes.data || []);
      }
      
      // Process shifts data
      setShifts(shiftsRes || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Không thể tải thông tin cần thiết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  const fetchHallDetails = async (hallId) => {
    if (!hallId) return;
    
    try {
      // Convert hallId to number to ensure consistent comparison
      const hallIdAsNumber = parseInt(hallId);
      
      // Log để debug
      console.log('Fetching hall details for ID:', hallIdAsNumber);
      
      // Trước khi gọi API, kiểm tra xem có thể lấy được từ danh sách đã load không
      if (halls && halls.length > 0) {
        const hallFromList = halls.find(h => h.ID_SanhTiec === hallIdAsNumber);
        if (hallFromList) {
          console.log('Found hall in cached list:', hallFromList);
          setSelectedHall(hallFromList);
          return hallFromList; // Return the hall data for immediate use
        }
      }
      
      // Nếu không tìm thấy trong cache, gọi API
      const hall = await HallService.getHallById(hallIdAsNumber);
      if (hall) {
        console.log('Fetched hall details from API:', hall);
        setSelectedHall(hall);
        return hall; // Return the hall data for immediate use
      } else {
        console.error('Could not find hall details for ID:', hallIdAsNumber);
        return null;
      }
    } catch (err) {
      console.error('Error fetching hall details:', err);
      return null;
    }
  };
  const calculateTotal = (values) => {
    let total = 0;
    
    // Ghi log để debug
    console.log('Calculating total with values:', values);
    
    // Calculate hall price
    if (values.hallId) {
      // Chuyển đổi hallId thành số để so sánh chính xác
      const hallIdAsNumber = parseInt(values.hallId);
      
      // Ưu tiên dùng selectedHall đã chọn nếu ID khớp
      const hall = selectedHall?.ID_SanhTiec === hallIdAsNumber
        ? selectedHall
        : halls.find(h => h.ID_SanhTiec === hallIdAsNumber);
      
      if (hall) {
        const hallPrice = parseFloat(hall.GiaThue) || 0;
        total += hallPrice;
        console.log(`Hall price (${hall.TenSanh}): ${hallPrice}`);
      } else {
        console.warn(`Cannot find hall info for ID: ${values.hallId}`);
      }
    }
    
    // Calculate services price - FIX: Ensure we're using the correct service information
    if (values.services && typeof values.services === 'object') {
      // Create a copy of services to avoid reference issues
      const servicesCopy = JSON.parse(JSON.stringify(values.services));
      
      // Loop through services and calculate total
      Object.entries(servicesCopy).forEach(([serviceId, serviceInfo]) => {
        if (!serviceInfo) return; // Skip if serviceInfo is null or undefined
        
        // Make sure we have price and quantity as numbers
        const price = parseFloat(serviceInfo.price) || 0;
        const quantity = parseInt(serviceInfo.quantity) || 0;
        
        // Only include services with quantity > 0
        if (quantity <= 0) return;
        
        const serviceTotal = price * quantity;
        total += serviceTotal;
        
        console.log(`Service (${serviceInfo.name || serviceId}): ${price} x ${quantity} = ${serviceTotal}`);
      });
    }
    
    console.log(`Total calculated: ${total}`);
    setTotalAmount(total);
    return total;
  };const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      setError(null); // Reset any previous errors
      
      // Debug: log giá trị form khi submit để kiểm tra
      console.log('Form values on submit:', values);
      
      // Validate required fields before proceeding
      if (!values.hallId) {
        throw new Error('Vui lòng chọn sảnh tiệc');
      }
      
      if (!values.date) {
        throw new Error('Vui lòng chọn ngày tổ chức tiệc');
      }
      
      if (!values.shiftId) {
        throw new Error('Vui lòng chọn ca tiệc');
      }
      
      if (!values.customerName || !values.phone || !values.email) {
        throw new Error('Vui lòng điền đầy đủ thông tin liên hệ');
      }
      
      // Ghi log chi tiết để debug
      console.log('Date field exists:', !!values.date);
      if (values.date) {
        console.log('Date type:', typeof values.date, values.date instanceof moment);
        console.log('Date value:', values.date.toString());
      }
      
      // Ghi log đầy đủ giá trị form để debug
      console.log('Full form values:', {
        hallId: values.hallId,
        date: values.date?.format('YYYY-MM-DD'),
        shiftId: values.shiftId,
        customerName: values.customerName,
        phone: values.phone,
        email: values.email,
        services: values.services
      });
      
      // Calculate final total
      const latestTotal = calculateTotal(values);
      console.log("Final total amount when submitting:", latestTotal);      // Format services data cho đúng định dạng server cần
      const services = [];
      if (values.services && typeof values.services === 'object') {
        console.log('Processing services for submit:', values.services);
        
        // Chuyển đổi từ object sang array như server cần
        Object.entries(values.services).forEach(([serviceId, serviceInfo]) => {
          // Skip services with no quantity or quantity <= 0
          if (!serviceInfo || !serviceInfo.quantity || parseInt(serviceInfo.quantity) <= 0) return;
          
          // Make sure service ID is a number
          const serviceIdInt = parseInt(serviceId);
          if (isNaN(serviceIdInt)) {
            console.warn('Invalid service ID, skipping:', serviceId);
            return;
          }
          
          // Create service object with all required fields
          const service = {
            id: serviceIdInt,  // Server requires this field
            serviceId: serviceIdInt, // Add both for compatibility
            quantity: parseInt(serviceInfo.quantity) || 1,
            price: parseFloat(serviceInfo.price) || 0,
            name: serviceInfo.name || ''
          };
          
          console.log('Adding service to request:', service);
          services.push(service);
        });
      }
      
      // Nếu không có dịch vụ, đảm bảo mảng rỗng
      if (services.length === 0) {
        console.log('No services selected');
      }
      
      console.log('Final services array:', services);
      
      let weddingDate = null;
      try {
        weddingDate = values.date.format('YYYY-MM-DD');
        console.log('Formatted wedding date:', weddingDate);
      } catch (error) {
        console.error('Error formatting date:', error);
        throw new Error('Lỗi định dạng ngày tháng, vui lòng chọn lại ngày tổ chức');
      }
      
      // Tìm thông tin ca tiệc
      const selectedShift = shifts.find(s => s.ID_Ca === parseInt(values.shiftId));
      const shiftName = selectedShift ? selectedShift.TenCa : 'Không xác định';      // Prepare booking data - chỉnh để phù hợp với yêu cầu của server
      const bookingData = {
        // Các trường bắt buộc theo schema TiecCuoi
        hallId: parseInt(values.hallId),
        weddingDate: weddingDate,
        shiftId: parseInt(values.shiftId),
        
        // Trường customerId là bắt buộc cho server
        customerId: 1, // ID khách hàng mặc định = 1
        
        // QUAN TRỌNG: Bổ sung TenKhachHang cho query INSERT trên server
        // Server cần trường này để chèn vào bảng TiecCuoi
        customerName: values.customerName || "Khách hàng",
        
        // Các trường SoLuongBan và SoBanDuTru - đảm bảo luôn có giá trị số hợp lệ
        tableCount: Math.ceil((parseInt(values.guestCount) || 10) / 10),
        numberOfTables: Math.ceil((parseInt(values.guestCount) || 10) / 10), // Để tương thích API
        reserveTableCount: Math.ceil((parseInt(values.guestCount) || 0) / 20), // Số bàn dự phòng = 5% số khách
        
        // Thông tin khách hàng
        phone: values.phone,
        email: values.email,
        address: values.address || '',
        numberOfGuests: parseInt(values.guestCount) || 0,
        
        // Thông tin thanh toán
        totalAmount: latestTotal,
        depositAmount: Math.round(latestTotal * 0.5),
        
        // Thông tin khác
        note: values.note || '',
        services: services, // Đã chuẩn hóa ở trên
        
        // Thông tin sảnh để hiển thị ở frontend và gửi cho server
        hallInfo: selectedHall ? {
          id: selectedHall.ID_SanhTiec,
          name: selectedHall.TenSanh,
          price: parseFloat(selectedHall.GiaThue) || 0,
          capacity: parseInt(selectedHall.SucChua) || 0,
          type: selectedHall.TenLoai || "Chung"
        } : null
      };
      
      // Validate required fields
      if (!bookingData.hallId) {
        throw new Error('Vui lòng chọn sảnh tiệc');
      }
      
      if (!bookingData.weddingDate) {
        throw new Error('Vui lòng chọn ngày tổ chức tiệc');
      }
      
      if (!bookingData.shiftId) {
        throw new Error('Vui lòng chọn ca tiệc');
      }

      // Kiểm tra thông tin sảnh
      if (!selectedHall) {
        console.error('Missing hall information for hallId:', bookingData.hallId);
        
        try {
          await fetchHallDetails(bookingData.hallId);
          if (!selectedHall) {
            throw new Error('Không thể lấy thông tin sảnh. Vui lòng thử lại.');
          }
          bookingData.hallInfo = {
            id: selectedHall.ID_SanhTiec,
            name: selectedHall.TenSanh,
            price: parseFloat(selectedHall.GiaThue) || 0,
            capacity: parseInt(selectedHall.SucChua) || 0,
            type: selectedHall.TenLoai || "Chung"
          };
        } catch (hallErr) {
          console.error('Error fetching hall details before submission:', hallErr);
          throw new Error('Không thể lấy thông tin sảnh. Vui lòng thử lại.');
        }
      }      try {
        // Log chi tiết dữ liệu gửi đi để debug
        console.log('Submitting booking with final data:', JSON.stringify(bookingData, null, 2));
        
        // Kiểm tra xem dữ liệu có đầy đủ các trường quan trọng không
        if (!bookingData.customerId) {
          console.warn('customerId is missing, defaulting to 1');
          bookingData.customerId = 1;
        }
        
        if (!bookingData.tableCount) {
          console.warn('tableCount is missing, calculating from guest count');
          bookingData.tableCount = Math.ceil((parseInt(bookingData.numberOfGuests) || 10) / 10);
        }
        
        // Thử gọi API với timeout dài hơn để đảm bảo có đủ thời gian xử lý
        const result = await Promise.race([
          BookingService.createBooking(bookingData),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout khi gửi đơn đặt tiệc')), 30000)
          )
        ]);
        
        console.log('Booking API response:', result);
        
        // Xử lý trường hợp response trống
        if (!result) {
          console.error('Empty response from server');
          throw new Error('Không nhận được phản hồi từ server');
        }
        
        // Return data for FormPage to handle the navigation
        return {
          id: result.id || result.bookingId || 'unknown',
          bookingId: result.id || result.bookingId || 'unknown',
          totalAmount: latestTotal,
          depositAmount: Math.round(latestTotal * 0.5),
          customerName: values.customerName || '',
          phone: values.phone || '',
          email: values.email || '',
          address: values.address || '',
          weddingDate: weddingDate,
          hallName: selectedHall?.TenSanh || '',
          shiftName: shiftName,
          numberOfGuests: parseInt(values.guestCount) || 0,
          guestCount: parseInt(values.guestCount) || 0,
        };
      } catch (apiError) {
        console.error('API error during booking submission:', apiError);
        
        // Logging detailed error information
        if (apiError.response) {
          console.error('API error details:', {
            status: apiError.response.status,
            statusText: apiError.response.statusText,
            data: apiError.response.data
          });
          
          // Nếu server trả về lỗi chi tiết, sử dụng nó
          if (apiError.response.data && apiError.response.data.message) {
            throw new Error(apiError.response.data.message);
          }
        }
        
        throw new Error(apiError.message || 'Không thể tạo đơn đặt tiệc');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt tiệc. Vui lòng thử lại.');
      message.error(err.message || 'Có lỗi xảy ra khi đặt tiệc. Vui lòng thử lại.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    halls,
    services,
    shifts,
    selectedHall,
    loading,
    error,
    submitting,
    totalAmount,
    fetchHallDetails,
    calculateTotal,
    handleSubmit
  };
}
