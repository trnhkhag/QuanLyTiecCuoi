import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Typography, Space, Progress, Table, Button, Alert } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
} from '@ant-design/icons';
import authService from '../../services/authService';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Sample data for upcoming events
  const upcomingEvents = [
    {
      id: 'EV-20250512',
      eventName: 'Tiệc cưới Nguyễn Văn A',
      hallName: 'Diamond',
      date: '28/05/2025',
      time: '11:00 - 14:00',
      status: 'Đã xác nhận',
    },
    {
      id: 'EV-20250511',
      eventName: 'Tiệc cưới Trần Thị B',
      hallName: 'Platinum',
      date: '05/06/2025',
      time: '17:00 - 20:00',
      status: 'Chờ xác nhận',
    },
    {
      id: 'EV-20250510',
      eventName: 'Tiệc cưới Lê Văn C',
      hallName: 'Gold',
      date: '10/06/2025',
      time: '11:00 - 14:00',
      status: 'Đã thanh toán',
    },
  ];

  const columns = [
    {
      title: 'Mã sự kiện',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Sảnh',
      dataIndex: 'hallName',
      key: 'hallName',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`}>
          {status}
        </span>
      ),
    },
  ];

  useEffect(() => {
    // If not logged in, redirect to login
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    // Safely get current user data
    try {
      const userData = authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <UserOutlined className="user-avatar" />
            <div className="user-details">
              <h3>{user?.user?.name || 'Người dùng'}</h3>
              <p>{user?.user?.email || ''}</p>
            </div>
          </div>
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <Title level={3}>Tổng quan hệ thống</Title>
          <Space>
            <Button type="default">Hôm nay</Button>
            <Button type="default">Tuần này</Button>
            <Button type="default">Tháng này</Button>
          </Space>
        </div>

        {/* Welcome Message */}
        <Alert
          message="Chào mừng đến với hệ thống quản lý tiệc cưới"
          description="Đây là trang tổng quan hiển thị thông tin chung về hệ thống và các sự kiện sắp tới."
          type="info"
          showIcon
          icon={<BellOutlined />}
          style={{ marginBottom: '24px' }}
        />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Sự kiện sắp tới"
                value={3}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <Text type="success" style={{ fontSize: '14px' }}>
                    Trong 30 ngày tới
                  </Text>
                }
              />
              <Text type="secondary">2 sự kiện đã xác nhận</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Sảnh cưới"
                value={4}
                prefix={<ShopOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <Text style={{ fontSize: '14px' }}>
                    Đang hoạt động
                  </Text>
                }
              />
              <Text type="secondary">Tất cả sảnh đều sẵn sàng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Dịch vụ"
                value={8}
                prefix={<ShopOutlined style={{ color: '#13c2c2' }} />}
                suffix={
                  <Text style={{ fontSize: '14px' }}>
                    Đang cung cấp
                  </Text>
                }
              />
              <Text type="secondary">3 dịch vụ mới thêm</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Quy định"
                value={5}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <Text style={{ fontSize: '14px' }}>
                    Đang áp dụng
                  </Text>
                }
              />
              <Text type="secondary">Cập nhật mới nhất: 15/05/2025</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={16}>
            <Card title="Sự kiện sắp tới" extra={<Button type="link">Xem tất cả</Button>}>
              <Table 
                columns={columns} 
                dataSource={upcomingEvents}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Thông tin chung" extra={<Button type="link">Chi tiết</Button>}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong>Giờ làm việc:</Text>
                  <br />
                  <Text>Thứ 2 - Thứ 6: 8:00 - 17:00</Text>
                  <br />
                  <Text>Thứ 7: 8:00 - 12:00</Text>
                </div>
                <div>
                  <Text strong>Liên hệ hỗ trợ:</Text>
                  <br />
                  <Text>Hotline: 1900 1234</Text>
                  <br />
                  <Text>Email: support@wedding.com</Text>
                </div>
                <div>
                  <Text strong>Địa chỉ:</Text>
                  <br />
                  <Text>123 Đường ABC, Quận XYZ</Text>
                  <br />
                  <Text>TP. Hồ Chí Minh</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage; 