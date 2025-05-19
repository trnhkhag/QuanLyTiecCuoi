// Chỉ cần thêm một số dòng để fetch dịch vụ từ API

import { useState, useEffect } from 'react';
import HallService from '../services/HallService';
import ServiceService from '../services/ServiceService';
import BookingService from '../services/BookingService';
import ShiftService from '../services/ShiftService';

// Thêm hàm formatDateForState để đảm bảo lưu đúng định dạng
const formatDateForAPI = (date) => {
  if (!date) return null;
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return null;
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return null;
  }
};

export const useBookingForm = (initialFormData = {}) => {  // Form data
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    weddingDate: '',
    shiftId: '',
    hallId: '',
    numberOfGuests: '',
    numberOfTables: '',
    note: '',
    selectedServices: {},
    deposit: '',
    ...initialFormData
  });
  
  // Data lists
  const [halls, setHalls] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [services, setServices] = useState([]);
  
  // Status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch halls
        const hallsData = await HallService.getHalls();
        setHalls(Array.isArray(hallsData) ? hallsData : 
               (hallsData.data ? hallsData.data : []));
        
        // Fetch services
        const servicesData = await ServiceService.getServices();
        setServices(Array.isArray(servicesData) ? servicesData : 
                  (servicesData.data ? servicesData.data : []));

        // Fetch shifts from API endpoint
      const shiftsData = await ShiftService.getShifts();
      setShifts(Array.isArray(shiftsData) ? shiftsData : 
              (shiftsData.data ? shiftsData.data : []));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date change
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: formatDateForAPI(date)
    }));
  };
  
  // Handle hall selection
  const handleHallSelect = (hallId) => {
    setFormData(prev => ({
      ...prev,
      hallId: hallId
    }));
  };
  // Handle service selection - Improved version with better logging
  const handleServiceSelection = (serviceId, price) => {
    console.log(`Service selection changed for service ID: ${serviceId}`);
    
    setFormData(prev => {
      const selectedServices = { ...prev.selectedServices || {} };
      
      if (selectedServices[serviceId]) {
        // If already selected, remove the service
        const { [serviceId]: removed, ...rest } = selectedServices;
        console.log(`Removed service: ${serviceId}`);
        
        // Log the updated services object
        console.log('Updated selectedServices after removal:', rest);
        
        return { ...prev, selectedServices: rest };
      } else {
        // If not selected, add the service
        const serviceInfo = services.find(s => s.ID_DichVu === parseInt(serviceId));
        const serviceName = serviceInfo?.TenDichVu || 'Dịch vụ';
        const servicePrice = Number(price) || 0;
        
        // Create updated services object with the new service
        const updatedServices = {
          ...selectedServices,
          [serviceId]: {
            id: serviceId,
            name: serviceName,
            price: servicePrice,
            quantity: 1
          }
        };
        
        console.log(`Added service: ${serviceId}, name: ${serviceName}, price: ${servicePrice}`);
        console.log('Updated selectedServices after addition:', updatedServices);
        
        return {
          ...prev,
          selectedServices: updatedServices
        };
      }
    });
  };
    // Handle service quantity change - Improved version with validation
  const handleServiceQuantity = (serviceId, quantity) => {
    // Ensure quantity is valid - normalize to at least 1
    const validQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
    
    console.log(`Service quantity changed: service ID ${serviceId}, new quantity: ${validQuantity}`);
    
    setFormData(prev => {
      // Ensure selectedServices exists
      const selectedServices = prev.selectedServices || {};
      
      // Skip if service doesn't exist
      if (!selectedServices[serviceId]) {
        console.warn(`Attempted to update quantity for non-existent service: ${serviceId}`);
        return prev;
      }
      
      // Get the current service data
      const currentService = selectedServices[serviceId];
      
      // Update the quantity
      const updatedService = {
        ...currentService,
        quantity: validQuantity
      };
      
      // Calculate the updated price for this service
      const serviceTotal = validQuantity * updatedService.price;
      
      console.log(`Updated service: ${serviceId}, new quantity: ${validQuantity}, price per unit: ${updatedService.price}, total: ${serviceTotal}`);
      
      // Create new selectedServices object with the updated service
      const updatedServices = {
        ...selectedServices,
        [serviceId]: updatedService
      };
      
      console.log('Updated selectedServices after quantity change:', updatedServices);
      
      return {
        ...prev,
        selectedServices: updatedServices
      };
    });
  };
    // Calculate total price
  const calculateTotal = () => {
    // Calculate hall price
    const hallPrice = halls.find(hall => hall.ID_SanhTiec === parseInt(formData.hallId))?.GiaThue || 0;
    
    // Calculate services total
    let servicesTotal = 0;
    
    if (formData.selectedServices && Object.keys(formData.selectedServices).length > 0) {
      servicesTotal = Object.values(formData.selectedServices).reduce((acc, service) => {
        // Ensure price and quantity are valid numbers
        const price = Number(service.price) || 0;
        const quantity = Number(service.quantity) || 0;
        return acc + (price * quantity);
      }, 0);
    }
    
    const total = hallPrice + servicesTotal;
    console.log('Total calculation in hook:', { hallPrice, servicesTotal, total });
    
    return total;
  };
    // Submit booking
  const submitBooking = async () => {
    try {
      // Calculate the total before submitting
      const total = calculateTotal();      // Prepare services data with validation
      const selectedServices = formData.selectedServices || {};
      const servicesData = Object.entries(selectedServices)
        .filter(([_, details]) => details && details.quantity > 0) // Filter out invalid services
        .map(([serviceId, details]) => ({
          id: parseInt(serviceId),
          quantity: parseInt(details.quantity) || 1,
          price: Number(details.price) || 0
        }));
      
      console.log('Prepared services data:', servicesData);
        // Prepare booking data - ensure all fields have proper type conversion
      const bookingData = {
        customerName: formData.customerName || 'Khách hàng',
        phoneNumber: formData.phoneNumber || '0000000000',
        email: formData.email || 'customer@example.com',
        weddingDate: formatDateForAPI(formData.weddingDate),
        shiftId: parseInt(formData.shiftId),
        hallId: parseInt(formData.hallId),
        numberOfGuests: parseInt(formData.numberOfGuests) || 0,
        numberOfTables: parseInt(formData.numberOfTables) || 0,
        note: formData.note || '',
        services: servicesData,
        deposit: parseInt(formData.deposit) || Math.round(total * 0.5)
      };
      
      console.log('Submitting booking with data:', bookingData);
      
      const response = await BookingService.createBooking(bookingData);
      console.log('Booking successful, response:', response);
      
      return {
        success: true,
        data: {
          bookingId: response.ID_TiecCuoi,
          totalAmount: response.totalAmount,
          depositAmount: response.depositAmount
        }
      };
    } catch (err) {
      console.error('Error submitting booking:', err);
      return {
        success: false,
        error: err.message || 'Lỗi khi đặt tiệc. Vui lòng thử lại.'
      };
    }
  };
  
  return {
    formData,
    setFormData,
    halls,
    shifts,
    services,
    loading,
    error,
    handleInputChange,
    handleDateChange,
    handleHallSelect,
    handleServiceSelection,
    handleServiceQuantity,
    calculateTotal,
    submitBooking
  };
};

/**
 * Hook to fetch booking details for a specific booking ID
 */
export const useBookingDetails = (bookingId) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const result = await BookingService.getBookingById(bookingId);
        
        if (result && result.data) {
          const bookingData = result.data;
            // Map the booking data to a more readable format for the frontend
          setBooking({
            id: bookingData.ID_TiecCuoi,
            customerName: bookingData.TenKhachHang,
            TenKhachHang: bookingData.TenKhachHang,
            phoneNumber: bookingData.SoDienThoai,
            email: bookingData.Email || 'customer@example.com', // Default email if not available
            weddingDate: bookingData.NgayToChuc,
            hallName: bookingData.TenSanh,
            shiftName: bookingData.TenCa,
            tableCount: bookingData.SoLuongBan,
            reserveTableCount: bookingData.SoBanDuTru,
            totalCost: bookingData.TongTien || bookingData.GiaThue,
            deposit: bookingData.TienCoc,
            TrangThai: bookingData.TrangThai || 'Đã đặt',
            services: bookingData.services || []
          });
        } else {
          setError('Không thể tải thông tin đặt tiệc');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin đặt tiệc');
      } finally {
        setLoading(false);
      }
    };
    
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);
  
  return { booking, loading, error };
};