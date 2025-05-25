import React, { useState, useEffect, useCallback } from 'react';
import { Table, Badge, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import BookingLayout from '../../components/layout/Booking/BookingLayout';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/common/StatusComponents';
import { BookingCard } from '../../components/common/Booking/BookingCards';
import weddingBookingService from '../../services/weddingBookingService';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Trang hiển thị danh sách đặt tiệc (cho nhân viên)
 */
function BookingListPage() {
  // State cho dữ liệu và loading
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    date: null,
    customerName: '',
    status: ''
  });
  
  // State cho view mode (list/grid)
  const [viewMode, setViewMode] = useState('list');
  
  // Hàm fetch dữ liệu từ API với debounce
  const fetchBookings = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Chuẩn bị params cho API
      const params = {
        ...currentFilters,
        date: currentFilters.date ? currentFilters.date.toISOString().split('T')[0] : undefined,
        customerName: currentFilters.customerName.trim() || undefined,
        status: currentFilters.status || undefined
      };
      
      const response = await weddingBookingService.getAllBookings(params);
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách tiệc cưới');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dữ liệu lần đầu
  useEffect(() => {
    fetchBookings(filters);
  }, [fetchBookings]);

  // Hàm cập nhật filter với debounce cho tìm kiếm tên
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [field]: value
      };
      
      // Nếu là thay đổi tên khách hàng, đợi người dùng gõ xong
      if (field === 'customerName') {
        const timeoutId = setTimeout(() => {
          fetchBookings(newFilters);
        }, 500); // Debounce 500ms
        
        return newFilters;
      }
      
      // Các filter khác thì gọi API ngay
      fetchBookings(newFilters);
      return newFilters;
    });
  }, [fetchBookings]);

  // Hàm reset filter
  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      date: null,
      customerName: '',
      status: ''
    };
    setFilters(resetFilters);
    fetchBookings(resetFilters);
  }, [fetchBookings]);

  // Hàm cập nhật trạng thái thanh toán
  const handleUpdateStatus = async (bookingId, isFullyPaid) => {
    try {
      await weddingBookingService.updateBookingStatus(bookingId, isFullyPaid);
      // Refresh danh sách sau khi cập nhật
      fetchBookings(filters);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
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

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Bộ lọc */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>Ngày tổ chức</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <DatePicker
                    selected={filters.date}
                    onChange={(date) => handleFilterChange('date', date)}
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    placeholderText="Chọn ngày"
                    className="form-control"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tên khách hàng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên khách hàng"
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange('customerName', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chưa thanh toán còn lại</option>
                  <option value="completed">Đã thanh toán</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={12} className="d-flex justify-content-end mt-2">
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => fetchBookings(filters)}>
                  <i className="bi bi-search me-1"></i> Tìm kiếm
                </Button>
                <Button variant="outline-secondary" onClick={handleResetFilters}>
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
        <div className="btn-group">
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
          {bookings?.length === 0 ? (
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
                  {/* <th>Thao tác</th> */}
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.ID_TiecCuoi}>
                    <td>{booking.ID_TiecCuoi}</td>
                    <td>{booking.HoTen || 'N/A'}</td>
                    <td>{formatDate(booking.NgayToChuc)}</td>
                    <td>{booking.TenCa || 'Ca ' + booking.ID_Ca}</td>
                    <td>{formatDate(booking.ThoiDiemDat)}</td>
                    <td>{booking.SoLuongBan}</td>
                    <td>{booking.SoBanDuTru}</td>
                    <td>
                      <Badge bg={booking.TrangThai === 'Đã thanh toán' ? 'success' : 'warning'}>
                        {booking.TrangThai}
                      </Badge>
                    </td>
                    {/* <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          as={Link}
                          to={`/booking/${booking.ID_TiecCuoi}`}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleUpdateStatus(booking.ID_TiecCuoi, true)}
                          disabled={booking.TrangThai === 'Đã thanh toán'}
                        >
                          <i className="bi bi-check-circle"></i>
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleUpdateStatus(booking.ID_TiecCuoi, false)}
                          disabled={booking.TrangThai === 'Chưa thanh toán còn lại'}
                        >
                          <i className="bi bi-x-circle"></i>
                        </Button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            /* Grid view */
            <Row>
              {bookings.map(booking => (
                <Col key={booking.ID_TiecCuoi} md={6} lg={4} className="mb-4">
                  <BookingCard 
                    booking={booking}
                    onUpdateStatus={handleUpdateStatus}
                  />
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
