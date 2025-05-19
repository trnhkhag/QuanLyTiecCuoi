import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import HallService from '../services/HallService';
import { FormattedPrice } from '../components/common/StatusComponents';

/**
 * Trang danh sách sảnh tiệc
 */
function HallListPage() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch danh sách sảnh
    const fetchHalls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Sử dụng HallService thay vì axios trực tiếp
        const response = await HallService.getHalls();
        
        if (response.success) {
          setHalls(response.data || []);
        } else {
          setError('Không thể tải danh sách sảnh');
        }
      } catch (err) {
        console.error('Error fetching halls:', err);
        setError(err.message || 'Không thể tải danh sách sảnh tiệc. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHalls();
  }, []);

  if (loading) return (
    <Container className="py-4">
      <LoadingSpinner text="Đang tải danh sách sảnh..." />
    </Container>
  );
  
  if (error) return (
    <Container className="py-4">
      <ErrorMessage message={error} />
    </Container>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">Danh sách sảnh tiệc</h1>
      
      {halls.length === 0 ? (
        <div className="text-center py-5">
          <h3>Không có sảnh tiệc nào!</h3>
          <p className="text-muted">Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
        </div>
      ) : (
        <Row>
          {halls.map(hall => (
            <Col lg={4} md={6} className="mb-4" key={hall.ID_SanhTiec}>
              <Card className="h-100 shadow-sm">
                <Card.Img 
                    variant="top" 
                    src={hall.HinhAnh || `/assets/hall-${hall.ID_SanhTiec}.jpg`} 
                    alt={hall.TenSanh}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={e => { e.target.src = '/assets/hall-1.jpg' }}
                    />
                <Card.Body>
                  <Card.Title>{hall.TenSanh}</Card.Title>
                  <Card.Text>
                    <strong>Sức chứa:</strong> {hall.SucChua} khách<br />
                    <strong>Giá thuê:</strong> <FormattedPrice amount={hall.GiaThue} /><br />
                    <strong>Loại sảnh:</strong> {hall.TenLoai}
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
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default HallListPage;