import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Table } from 'react-bootstrap';
import { LoadingSpinner, ErrorMessage, FormattedPrice } from '../components/common/StatusComponents';
import HallService from '../services/HallService';

/**
 * Trang chi tiết sảnh tiệc
 */
function HallDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHallDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Sử dụng HallService thay vì axios trực tiếp
        const response = await HallService.getHallById(id);
        
        if (response.success) {
          setHall(response.data);
        } else {
          setError('Không thể tải thông tin sảnh');
        }
      } catch (err) {
        console.error(`Error fetching hall with id ${id}:`, err);
        setError(err.message || 'Không thể tải thông tin chi tiết sảnh tiệc.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHallDetails();
  }, [id]);

  const handleBooking = () => {
    navigate(`/booking/new?hallId=${id}`);
  };

  if (loading) return (
    <Container className="py-4">
      <LoadingSpinner text="Đang tải thông tin sảnh..." />
    </Container>
  );
  
  if (error) return (
    <Container className="py-4">
      <ErrorMessage message={error} />
    </Container>
  );

  if (!hall) return (
    <Container className="py-4">
      <ErrorMessage message="Không tìm thấy thông tin sảnh" variant="warning" />
    </Container>
  );

  return (
    <Container className="py-4">
      <h1 className="mb-4">{hall.TenSanh}</h1>
      
      <Row className="mb-4">
        <Col md={8}>
          {/* Thay thế đoạn kiểm tra hall.images bằng hiển thị ảnh từ thư mục assets */}
          <div className="bg-light text-center p-5 rounded">
            <img
              src={`/assets/hall-${hall.ID_SanhTiec}.jpg`}
              alt={hall.TenSanh}
              className="img-fluid"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              onError={e => { e.target.src = '/assets/hall-1.jpg' }}
            />
          </div>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Thông tin sảnh</Card.Header>
            <Card.Body>
              <Table borderless>
                <tbody>
                  <tr>
                    <td>Loại sảnh:</td>
                    <td>{hall.TenLoai}</td>
                  </tr>
                  <tr>
                    <td>Sức chứa:</td>
                    <td>{hall.SucChua} khách</td>
                  </tr>
                  <tr>
                    <td>Số bàn tối đa:</td>
                    <td>{Math.floor(hall.SucChua / 10) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Số bàn tối thiểu:</td>
                    <td>{Math.floor(hall.SucChua / 20) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Giá thuê:</td>
                    <td><FormattedPrice amount={hall.GiaThue} /></td>
                  </tr>
                </tbody>
              </Table>
              
              <Button 
                variant="primary"
                className="w-100 mt-3"
                onClick={handleBooking}
              >
                Đặt tiệc tại sảnh này
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Header as="h5">Mô tả</Card.Header>
        <Card.Body>
          {hall.MoTa ? (
            <div dangerouslySetInnerHTML={{ __html: hall.MoTa }} />
          ) : (
            <p className="text-muted">Không có mô tả chi tiết.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HallDetailPage;