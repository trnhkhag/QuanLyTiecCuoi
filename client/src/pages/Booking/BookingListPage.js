import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import BookingLayout from '../../components/layout/Booking/BookingLayout';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/common/StatusComponents';
import { BookingCard } from '../../components/common/Booking/BookingCards';
import { useBookingForm } from '../../hooks/Booking/useBookings';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Trang hiển thị danh sách đặt tiệc (cho nhân viên)
 */
function BookingListPage() {
  // Sử dụng custom hook để quản lý danh sách đặt tiệc
  const {
    bookings,
    loading,
    error,
    filters,
    updateFilter,
    applyFilters,
    resetFilters,
    fetchBookings,
    checkApiConnection
  } = useBookingForm();
  
  // State cho view mode (list/grid)
  const [viewMode, setViewMode] = useState('list');
  
  // State cho thông tin kết nối API
  const [apiStatus, setApiStatus] = useState({
    checked: false,
    connected: true
  });
  
  // Kiểm tra kết nối API khi gặp lỗi
  useEffect(() => {
    if (error) {
      checkApiStatus();
    }
  }, [error]);
  
  // Hàm kiểm tra kết nối API
  const checkApiStatus = async () => {
    const isConnected = await checkApiConnection();
    setApiStatus({
      checked: true,
      connected: isConnected
    });
  };
  
  // Hàm thử tải lại dữ liệu
  const handleRetry = () => {
    fetchBookings();
  };

  // Hàm xử lý hiển thị lỗi với các tùy chọn phù hợp
  const renderError = () => {
    if (!error) return null;
    
    return (
      <Alert variant="danger" className="mb-4">
        <Alert.Heading>Không thể tải danh sách tiệc cưới</Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={handleRetry} variant="outline-danger">
            <i className="bi bi-arrow-clockwise me-1"></i> Thử lại
          </Button>
        </div>
      </Alert>
    );
  };
  
  // Format date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };
  
  // Format datetime to locale string
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <BookingLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Danh Sách Đặt Tiệc Cưới</h1>
        <Link to="/booking/new">
          <Button variant="primary">
            <i className="bi bi-plus"></i> Đặt tiệc mới
          </Button>
        </Link>
      </div>
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {renderError()}
      
      {/* Hiển thị cảnh báo nếu không kết nối được API */}
      {apiStatus.checked && !apiStatus.connected && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading>Không thể kết nối đến server</Alert.Heading>
          <p>Vui lòng kiểm tra kết nối mạng và đảm bảo server đang hoạt động.</p>
        </Alert>
      )}
      
      {/* Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày tổ chức</Form.Label>
                <DatePicker selected={filters && filters.date ? new Date(filters.date) : null}
                  onChange={(date) => updateFilter('date', date)}
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  placeholderText="Chọn ngày"
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tên khách hàng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên khách hàng"
                  value={filters?.customerName || ''}
                  onChange={(e) => updateFilter('customerName', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={filters?.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chưa thanh toán còn lại</option>
                  <option value="completed">Đã thanh toán</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12} className="d-flex justify-content-end">
              <div className="d-flex gap-2 mb-3">
                <Button variant="primary" onClick={applyFilters}>
                  <i className="bi bi-search me-1"></i> Tìm kiếm
                </Button>
                <Button variant="outline-secondary" onClick={resetFilters}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i> Đặt lại
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* View mode switcher */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>Hiển thị {bookings?.length || 0} đặt tiệc</div>
        <div className="btn-group" role="group">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('list')}
          >
            <i className="bi bi-list"></i> Danh sách
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('grid')}
          >
            <i className="bi bi-grid"></i> Lưới
          </Button>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {bookings?.length === 0 && !error ? (
            <EmptyState message="Không tìm thấy đặt tiệc nào" />
          ) : viewMode === 'list' ? (
            /* List view */
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Tiệc</th>
                  <th>Tên khách hàng</th>
                  <th>Ngày tổ chức</th>
                  <th>Ca tiệc</th>
                  <th>Thời điểm đặt</th>
                  <th>Số bàn chính</th>
                  <th>Số bàn dự trữ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map(booking => (
                  <tr key={booking.id || booking.ID_TiecCuoi}>
                    <td>{booking.ID_TiecCuoi || booking.id}</td>
                    <td>{booking.TenKhachHang || 'N/A'}</td>
                    <td>{formatDate(booking.NgayToChuc || booking.weddingDate)}</td>
                    <td>{booking.TenCa || 'Ca ' + (booking.ID_Ca || 'N/A')}</td>
                    <td>{formatDateTime(booking.ThoiDiemDat || booking.bookingDate)}</td>
                    <td>{booking.SoLuongBan || 0}</td>
                    <td>{booking.SoBanDuTru || 0}</td>
                    <td>
                      <Badge bg={
                        (booking.TrangThai === 'Đã thanh toán' || booking.status === 'completed') ? 'success' : 'warning'
                      }>
                        {booking.TrangThai === 'Đã thanh toán' ? 'Đã thanh toán' : 'Chưa thanh toán còn lại'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            /* Grid view */
            <Row>
              {bookings.map(booking => (
                <Col key={booking.ID_TiecCuoi || booking.id} md={6} lg={4} className="mb-4">
                  <BookingCard booking={booking} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </BookingLayout>
  );
}

export default BookingListPage;
