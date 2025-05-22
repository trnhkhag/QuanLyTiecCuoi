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
      // Log để debug
      console.log('Fetching hall details for ID:', hallId);
      
      // Trước khi gọi API, kiểm tra xem có thể lấy được từ danh sách đã load không
      if (halls && halls.length > 0) {
        const hallFromList = halls.find(h => h.ID_SanhTiec === parseInt(hallId));
        if (hallFromList) {
          console.log('Found hall in cached list:', hallFromList);
          setSelectedHall(hallFromList);
          return;
        }
      }
      
      // Nếu không tìm thấy trong cache, gọi API
      const hall = await HallService.getHallById(hallId);
      if (hall) {
        console.log('Fetched hall details from API:', hall);
        setSelectedHall(hall);
      } else {
        console.error('Could not find hall details for ID:', hallId);
      }
    } catch (err) {
      console.error('Error fetching hall details:', err);
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
    
    // Calculate services price
    if (values.services && typeof values.services === 'object') {
      Object.entries(values.services).forEach(([serviceId, serviceInfo]) => {
        if (!serviceInfo) return; // Skip if serviceInfo is null or undefined
        
        // Đảm bảo chuyển đổi đúng kiểu dữ liệu
        const price = parseFloat(serviceInfo.price) || 0;
        const quantity = parseInt(serviceInfo.quantity) || 0;
        const serviceTotal = price * quantity;
        
        total += serviceTotal;
        console.log(`Service (${serviceInfo.name}): ${price} x ${quantity} = ${serviceTotal}`);
      });
    }
    
    console.log(`Total calculated: ${total}`);
    setTotalAmount(total);
    return total;
  };
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Debug: log giá trị form khi submit để kiểm tra
      console.log('Form values on submit:', values);
      console.log('Date field exists:', !!values.date);
      if (values.date) {
        console.log('Date type:', typeof values.date, values.date instanceof moment);
        console.log('Date value:', values.date.toString());
      }
      
      // Calculate final total
      const latestTotal = calculateTotal(values);
      console.log("Final total amount when submitting:", latestTotal);
        // Format services data
      const services = [];
      if (values.services && typeof values.services === 'object') {
        console.log('Processing services for submit:', values.services);
        Object.entries(values.services).forEach(([serviceId, serviceInfo]) => {
          if (!serviceInfo) return;
          
          const service = {
            id: parseInt(serviceId),
            quantity: parseInt(serviceInfo.quantity) || 1,
            price: parseFloat(serviceInfo.price)
          };
          
          console.log('Adding service to request:', service);
          services.push(service);
        });
      }
      
      console.log('Final services array:', services);
        // Prepare booking data in the correct format expected by API      // Đảm bảo tất cả các trường quan trọng có giá trị và đúng kiểu dữ liệu
        // Kiểm tra và xử lý date trước khi sử dụng format
      if (!values.date) {
        throw new Error('Vui lòng chọn ngày tổ chức tiệc');
      }
      
      let weddingDate = null;
      try {
        weddingDate = values.date.format('YYYY-MM-DD');
        console.log('Formatted wedding date:', weddingDate);
      } catch (error) {
        console.error('Error formatting date:', error);
        throw new Error('Lỗi định dạng ngày tháng, vui lòng chọn lại ngày tổ chức');
      }
      
      const bookingData = {
        hallId: parseInt(values.hallId),
        weddingDate: weddingDate,
        shiftId: parseInt(values.shiftId),
        totalAmount: latestTotal,
        depositAmount: Math.round(latestTotal * 0.5),
        customerName: values.customerName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        numberOfGuests: parseInt(values.guestCount) || 0,
        note: values.note || '',
        services: services,
        // Thêm thông tin sảnh để đảm bảo API có đủ thông tin
        hallInfo: selectedHall ? {
          id: selectedHall.ID_SanhTiec,
          name: selectedHall.TenSanh,
          price: parseFloat(selectedHall.GiaThue) || 0,
          capacity: parseInt(selectedHall.SucChua) || 0,
          type: selectedHall.TenLoai || "Chung"
        } : null
      };
      
      console.log('Sending booking request with data:', bookingData);        // Validate required fields explicitly với thông báo rõ ràng hơn
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
        
        // Thử lấy lại thông tin sảnh một lần nữa
        try {
          await fetchHallDetails(bookingData.hallId);
          if (!selectedHall) {
            throw new Error('Không thể lấy thông tin sảnh. Vui lòng thử lại.');
          }
          // Cập nhật lại thông tin sảnh trong bookingData nếu đã lấy được
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
      }
        try {
        // Submit booking request
        console.log('Submitting booking with final data:', bookingData);
        const result = await BookingService.createBooking(bookingData);
        
        console.log('Booking API response:', result);
        
        // Check if result is defined before proceeding
        if (!result) {
          throw new Error('Không nhận được phản hồi từ server');
        }
        
        // Success case
        message.success('Đặt tiệc thành công!');
        console.log('Navigating to success page with data:', {
          bookingId: result.id || 'unknown',
          totalAmount: latestTotal,
          depositAmount: Math.round(latestTotal * 0.5)
        });
          // Tạo đối tượng dữ liệu chuyển hướng chi tiết hơn
        const successData = {
          bookingId: result.id || result.bookingId || 'unknown',
          totalAmount: latestTotal,
          depositAmount: Math.round(latestTotal * 0.5),
          customerName: values.customerName || '',
          phone: values.phone || '',
          email: values.email || '',
          address: values.address || '',
          weddingDate: weddingDate,
          hallName: selectedHall?.TenSanh || ''
        };

        console.log('Redirecting with success data:', successData);
          try {
          // Sử dụng navigate với tham số state
          console.log('Calling navigate function to /booking/success');
          // Lưu dữ liệu vào localStorage để đảm bảo không bị mất khi redirect
          localStorage.setItem('bookingSuccessData', JSON.stringify(successData));
          
          // Đảm bảo chuyển hướng được thực hiện
          setTimeout(() => {
            navigate('/booking/success', { state: successData, replace: true });
            console.log('Navigation function called');
          }, 500);
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback nếu navigate không hoạt động
          window.location.href = '/booking/success';
        }
      } catch (apiError) {
        console.error('API error during booking submission:', apiError);
        throw new Error(apiError.message || 'Không thể tạo đơn đặt tiệc');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt tiệc. Vui lòng thử lại.');
      message.error(err.message || 'Có lỗi xảy ra khi đặt tiệc. Vui lòng thử lại.');
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