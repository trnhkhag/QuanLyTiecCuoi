import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Typography, Space, Progress, Table, Button } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import authService from '../../services/authService';
import '../../styles/dashboard.css';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Sample data for recent bookings
  const recentBookings = [
    {
      id: 'BK-20250512',
      customerName: 'Nguyễn Văn A',
      hallName: 'Diamond',
      date: '28/05/2025',
      status: 'Đã xác nhận',
    },
    {
      id: 'BK-20250511',
      customerName: 'Trần Thị B',
      hallName: 'Platinum',
      date: '05/06/2025',
      status: 'Chờ xác nhận',
    },
    {
      id: 'BK-20250510',
      customerName: 'Lê Văn C',
      hallName: 'Gold',
      date: '10/06/2025',
      status: 'Đã thanh toán',
    },
  ];

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
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
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Tổng số đơn đặt tiệc"
                value={125}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                suffix={
                  <Text type="success" style={{ fontSize: '14px' }}>
                    <ArrowUpOutlined /> 8%
                  </Text>
                }
              />
              <Text type="secondary">So với tháng trước</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Số sảnh cưới"
                value={15}
                prefix={<ShopOutlined style={{ color: '#722ed1' }} />}
                suffix={
                  <Text style={{ fontSize: '14px' }}>
                    Đang hoạt động
                  </Text>
                }
              />
              <Text type="secondary">3 sảnh đang bảo trì</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Doanh thu tháng"
                value={25000000}
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                suffix={
                  <>
                    đ
                    <Text type="success" style={{ fontSize: '14px', marginLeft: '8px' }}>
                      <ArrowUpOutlined /> 12%
                    </Text>
                  </>
                }
              />
              <Text type="secondary">So với tháng trước</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Khách hàng mới"
                value={8}
                prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
                suffix={
                  <Text type="success" style={{ fontSize: '14px' }}>
                    <ArrowUpOutlined /> 5%
                  </Text>
                }
              />
              <Text type="secondary">Trong tháng này</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={16}>
            <Card title="Đơn đặt tiệc gần đây" extra={<Button type="link">Xem tất cả</Button>}>
              <Table 
                columns={columns} 
                dataSource={recentBookings}
                rowKey="id"
                pagination={false}
                size="middle"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Hiệu suất sảnh cưới" extra={<Button type="link">Chi tiết</Button>}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Diamond</Text>
                    <Text>90%</Text>
                  </div>
                  <Progress percent={90} status="active" showInfo={false} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Platinum</Text>
                    <Text>75%</Text>
                  </div>
                  <Progress percent={75} status="active" showInfo={false} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Gold</Text>
                    <Text>60%</Text>
                  </div>
                  <Progress percent={60} status="active" showInfo={false} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Silver</Text>
                    <Text>45%</Text>
                  </div>
                  <Progress percent={45} status="active" showInfo={false} />
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