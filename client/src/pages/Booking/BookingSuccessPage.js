import React, { useEffect } from 'react';
import { Result, Button, Card, Descriptions, Typography, Timeline, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import UserLayout from '../../components/layout/User/UserLayout';
import { FormattedPrice } from '../../components/common/FormattedPrice';
import { FormattedDate } from '../../components/common/StatusComponents';

const { Title, Paragraph } = Typography;

/**
 * Trang xác nhận đặt tiệc thành công
 */
function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hiển thị thông báo thành công
  useEffect(() => {
    message.success('Đặt tiệc thành công!');
  }, []);
    // Kiểm tra dữ liệu từ nhiều nguồn: location.state, sessionStorage, và localStorage
  let bookingData = location.state;
  
  console.log('BookingSuccessPage - location.state:', location.state);
  
  // Nếu không có dữ liệu trong state, thử lấy từ sessionStorage hoặc localStorage
  if (!bookingData) {
    try {
      // Thử lấy từ sessionStorage trước (ưu tiên vì mới hơn)
      const sessionData = sessionStorage.getItem('bookingSuccessData');
      console.log('Trying to get data from sessionStorage:', sessionData);
      
      if (sessionData) {
        bookingData = JSON.parse(sessionData);
        console.log('Retrieved booking data from sessionStorage:', bookingData);
      } else {
        // Thử lấy từ localStorage nếu không có trong sessionStorage
        const localData = localStorage.getItem('bookingSuccessData');
        console.log('Trying to get data from localStorage:', localData);
        
        if (localData) {
          bookingData = JSON.parse(localData);
          console.log('Retrieved booking data from localStorage:', bookingData);
        }
      }
    } catch (e) {
      console.error('Error retrieving booking data from storage:', e);
    }
  }
  
  // Xóa dữ liệu từ storage sau khi đã sử dụng
  useEffect(() => {
    if (bookingData) {
      // Không xóa quá nhanh để tránh trường hợp cần reload trang
      setTimeout(() => {
        sessionStorage.removeItem('bookingSuccessData');
        localStorage.removeItem('bookingSuccessData');
        console.log('Booking data cleared from storage');
      }, 3000);
    } else {
      // Nếu không có dữ liệu, điều hướng người dùng về trang đặt tiệc mới
      console.log('No booking data found, redirecting to booking page...');
      navigate('/booking/new');
    }
  }, [bookingData, navigate]);

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
            <div>              <Paragraph>
                Mã đơn đặt tiệc của bạn là: <strong>{bookingData.ID_TiecCuoi || bookingData.bookingId || bookingData.id || 'Đang xử lý'}</strong>
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
              {bookingData.ID_TiecCuoi}
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
              {bookingData.weddingDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ca tiệc">
              {bookingData.shiftName}
            </Descriptions.Item>
            <Descriptions.Item label="Sảnh tiệc">
              {bookingData.hallName}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng khách">
              {bookingData.numberOfGuests} khách
            </Descriptions.Item>            
            <Descriptions.Item label="Số lượng bàn đặt">
              {bookingData.tableCount || Math.ceil((parseInt(bookingData.numberOfGuests || bookingData.guestCount || 10)) / 10)} bàn
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <FormattedPrice amount={bookingData.totalAmount} />
            </Descriptions.Item>
            <Descriptions.Item label="Tiền đặt cọc (50%)">
              <FormattedPrice amount={bookingData.depositAmount} />
            </Descriptions.Item>
          </Descriptions>
          
          {/* Hiển thị dịch vụ đã chọn */}
          {bookingData.services && Object.keys(bookingData.services).length > 0 && (
            <>
              <Title level={4} style={{ marginTop: 24 }}>
                Dịch vụ đã chọn
              </Title>
              <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Tên dịch vụ</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Số lượng</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(bookingData.services).map(([serviceId, service]) => (
                    <tr key={serviceId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px' }}>{service.name}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{service.quantity}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        <FormattedPrice amount={service.price} />
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        <FormattedPrice amount={service.price * service.quantity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {bookingData.foods && Object.keys(bookingData.foods).length > 0 && (
            <>
              <Title level={4} style={{ marginTop: 24 }}>
                Món ăn đã chọn
              </Title>
              <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Tên món</th>
                    <th style={{ padding: '8px', textAlign: 'center' }}>Số lượng</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(bookingData.foods).map(([foodId, quantity]) => {
                    const foodDetail = bookingData.foodsData?.find(f => f.ID_MonAn.toString() === foodId.toString());
                    return (
                      <tr key={foodId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px' }}>
                          {foodDetail?.TenMonAn || `Món ăn #${foodId}`}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{quantity}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          <FormattedPrice amount={foodDetail?.DonGia || 0} />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          <FormattedPrice amount={(foodDetail?.DonGia || 0) * quantity} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}          {/* Thêm debug info để kiểm tra dữ liệu */}
          {console.log("Booking Data:", bookingData)}
          {console.log("ID_TiecCuoi:", bookingData.ID_TiecCuoi)}
          {console.log("tableCount:", bookingData.tableCount)}
          {console.log("Foods data:", bookingData.foods)}
          {console.log("Foods details:", bookingData.foodsData)}

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
