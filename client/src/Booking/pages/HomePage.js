import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import { HallCard } from '../components/common/HallCard';
import HallService from '../services/HallService';

/**
 * Trang chủ hiển thị danh sách sảnh tiệc và hướng dẫn đặt tiệc
 */
function HomePage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch danh sách các sảnh tiệc
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await HallService.getHalls();
        setHalls(response.data);
      } catch (err) {
        console.error('Error fetching halls:', err);
        setError('Không thể tải danh sách sảnh tiệc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHalls();
  }, []);
  
  // Hiển thị loading khi đang tải dữ liệu
  if (loading) return (
    <BookingLayout>
      <LoadingSpinner text="Đang tải dữ liệu sảnh tiệc..." />
    </BookingLayout>
  );
  
  // Chỉ lấy 3 sảnh đầu tiên để hiển thị
  const featuredHalls = halls.slice(0, 3);
  
  return (
    <BookingLayout>
      {/* Banner chính */}
      <div className="bg-primary text-white p-5 rounded mb-5 text-center">
        <h1 className="display-4">Đặt Tiệc Cưới</h1>
        <p className="lead">
          Hãy để chúng tôi giúp bạn tạo nên ngày cưới hoàn hảo
        </p>
        <Link to="/booking/new">
          <Button size="lg" variant="light">Đặt tiệc ngay</Button>
        </Link>
      </div>
      
      {/* Hiển thị lỗi nếu có */}
      <ErrorMessage message={error} />
      
      {/* Danh sách sảnh tiệc nổi bật (chỉ 3 sảnh) */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Sảnh tiệc nổi bật</h2>
          <Link to="/booking/halls">
            <Button variant="outline-primary">Xem tất cả sảnh tiệc</Button>
          </Link>
        </div>
        
        {featuredHalls.length > 0 ? (
          <Row>
            {featuredHalls.map(hall => (
              <Col key={hall.ID_SanhTiec} md={4} className="mb-4">
                <HallCard hall={hall} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-4 bg-light rounded">
            <p className="mb-0">Chưa có sảnh tiệc nào. Vui lòng thử lại sau.</p>
          </div>
        )}
      </div>
      
      {/* Các bước đặt tiệc */}
      <h2 className="mb-4 mt-5">Quy trình đặt tiệc</h2>
      <Row>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-primary">1</div>
              <Card.Title>Chọn sảnh</Card.Title>
              <Card.Text>
                Lựa chọn sảnh tiệc phù hợp với số lượng khách và ngân sách
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-primary">2</div>
              <Card.Title>Chọn thực đơn</Card.Title>
              <Card.Text>
                Lựa chọn các món ăn đa dạng từ thực đơn phong phú của chúng tôi
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-primary">3</div>
              <Card.Title>Chọn dịch vụ</Card.Title>
              <Card.Text>
                Bổ sung các dịch vụ kèm theo như trang trí, âm nhạc, chụp ảnh
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <div className="display-4 mb-3 text-primary">4</div>
              <Card.Title>Xác nhận đặt tiệc</Card.Title>
              <Card.Text>
                Thanh toán đặt cọc và nhận xác nhận đặt tiệc
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Call to action */}
      <div className="text-center mt-5">
        <Link to="/booking/new">
          <Button size="lg" variant="primary">Đặt tiệc ngay</Button>
        </Link>
      </div>
    </BookingLayout>
  );
}

export default HomePage;