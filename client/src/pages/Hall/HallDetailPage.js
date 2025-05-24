import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Button, 
  Card, 
  Image, 
  Descriptions,
  Divider,
  Rate,
  Tag,
  Modal,
  Calendar,
  message
} from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';
import UserLayout from '../../components/layout/User/UserLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/common/StatusComponents';
import { FormattedPrice } from '../../components/common/FormattedPrice';
import HallService from '../../services/HallService';
import authService, { PERMISSIONS } from '../../services/authService';

moment.locale('vi');

const HallDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // Hàm để lấy URL hình ảnh từ đường dẫn trong database
  const getImageUrl = (hallData) => {
    if (hallData && hallData.HinhAnh) {
      // Lấy tên file từ đường dẫn đầy đủ
      const fileName = hallData.HinhAnh.split('/').pop();
      return `http://localhost:3001/api/v1/wedding-service/lobby/image/${fileName}`;
    }
    // Fallback nếu không có hình ảnh
    return '/assets/hall-1.jpg';
  };

  // Tạo danh sách hình ảnh từ hình ảnh trong database và các hình ảnh mặc định
  const getHallImages = (hallData) => {
    const mainImage = hallData && hallData.HinhAnh ? getImageUrl(hallData) : `/assets/hall-${id}.jpg`;
    return [
      mainImage,
      '/assets/hall-1.jpg',
      '/assets/hall-2.jpg',
      '/assets/hall-3.jpg',
    ];
  };

  useEffect(() => {
    fetchHallDetails();
    fetchBookedDates();
  }, [id]);

  const fetchHallDetails = async () => {
    try {
      setLoading(true);
      const data = await HallService.getHallById(id);
      if (data) {
        setHall(data); // Use the data directly
      } else {
        setError('Không thể tải thông tin sảnh');
      }
    } catch (err) {
      console.error('Error fetching hall details:', err);
      setError('Không thể tải thông tin sảnh. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    try {
      // TODO: Implement actual API call to get booked dates
      // Mock data for now
      setBookedDates([
        moment().add(2, 'days').format('YYYY-MM-DD'),
        moment().add(5, 'days').format('YYYY-MM-DD'),
      ]);
    } catch (err) {
      console.error('Error fetching booked dates:', err);
    }  };  const handleDateSelect = (date) => {
    // User should be logged in to book a hall
    if (authService.isLoggedIn()) {
      // Chuyển đổi sang số để đảm bảo tương thích với form
      const hallIdInt = parseInt(id);
      navigate(`/booking/new?hallId=${hallIdInt}&date=${date.format('YYYY-MM-DD')}`);
    } else {
      // Show modal or navigate to login page if not logged in
      message.error('Bạn cần đăng nhập để đặt tiệc.');
      // Optionally redirect to login
      navigate('/login');
    }
  };

  if (loading) return (
    <UserLayout>
      <LoadingSpinner text="Đang tải thông tin sảnh..." />
    </UserLayout>
  );

  if (error) return (
    <UserLayout>
      <ErrorMessage message={error} />
    </UserLayout>
  );

  if (!hall) return null;

  // Lấy danh sách hình ảnh dựa trên dữ liệu sảnh
  const hallImages = getHallImages(hall);

  const disabledDate = (current) => {
    // Disable dates before today and booked dates
    return current && (
      current < moment().startOf('day') ||
      bookedDates.includes(current.format('YYYY-MM-DD'))
    );
  };

  return (
    <UserLayout>
      <div className="hall-detail">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card 
              bordered={false}
              cover={
                <Image
                  alt={hall.TenSanh}
                  src={hallImages[0]}
                  fallback="/assets/hall-1.jpg"
                  preview={false}
                  style={{ height: 400, objectFit: 'cover' }}
                  onClick={() => setSelectedImage(hallImages[0])}
                />
              }
            >
              <div style={{ marginTop: 16 }}>
                <Row gutter={[8, 8]}>
                  {hallImages.slice(1).map((image, index) => (
                    <Col span={8} key={index}>
                      <Image
                        alt={`${hall.TenSanh} ${index + 2}`}
                        src={image}
                        fallback="/assets/hall-1.jpg"
                        style={{ height: 120, width: '100%', objectFit: 'cover' }}
                        onClick={() => setSelectedImage(image)}
                        preview={false}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card bordered={false}>
              <h1 style={{ fontSize: 24, marginBottom: 16 }}>{hall.TenSanh}</h1>
              <Descriptions column={1}>
                <Descriptions.Item label={<><TeamOutlined /> Sức chứa</>}>
                  {hall.SucChua} khách
                </Descriptions.Item>
                <Descriptions.Item label={<><DollarOutlined /> Giá thuê</>}>
                  <FormattedPrice amount={hall.GiaThue} />
                </Descriptions.Item>
                <Descriptions.Item label={<><EnvironmentOutlined /> Vị trí</>}>
                  {hall.ViTri || 'Tầng 1'}
                </Descriptions.Item>
              </Descriptions>

              <Divider />              <div style={{ marginBottom: 16 }}>
                <Rate disabled defaultValue={4.5} />
                <span style={{ marginLeft: 8 }}>4.5/5 (120 đánh giá)</span>
              </div>
              {!authService.isLoggedIn() && 
                <div style={{ marginBottom: 12, color: '#ff4d4f' }}>
                  Bạn cần đăng nhập để đặt tiệc.
                </div>
              }
              <Button
                type="primary"
                size="large"
                block
                icon={<CalendarOutlined />}
                onClick={() => {
                  if (authService.isLoggedIn()) {
                    setShowCalendar(true);
                  } else {
                    message.error('Bạn cần đăng nhập để đặt tiệc.');
                    navigate('/login');
                  }
                }}
                disabled={!authService.isLoggedIn()}
                title={!authService.isLoggedIn() ? "Bạn cần đăng nhập" : ""}
              >
                Đặt Tiệc Ngay
              </Button>
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: 24 }} bordered={false}>
          <h2>Thông tin chi tiết</h2>
          <div style={{ whiteSpace: 'pre-line' }}>
            {hall.MoTa || 'Chưa có mô tả chi tiết cho sảnh này.'}
          </div>

          <Divider />

          <h2>Tiện nghi</h2>
          <Row gutter={[16, 16]}>
            <Col><Tag color="blue">Máy lạnh</Tag></Col>
            <Col><Tag color="blue">Âm thanh</Tag></Col>
            <Col><Tag color="blue">Ánh sáng</Tag></Col>
            <Col><Tag color="blue">Sân khấu</Tag></Col>
            <Col><Tag color="blue">Màn hình LED</Tag></Col>
          </Row>
        </Card>

        <Modal
          title="Xem ảnh"
          open={!!selectedImage}
          onCancel={() => setSelectedImage(null)}
          footer={null}
          width="80%"
        >
          <Image
            alt="Hall preview"
            src={selectedImage}
            style={{ width: '100%' }}
          />
        </Modal>        <Modal
          title="Chọn ngày đặt tiệc"
          open={showCalendar}
          onCancel={() => setShowCalendar(false)}
          footer={null}
        >
          {authService.isLoggedIn() ? (
            <Calendar
              fullscreen={false}
              disabledDate={disabledDate}
              onSelect={(date) => {
                setShowCalendar(false);
                handleDateSelect(date);
              }}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p style={{ color: '#ff4d4f', marginBottom: '20px' }}>
                Bạn cần đăng nhập để đặt tiệc.
              </p>
              <Button onClick={() => setShowCalendar(false)}>Đóng</Button>
            </div>
          )}
        </Modal>
      </div>
    </UserLayout>
  );
};

export default HallDetailPage;