import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormattedPrice } from './StatusComponents';

/**
 * Card hiển thị thông tin sảnh tiệc
 */
export function HallCard({ hall }) {
  // Log để kiểm tra dữ liệu hall
  console.log('Hall data in card:', hall);
  // Hàm tạo đường dẫn ảnh dựa trên ID sảnh
  const getHallImagePath = (hallId) => {
    return `/assets/hall-${hallId}.jpg`;
  };
  
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={hall.HinhAnh || getHallImagePath(hall.ID_SanhTiec)}
        alt={hall.TenSanh}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={e => { e.target.src = '/images/halls/default-hall.jpg' }}
      />
      <Card.Body>
        <Card.Title>{hall.TenSanh || 'Tên sảnh'}</Card.Title>
        <Card.Text>
          <strong>Sức chứa:</strong> {hall.SucChua || '0'} khách<br />
          <strong>Giá thuê:</strong> <FormattedPrice amount={hall.GiaThue} /><br />
          <strong>Loại sảnh:</strong> {hall.TenLoai || 'Chưa có thông tin'}
        </Card.Text>
        
        <div className="d-flex justify-content-between mt-3">
          <Link to={`/booking/halls/${hall.ID_SanhTiec}`}>
            <Button variant="outline-primary">Chi tiết</Button>
          </Link>
          <Link to={`/booking/new?hallId=${hall.ID_SanhTiec}`}>
            <Button variant="primary">Đặt tiệc</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

/**
 * Card hiển thị dịch vụ
 */
export function ServiceCard({ service }) {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={service.HinhAnh || '/images/services/default.jpg'} 
        alt={service.TenDichVu}
        style={{ height: '160px', objectFit: 'cover' }}
        onError={e => { e.target.src = '/images/services/default.jpg' }}
      />
      <Card.Body>
        <Card.Title>{service.TenDichVu}</Card.Title>
        <Card.Text>
          <strong>Giá:</strong> <FormattedPrice amount={service.DonGia} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
}