import React from 'react';
import { Container } from 'react-bootstrap';

/**
 * Component Footer cho trang đặt tiệc
 */
function BookingFooter() {
  return (
    <footer className="py-4 bg-light mt-5">
      <Container>
        <div className="text-center">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} Hệ thống Quản lý Tiệc Cưới
          </p>
          <p className="text-muted small">
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh<br />
            Hotline: 0123 456 789 | Email: info@tieccuoi.example.com
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default BookingFooter;
