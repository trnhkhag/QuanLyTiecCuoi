import React from 'react';
import { Result, Button, Card, Descriptions, Typography, Timeline } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import UserLayout from '../components/layout/UserLayout';
import { FormattedPrice, FormattedDate } from '../components/common/StatusComponents';

const { Title, Paragraph } = Typography;

/**
 * Trang xác nhận đặt tiệc thành công
 */
function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <UserLayout>
        <Result
          status="404"
          title="Không tìm thấy thông tin đặt tiệc"
          subTitle="Vui lòng thực hiện đặt tiệc mới hoặc tra cứu đơn đặt tiệc của bạn"
          extra={[
            <Button 
              type="primary" 
              key="booking" 
              onClick={() => navigate('/booking/new')}
            >
              Đặt tiệc mới
            </Button>,
            <Button 
              key="lookup" 
              onClick={() => navigate('/booking/lookup')}
            >
              Tra cứu đơn
            </Button>,
          ]}
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Result
          status="success"
          title="Đặt tiệc thành công!"
          subTitle={
            <div>
              <Paragraph>
                Mã đơn đặt tiệc của bạn là: <strong>{bookingData.bookingId}</strong>
              </Paragraph>
              <Paragraph>
                Vui lòng lưu lại mã đơn này để tra cứu thông tin tiệc cưới của bạn sau này.
              </Paragraph>
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="lookup"
              icon={<SearchOutlined />}
              onClick={() => navigate('/booking/lookup')}
            >
              Tra cứu đơn
            </Button>,
            <Button
              key="home"
              icon={<HomeOutlined />}
              onClick={() => navigate('/booking')}
            >
              Về trang chủ
            </Button>,
          ]}
        />

        <Card style={{ marginTop: 24 }} bordered={false}>
          <Title level={4}>Thông tin đặt tiệc</Title>
          
          <Descriptions column={1} bordered style={{ marginTop: 16 }}>
            <Descriptions.Item label="Mã đơn đặt tiệc">
              {bookingData.bookingId}
            </Descriptions.Item>
            <Descriptions.Item label="Tên khách hàng">
              {bookingData.customerName}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {bookingData.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {bookingData.email}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {bookingData.address}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tổ chức">
              <FormattedDate date={bookingData.date} />
            </Descriptions.Item>
            <Descriptions.Item label="Ca tiệc">
              {bookingData.shiftName}
            </Descriptions.Item>
            <Descriptions.Item label="Sảnh tiệc">
              {bookingData.hallName}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng khách">
              {bookingData.guestCount} khách
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <FormattedPrice amount={bookingData.totalAmount} />
            </Descriptions.Item>
          </Descriptions>

          <Title level={4} style={{ marginTop: 24 }}>
            Các bước tiếp theo
          </Title>

          <Timeline style={{ marginTop: 16 }}>
            <Timeline.Item 
              color="green"
              dot={<CheckCircleOutlined />}
            >
              Đã tạo đơn đặt tiệc thành công
            </Timeline.Item>
            <Timeline.Item>
              Nhân viên của chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận
            </Timeline.Item>
            <Timeline.Item>
              Sau khi xác nhận, bạn cần đặt cọc để hoàn tất việc đặt tiệc
            </Timeline.Item>
            <Timeline.Item>
              Chúng tôi sẽ hỗ trợ bạn trong suốt quá trình chuẩn bị tiệc cưới
            </Timeline.Item>
          </Timeline>

          <Paragraph style={{ marginTop: 24 }}>
            Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:
          </Paragraph>
          <ul>
            <li>Hotline: (028) 1234 5678</li>
            <li>Email: support@tieccuoihoanggia.com</li>
          </ul>
        </Card>
      </div>
    </UserLayout>
  );
}

export default BookingSuccessPage;
