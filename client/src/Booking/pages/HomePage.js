import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Carousel } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarOutlined,
  ShopOutlined,
  HeartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import UserLayout from '../components/layout/UserLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import { HallCard } from '../components/common/HallCard';
import HallService from '../services/HallService';

/**
 * Trang chủ hiển thị danh sách sảnh tiệc và hướng dẫn đặt tiệc
 */
function HomePage() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const carouselImages = [
    '/assets/hall-1.jpg',
    '/assets/hall-2.jpg',
    '/assets/hall-3.jpg',
    '/assets/hall-4.jpg',
  ];

  const features = [
    {
      icon: <ShopOutlined style={{ fontSize: '32px' }} />,
      title: 'Sảnh Tiệc Sang Trọng',
      description: 'Đa dạng không gian sảnh tiệc với thiết kế hiện đại và sang trọng'
    },
    {
      icon: <HeartOutlined style={{ fontSize: '32px' }} />,
      title: 'Dịch Vụ Chuyên Nghiệp',
      description: 'Đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ'
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '32px' }} />,
      title: 'Đặt Tiệc Dễ Dàng',
      description: 'Quy trình đặt tiệc đơn giản, nhanh chóng qua hệ thống trực tuyến'
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '32px' }} />,
      title: 'Cam Kết Chất Lượng',
      description: 'Đảm bảo chất lượng dịch vụ và sự hài lòng của khách hàng'
    }
  ];

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
    <UserLayout>
      <LoadingSpinner text="Đang tải dữ liệu sảnh tiệc..." />
    </UserLayout>
  );
  
  // Chỉ lấy 3 sảnh đầu tiên để hiển thị
  const featuredHalls = halls.slice(0, 3);
  
  return (
    <UserLayout>
      <div style={{ margin: '-24px' }}>
        <Carousel autoplay effect="fade">
          {carouselImages.map((image, index) => (
            <div key={index}>
              <div style={{
                height: '500px',
                color: '#fff',
                textAlign: 'center',
                background: '#364d79',
                position: 'relative',
              }}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <h1 style={{
                    color: '#fff',
                    fontSize: '48px',
                    marginBottom: '24px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}>
                    Tiệc Cưới Hoàng Gia
                  </h1>
                  <p style={{
                    color: '#fff',
                    fontSize: '24px',
                    marginBottom: '32px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  }}>
                    Nơi những giấc mơ thành hiện thực
                  </p>
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/booking/halls')}
                  >
                    Khám Phá Ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div style={{ padding: '64px 24px', background: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
              Tại sao chọn chúng tôi?
            </h2>
            <p style={{ fontSize: '16px', color: '#666' }}>
              Chúng tôi cam kết mang đến cho bạn trải nghiệm tiệc cưới hoàn hảo nhất
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card 
                  bordered={false}
                  style={{ textAlign: 'center', height: '100%' }}
                  className="feature-card"
                >
                  <div style={{ color: '#1890ff', marginBottom: '16px' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ marginBottom: '12px' }}>{feature.title}</h3>
                  <p style={{ color: '#666' }}>{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div 
          style={{ 
            padding: '64px 24px',
            background: '#f0f2f5',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>
            Sẵn sàng cho ngày trọng đại của bạn?
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            Hãy để chúng tôi giúp bạn tạo nên một tiệc cưới đáng nhớ
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<CalendarOutlined />}
            onClick={() => navigate('/booking/new')}
          >
            Đặt Tiệc Ngay
          </Button>
        </div>
      </div>
    </UserLayout>
  );
}

export default HomePage;