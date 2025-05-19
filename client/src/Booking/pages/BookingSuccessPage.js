import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, FormattedPrice } from '../components/common/StatusComponents';
import { useBookingDetails } from '../hooks/useBookings';

/**
 * Trang xác nhận đặt tiệc thành công
 */
function BookingSuccessPage() {
  const { id } = useParams();
  const { booking, loading, error } = useBookingDetails(id);
  
  if (loading) return (
    <BookingLayout>
      <LoadingSpinner text="Đang tải thông tin đặt tiệc..." />
    </BookingLayout>
  );
  
  if (error) return (
    <BookingLayout>
      <Alert variant="danger">{error}</Alert>
    </BookingLayout>
  );
  
  if (!booking) return (
    <BookingLayout>
      <Alert variant="warning">Không tìm thấy thông tin đặt tiệc</Alert>
    </BookingLayout>
  );
  
  return (
    <BookingLayout>      <div className="text-center mb-5">
        <div className="display-1 text-success mb-3">✓</div>
        <h1 className="mb-3">Đặt Tiệc Thành Công</h1>
        <div className="alert alert-success py-2 w-75 mx-auto">
          Trạng thái: <strong>{booking.TrangThai || 'Đã đặt'}</strong>
        </div>
        <p className="lead mt-3">
          Cảm ơn bạn đã đặt tiệc cưới tại Hệ thống Quản lý Tiệc Cưới
        </p>
      </div>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Thông tin đặt tiệc #{booking.id}</Card.Header>
            <Card.Body>              
              <Row>                <Col md={6}>
                  <h6>Thông tin người đặt</h6>
                  <p>
                    <strong>Họ tên:</strong> {booking.TenKhachHang || booking.customerName}<br />
                    <strong>Số điện thoại:</strong> {booking.phoneNumber}<br />
                    <strong>Email:</strong> {booking.email}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin tiệc cưới</h6>
                  <p>                    <strong>Ngày tổ chức:</strong> {new Date(booking.weddingDate).toLocaleDateString('vi-VN')}<br />
                    <strong>Ca:</strong> {booking.shiftName}<br />
                    <strong>Sảnh:</strong> {booking.hallName}<br />
                    <strong>Trạng thái:</strong> <span className="badge bg-success rounded-pill ms-1">{booking.TrangThai || 'Đã đặt'}</span>
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6>Chi tiết đặt tiệc</h6>
                  <p>
                    <strong>Số lượng bàn:</strong> {booking.tableCount} bàn chính + {booking.reserveTableCount} bàn dự trữ<br />
                    <strong>Số dịch vụ:</strong> {booking.services?.length || 0} dịch vụ
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <h6>Tổng chi phí dự kiến:</h6>
                      <h4 className="text-primary mb-0">
                        <FormattedPrice amount={booking.totalCost} />
                      </h4>
                    </div>
                    <div className="text-end">
                      <h6>Đã đặt cọc:</h6>
                      <h4 className="text-success mb-0">
                        <FormattedPrice amount={booking.deposit} />
                      </h4>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
            <Card className="mb-4">
            <Card.Header as="h5">Các bước tiếp theo</Card.Header>
            <Card.Body>
              <div className="alert alert-info mb-3">
                <small><strong>Thông tin trạng thái:</strong> Đơn đặt tiệc của bạn hiện có trạng thái <strong>{booking.TrangThai || 'Đã đặt'}</strong>. 
                Trạng thái sẽ được cập nhật khi nhân viên xác nhận và khi bạn hoàn tất thanh toán.</small>
              </div>
              <ol>
                <li className="mb-2">
                  Nhân viên của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đặt tiệc.
                </li>
                <li className="mb-2">
                  Vui lòng thanh toán đặt cọc trong vòng 3 ngày để giữ sảnh.
                </li>
                <li className="mb-2">
                  Trước ngày tiệc 1 tháng, bạn cần xác nhận số lượng bàn chính thức và thanh toán phần còn lại.
                </li>
                <li>
                  Thông tin chi tiết đã được gửi vào email của bạn (nếu có cung cấp).
                </li>
              </ol>
              
              <div className="mt-4">
                <h6>Thông tin liên hệ:</h6>
                <p>
                  Hotline: 0123 456 789<br />
                  Email: info@tieccuoi.example.com
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/">
              <Button variant="outline-primary">Về trang chủ</Button>
            </Link>
            <Link to={`/bookings/${booking.id}`}>
              <Button variant="primary">Xem chi tiết đặt tiệc</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </BookingLayout>
  );
}

export default BookingSuccessPage;
