import { useState, useEffect } from 'react';
import BookingService from '../services/BookingService';

/**
 * Custom hook để quản lý danh sách đặt tiệc
 * @param {Object} initialFilters - Các filter ban đầu (date, hallId, status)
 * @returns {Object} Dữ liệu và methods để quản lý đặt tiệc
 */
export function useBookings(initialFilters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Load danh sách đặt tiệc theo filters
  useEffect(() => {
    fetchBookings();
  }, []); // Chỉ fetch lần đầu, các lần sau qua applyFilters

  // Fetch bookings với filters
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await BookingService.getAllBookings(filters);
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt tiệc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật filters
  const updateFilter = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Áp dụng filters
  const applyFilters = () => {
    fetchBookings();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
    fetchBookings();
  };

  return {
    bookings,
    loading,
    error,
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    fetchBookings
  };
}

/**
 * Custom hook để quản lý chi tiết một đặt tiệc
 * @param {string|number} bookingId - ID của đặt tiệc
 * @returns {Object} Dữ liệu và methods để quản lý chi tiết đặt tiệc
 */
export function useBookingDetails(bookingId) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await BookingService.getBookingById(bookingId);
      setBooking(response.data);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Không thể tải thông tin đặt tiệc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const cancelBooking = async (reason) => {
    if (!bookingId) return { success: false, error: 'Không có mã đặt tiệc' };
    
    try {
      await BookingService.cancelBooking(bookingId, reason);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Không thể hủy đặt tiệc'
      };
    }
  };

  return {
    booking,
    loading,
    error,
    fetchBookingDetails,
    cancelBooking
  };
}

/**
 * Custom hook để quản lý form đặt tiệc
 * @param {Object} initialData - Dữ liệu ban đầu cho form
 * @returns {Object} Dữ liệu và methods để quản lý form đặt tiệc
 */
export function useBookingForm(initialData = {}) {
  const defaultFormData = {
    groomName: '',
    brideName: '',
    phoneNumber: '',
    email: '',
    weddingDate: null,
    shiftId: '',
    hallId: '',
    tableCount: 10,
    reserveTableCount: 2,
    deposit: 0,
    selectedFoods: [],
    selectedServices: [],
    ...initialData
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [halls, setHalls] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [foods, setFoods] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dữ liệu tham chiếu (halls, shifts, foods, services)
  useEffect(() => {
    const loadReferenceData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [hallsRes, shiftsRes, foodsRes, servicesRes] = await Promise.all([
          BookingService.getHalls(),
          BookingService.getShifts(),
          BookingService.getFoods(),
          BookingService.getServices()
        ]);

        setHalls(hallsRes.data);
        setShifts(shiftsRes.data);
        setFoods(foodsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  // Handlers for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      weddingDate: date
    }));
  };

  // Handle hall selection
  const handleHallSelect = (hallId) => {
    setFormData(prev => ({
      ...prev,
      hallId
    }));
    
    // Find the hall to get min/max tables
    const selectedHall = halls.find(h => h.id.toString() === hallId);
    if (selectedHall) {
      // Set table count to minimum if current is less than minimum
      if (formData.tableCount < selectedHall.minTables) {
        setFormData(prev => ({
          ...prev,
          tableCount: selectedHall.minTables
        }));
      }
    }
  };


  const handleServiceSelection = (serviceId) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.find(s => s.id === serviceId);
      if (isSelected) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(s => s.id !== serviceId)
        };
      } else {
        const service = services.find(s => s.id === serviceId);
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, {
            id: serviceId,
            quantity: 1,
            price: service.price
          }]
        };
      }
    });
  };

  const handleServiceQuantity = (serviceId, quantity) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(s => {
        if (s.id === serviceId) {
          return { ...s, quantity: parseInt(quantity) };
        }
        return s;
      })
    }));
  };

  // Calculate total cost
  const calculateTotal = () => {
    // Hall cost
    const selectedHall = halls.find(h => h.id.toString() === formData.hallId);
    const hallCost = selectedHall ? selectedHall.price : 0;
    
    // Food cost
    const foodCost = formData.selectedFoods.reduce((total, foodId) => {
      const food = foods.find(f => f.id === foodId);
      return total + (food ? food.pricePerTable * formData.tableCount : 0);
    }, 0);
    
    // Service cost
    const serviceCost = formData.selectedServices.reduce((total, service) => {
      return total + (service.price * service.quantity);
    }, 0);
    
    return hallCost + foodCost + serviceCost;
  };

  // Submit booking
  const submitBooking = async () => {
    try {
      // Format date
      const formattedDate = formData.weddingDate ? 
        formData.weddingDate.toISOString().split('T')[0] : null;
      
      // Prepare data
      const bookingData = {
        ...formData,
        weddingDate: formattedDate,
        shiftId: parseInt(formData.shiftId),
        hallId: parseInt(formData.hallId),
        tableCount: parseInt(formData.tableCount),
        reserveTableCount: parseInt(formData.reserveTableCount),
        deposit: parseInt(formData.deposit),
        selectedFoods: formData.selectedFoods.map(id => parseInt(id)),
        selectedServices: formData.selectedServices.map(service => ({
          serviceId: parseInt(service.id),
          quantity: service.quantity,
          price: service.price
        }))
      };
      
      const response = await BookingService.createBooking(bookingData);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error submitting booking:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt tiệc'
      };
    }
  };

  return {
    formData,
    halls,
    shifts,
    foods,
    services,
    loading,
    error,
    handleInputChange,
    handleDateChange,
    handleHallSelect,
    handleServiceSelection,
    handleServiceQuantity,
    calculateTotal,
    submitBooking,
    setFormData
  };
}
