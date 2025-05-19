import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import BookingBasicInfo from '../components/features/BookingBasicInfo';
import ServiceSelection from '../components/features/ServiceSelection';
import BookingSummary from '../components/features/BookingSummary';
import { useBookingForm } from '../hooks/useBookings';

/**
 * Trang đặt tiệc mới
 */
function BookingFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedHallId = searchParams.get('hallId');
  
  // Tab hiện tại
  const [activeTab, setActiveTab] = useState('basic');
  
  // Lấy dữ liệu form từ custom hook
  const {
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
  } = useBookingForm({
    hallId: preSelectedHallId || ''
  });
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.groomName || !formData.brideName || !formData.phoneNumber ||
        !formData.weddingDate || !formData.shiftId || !formData.hallId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    const result = await submitBooking();
    
    if (result.success) {
      navigate(`/booking/success/${result.data.bookingId}`);
    } else {
      alert(`Lỗi: ${result.error}`);
    }
  };
  
  if (loading) return (
    <BookingLayout>
      <LoadingSpinner text="Đang tải dữ liệu..." />
    </BookingLayout>
  );
  
  return (
    <BookingLayout>
      <h1 className="mb-4 text-center">Đặt Tiệc Cưới</h1>
      
      {error && <ErrorMessage message={error} />}
      
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
                    className={`nav-link ${activeTab === 'food' ? 'active' : ''}`}
                    onClick={() => setActiveTab('food')}
                    style={{ cursor: 'pointer' }}
                  >
                    2. Chọn món ăn
                  </div>
                  <div 
                    className={`nav-link ${activeTab === 'service' ? 'active' : ''}`}
                    onClick={() => setActiveTab('service')}
                    style={{ cursor: 'pointer' }}
                  >
                    3. Dịch vụ bổ sung
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
                      onClick={() => setActiveTab(prev => 
                        prev === 'food' ? 'basic' : 
                        prev === 'service' ? 'food' : 
                        'basic'
                      )}
                    >
                      Quay lại
                    </Button>
                  )}
                  
                  {activeTab !== 'service' && (
                    <Button 
                      variant="primary"
                      onClick={() => setActiveTab(prev => 
                        prev === 'basic' ? 'food' : 
                        prev === 'food' ? 'service' : 
                        'service'
                      )}
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
                  foods={foods}
                  calculateTotal={calculateTotal}
                  deposit={formData.deposit}
                  handleDepositChange={(e) => handleInputChange({
                    target: { name: 'deposit', value: e.target.value }
                  })}
                />
                
                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100 mt-3"
                  size="lg"
                >
                  Xác nhận đặt tiệc
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
