import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Layout chung cho các nội dung trong ứng dụng đặt tiệc
 * Chỉ bọc content, không bọc header và footer (đã thêm trong BookingRoutes)
 */
function BookingLayout({ children }) {
  return (
    <Container className="py-4">
      {children}
    </Container>
  );
}

export default BookingLayout;
