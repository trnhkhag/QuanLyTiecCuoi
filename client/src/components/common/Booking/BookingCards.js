import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormattedPrice, FormattedDate } from '../StatusComponents';

/**
 * Component hiển thị thông tin đặt tiệc dạng card
 */
export function BookingCard({ booking }) {
  // Map booking status to Bootstrap variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };
  
  // Map booking status to display text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };
  
  return (
    <Card className="mb-3 booking-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Đặt tiệc #{booking.id}</span>
        <Badge bg={getStatusVariant(booking.status)}>
          {getStatusText(booking.status)}
        </Badge>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <Card.Title>{booking.groomName} & {booking.brideName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              <FormattedDate date={booking.weddingDate} /> - {booking.shiftName}
            </Card.Subtitle>
          </div>
          <div className="text-end">
            <Card.Text className="fw-bold text-primary">
              <FormattedPrice amount={booking.totalCost} />
            </Card.Text>
            <Card.Text className="small">
              Đặt cọc: <FormattedPrice amount={booking.deposit} />
            </Card.Text>
          </div>
        </div>
        <Card.Text>
          <strong>Sảnh:</strong> {booking.hallName}<br />
          <strong>Số lượng bàn:</strong> {booking.tableCount} bàn chính + {booking.reserveTableCount} bàn dự trữ
        </Card.Text>
        <div className="d-flex justify-content-end">
          <Link to={`/bookings/${booking.id}`} className="btn btn-outline-primary btn-sm">
            Xem chi tiết
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
