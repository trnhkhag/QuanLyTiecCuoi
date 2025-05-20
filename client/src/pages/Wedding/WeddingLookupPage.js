import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Timeline,
  Tag,
  Descriptions,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import UserLayout from '../../components/layout/User/UserLayout';
import { LoadingSpinner, FormattedPrice, FormattedDate } from '../../components/common/StatusComponents';
import { getWeddingById } from '../../services/WeddingLookupService';

const { Title, Text } = Typography;

const WeddingLookupPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWeddingById(values.bookingId);
      
      if (response.success) {
        setBooking(response.data);
      } else {
        setError(response.message || 'Không tìm thấy thông tin tiệc cưới');
      }
    } catch (err) {
      console.error('Error looking up booking:', err);
      setError('Không thể tra cứu thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Tra cứu tiệc cưới
        </Title>

        <Card bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
          >
            <Form.Item
              name="bookingId"
              label="Mã đơn đặt tiệc"
              rules={[{ required: true, message: 'Vui lòng nhập mã đơn đặt tiệc' }]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder="Nhập mã đơn đặt tiệc"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại đăng ký"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                size="large"
                block
              >
                Tra cứu
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {error && (
          <Alert
            type="error"
            message="Lỗi tra cứu"
            description={error}
            style={{ marginTop: 24 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        {booking && (
          <Card style={{ marginTop: 24 }} bordered={false}>
            <Title level={3}>Thông tin đặt tiệc</Title>
            
            <Descriptions column={1} bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label="Mã đơn">
                {booking.ID_DonDatTiec}
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {booking.TenKhachHang}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tổ chức">
                <FormattedDate date={booking.NgayToChuc} />
              </Descriptions.Item>
              <Descriptions.Item label="Ca tiệc">
                {booking.TenCa} ({booking.ThoiGianBatDau} - {booking.ThoiGianKetThuc})
              </Descriptions.Item>
              <Descriptions.Item label="Sảnh tiệc">
                {booking.TenSanh}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng khách">
                {booking.SoLuongKhach} khách
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <FormattedPrice amount={booking.TongTien} />
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={booking.TrangThai === 'confirmed' ? 'success' : 'processing'}>
                  {booking.TrangThai === 'confirmed' ? 'Đã xác nhận' : 'Đang xử lý'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Tiến độ đặt tiệc</Title>
            <Timeline style={{ marginTop: 24 }}>
              <Timeline.Item 
                color="green" 
                dot={<CheckCircleOutlined />}
              >
                Đã tạo đơn đặt tiệc
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  <FormattedDate date={booking.NgayDat} />
                </Text>
              </Timeline.Item>

              {booking.TrangThai === 'confirmed' ? (
                <Timeline.Item 
                  color="green" 
                  dot={<CheckCircleOutlined />}
                >
                  Đã xác nhận đơn
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    <FormattedDate date={booking.NgayXacNhan} />
                  </Text>
                </Timeline.Item>
              ) : (
                <Timeline.Item 
                  color="blue" 
                  dot={<ClockCircleOutlined />}
                >
                  Chờ xác nhận
                </Timeline.Item>
              )}

              <Timeline.Item 
                color={booking.TrangThai === 'confirmed' ? 'blue' : 'gray'}
              >
                Tổ chức tiệc cưới
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  <FormattedDate date={booking.NgayToChuc} />
                </Text>
              </Timeline.Item>
            </Timeline>

            {booking.DichVu && booking.DichVu.length > 0 && (
              <>
                <Divider />
                <Title level={4}>Dịch vụ đi kèm</Title>
                <ul style={{ paddingLeft: 20 }}>
                  {booking.DichVu.map((service, index) => (
                    <li key={index}>
                      {service.TenDichVu} - <FormattedPrice amount={service.Gia} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        )}
      </div>
    </UserLayout>
  );
};

export default WeddingLookupPage;