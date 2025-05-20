import React from 'react';
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
  CalendarTwoTone,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DashboardPage = () => {
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
      title: 'Ngày tổ chức',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = <ClockCircleOutlined />;
        
        if (status === 'Đã xác nhận') {
          color = 'processing';
          icon = <CheckCircleOutlined />;
        } else if (status === 'Đã thanh toán') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        }
        
        return (
          <Text type={color} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {icon} {status}
          </Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: () => <Button size="small">Chi tiết</Button>,
    },
  ];

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
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
              title="Số khách hàng"
              value={98}
              prefix={<UserOutlined style={{ color: '#13c2c2' }} />}
              suffix={
                <Text type="success" style={{ fontSize: '14px' }}>
                  <ArrowUpOutlined /> 12%
                </Text>
              }
            />
            <Text type="secondary">15 khách hàng mới tháng này</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Doanh thu tháng"
              value={256500000}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              formatter={(value) =>
                `${value.toLocaleString('vi-VN')} VNĐ`
              }
              suffix={
                <Text type="danger" style={{ fontSize: '14px' }}>
                  <ArrowDownOutlined /> 3%
                </Text>
              }
            />
            <Text type="secondary">So với tháng trước</Text>
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

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="Lịch đặt tiệc" extra={<Button type="link">Xem lịch đầy đủ</Button>}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[...Array(5)].map((_, index) => (
                <Card key={index} size="small" style={{ width: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarTwoTone twoToneColor="#eb2f96" style={{ fontSize: '24px' }} />
                    <div>
                      <Text strong>{`${index + 21}/05/2025`}</Text>
                      <div>
                        <Text type="secondary">3 sự kiện</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;