import React, { useState } from 'react';
import { Table, Badge, Button, Form, Row, Col, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/common/StatusComponents';
import { BookingCard } from '../components/common/BookingCards';
import { useBookings } from '../hooks/useBookings';
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
    fetchBookings
  } = useBookings();
  
  // State cho view mode (list/grid)
  const [viewMode, setViewMode] = useState('list');
  
  // Reference data
  const [halls, setHalls] = useState([]);
  
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
      
      {/* Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày tổ chức</Form.Label>
                <DatePicker
                  selected={filters.date ? new Date(filters.date) : null}
                  onChange={(date) => updateFilter('date', date)}
                  dateFormat="dd/MM/yyyy"
                  isClearable
                  placeholderText="Chọn ngày"
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Sảnh</Form.Label>
                <Form.Select
                  value={filters.hallId || ''}
                  onChange={(e) => updateFilter('hallId', e.target.value)}
                >
                  <option value="">Tất cả sảnh</option>
                  {halls.map(hall => (
                    <option key={hall.id} value={hall.id}>{hall.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={filters.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <div className="d-flex gap-2 mb-3">
                <Button variant="primary" onClick={applyFilters}>
                  Áp dụng
                </Button>
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Đặt lại
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* View mode switcher */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>Hiển thị {bookings.length} đặt tiệc</div>
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
      
      {/* Error message */}
      <ErrorMessage message={error} />
      
      {/* Loading indicator */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {bookings.length === 0 ? (
            <EmptyState message="Không tìm thấy đặt tiệc nào" />
          ) : viewMode === 'list' ? (
            /* List view */
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên chú rể</th>
                  <th>Tên cô dâu</th>
                  <th>Ngày tổ chức</th>
                  <th>Ca</th>
                  <th>Sảnh</th>
                  <th>Số bàn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.groomName}</td>
                    <td>{booking.brideName}</td>
                    <td>{new Date(booking.weddingDate).toLocaleDateString('vi-VN')}</td>
                    <td>{booking.shiftName}</td>
                    <td>{booking.hallName}</td>
                    <td>{booking.tableCount}</td>
                    <td>
                      <Badge bg={
                        booking.status === 'pending' ? 'warning' :
                        booking.status === 'confirmed' ? 'info' :
                        booking.status === 'completed' ? 'success' :
                        'danger'
                      }>
                        {booking.status === 'pending' ? 'Chờ xử lý' :
                         booking.status === 'confirmed' ? 'Đã xác nhận' :
                         booking.status === 'completed' ? 'Đã hoàn thành' :
                         'Đã hủy'}
                      </Badge>
                    </td>
                    <td>
                      <Link to={`/bookings/${booking.id}`}>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          Chi tiết
                        </Button>
                      </Link>
                      <Link to={`/bookings/${booking.id}/edit`}>
                        <Button variant="outline-secondary" size="sm">
                          Sửa
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            /* Grid view */
            <Row>
              {bookings.map(booking => (
                <Col key={booking.id} md={6} lg={4} className="mb-4">
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
