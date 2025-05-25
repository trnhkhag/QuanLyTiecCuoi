import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormattedPrice, FormattedDate } from '../StatusComponents';

/**
 * Component hiển thị thông tin đặt tiệc dạng card
 */
export function BookingCard({ booking }) {
  // Format date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return dateString;
    }
  };

  // Trạng thái biểu thị bằng màu sắc
  const getStatusBg = (status) => {
    if (status === 'Đã thanh toán') return 'success';
    return 'warning';
  };
  
  // ID đặt tiệc
  const bookingId = booking.ID_TiecCuoi || booking.id || 'N/A';
  
  // Tên khách hàng
  const customerName = booking.HoTen || 'N/A';
  
  // Ngày tổ chức
  const weddingDate = booking.NgayToChuc || booking.weddingDate;
  
  // Tên ca tiệc
  const shiftName = booking.TenCa || 'Ca ' + (booking.ID_Ca || 'N/A');
  
  // Sảnh tiệc
  const hallName = booking.TenSanh || 'N/A';
  
  // Số bàn
  const tables = booking.SoLuongBan || 0;
  const reserveTables = booking.SoBanDuTru || 0;
  
  // Trạng thái
  const status = booking.TrangThai || 'Chưa thanh toán còn lại';
  
  return (
    <Card className="mb-3 booking-card h-100 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Mã đặt tiệc: #{bookingId}</span>
        <Badge bg={getStatusBg(status)}>
          {status}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Title className="mb-2">{customerName}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          {formatDate(weddingDate)} - {shiftName}
        </Card.Subtitle>
        
        <Card.Text>
          <strong>Sảnh:</strong> {hallName}<br />
          <strong>Số bàn chính:</strong> {tables}<br />
          <strong>Số bàn dự trữ:</strong> {reserveTables}
        </Card.Text>
        
        {/* <div className="d-flex justify-content-end mt-auto">
          <Link to={`/booking/weddings/${bookingId}`} className="btn btn-outline-primary btn-sm">
            Xem chi tiết
          </Link>
        </div> */}
      </Card.Body>
    </Card>
  );
}
