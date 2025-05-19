import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import BookingBasicInfo from '../components/features/BookingBasicInfo';
import ServiceSelection from '../components/features/ServiceSelection';
import BookingSummary from '../components/features/BookingSummary';
import { useBookingForm } from '../hooks/useBookings';
import HallService from '../services/HallService';
import ServiceService from '../services/ServiceService';
import { FormattedPrice } from '../components/common/StatusComponents';

/**
 * Trang đặt tiệc mới
 */
function BookingFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedHallId = searchParams.get('hallId');
  
  // Tab hiện tại
  const [activeTab, setActiveTab] = useState('basic');
  
  // State cho sảnh được chọn
  const [selectedHall, setSelectedHall] = useState(null);
  const [loadingHall, setLoadingHall] = useState(!!preSelectedHallId);
  
  // Lấy dữ liệu form từ custom hook
  const {
    formData,
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
    submitBooking,
    setFormData
  } = useBookingForm({
    hallId: preSelectedHallId || ''
  });
  
  // Fetch thông tin sảnh nếu có preSelectedHallId
  useEffect(() => {
    const fetchSelectedHall = async () => {
      if (preSelectedHallId) {
        try {
          setLoadingHall(true);
          const hallData = await HallService.getHallById(preSelectedHallId);
          setSelectedHall(hallData);
          
          // Cập nhật formData với thông tin sảnh
          setFormData(prev => ({
            ...prev,
            hallId: preSelectedHallId
          }));
        } catch (err) {
          console.error('Error fetching hall details:', err);
        } finally {
          setLoadingHall(false);
        }
      }
    };
    
    fetchSelectedHall();
  }, [preSelectedHallId]);
    // State for error messages and loading status
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);
      // Validation
    if (!formData.customerName || !formData.phoneNumber ||
        !formData.weddingDate || !formData.shiftId || !formData.hallId) {
      setSubmissionError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    try {
      setSubmitting(true);
      const result = await submitBooking();
      
      if (result.success) {
        navigate(`/booking/success/${result.data.bookingId}`);
      } else {
        setSubmissionError(result.error || 'Đã xảy ra lỗi khi đặt tiệc. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmissionError('Lỗi kết nối: ' + (error.message || 'Không thể kết nối đến máy chủ'));
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading || loadingHall) return (
    <BookingLayout>
      <LoadingSpinner text="Đang tải dữ liệu..." />
    </BookingLayout>
  );
  
  return (
    <BookingLayout>
      <h1 className="mb-4 text-center">Đặt Tiệc Cưới</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {preSelectedHallId && selectedHall && (
        <Alert variant="info" className="mb-4">
          <h5>Sảnh đã chọn: {selectedHall.TenSanh}</h5>
          <p className="mb-0">
            <strong>Sức chứa:</strong> {selectedHall.SucChua} khách | 
            <strong> Giá thuê:</strong> <FormattedPrice amount={selectedHall.GiaThue} /> | 
            <strong> Loại sảnh:</strong> {selectedHall.TenLoai}
          </p>
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <nav className="nav nav-tabs card-header-tabs">
                  <div 
                    className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                    style={{ cursor: 'pointer' }}
                  >
                    1. Thông tin cơ bản
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'service' ? 'active' : ''}`}
                    onClick={() => setActiveTab('service')}
                    style={{ cursor: 'pointer' }}
                  >
                    2. Dịch vụ bổ sung
                  </div>
                </nav>
              </Card.Header>
              
              <Card.Body>
                {activeTab === 'basic' && (
                  <BookingBasicInfo
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleDateChange={handleDateChange}
                    shifts={shifts}
                    halls={halls}
                    handleHallSelect={handleHallSelect}
                    preSelectedHallId={preSelectedHallId}
                    selectedHall={selectedHall}
                  />
                )}
                
                {activeTab === 'service' && (
                  <ServiceSelection
                    services={services}
                    selectedServices={formData.selectedServices}
                    handleServiceSelection={handleServiceSelection}
                    handleServiceQuantity={handleServiceQuantity}
                  />
                )}
                
                <div className="d-flex justify-content-between mt-4">
                  {activeTab !== 'basic' && (
                    <Button 
                      variant="outline-secondary"
                      onClick={() => setActiveTab('basic')}
                    >
                      Quay lại
                    </Button>
                  )}
                  
                  {activeTab !== 'service' && (
                    <Button 
                      variant="primary"
                      onClick={() => setActiveTab('service')}
                      className="ms-auto"
                    >
                      Tiếp theo
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4 position-sticky" style={{top: '20px'}}>
              <Card.Header as="h5">Tóm tắt đơn đặt tiệc</Card.Header>
              <Card.Body>
                <BookingSummary
                  formData={formData}
                  halls={halls}
                  selectedHall={selectedHall}
                  calculateTotal={calculateTotal}
                  deposit={formData.deposit}
                  handleDepositChange={(e) => handleInputChange({
                    target: { name: 'deposit', value: e.target.value }
                  })}
                />
                  {submissionError && (
                  <Alert variant="danger" className="mt-3 mb-0">
                    {submissionError}
                  </Alert>
                )}
                
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 mt-3"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Đang xử lý...' : 'Xác nhận đặt tiệc'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </BookingLayout>
  );
}

export default BookingFormPage;