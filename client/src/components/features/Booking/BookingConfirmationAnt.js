import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FormattedPrice } from '../../common/FormattedPrice';
import Title from 'antd/lib/typography/Title';

const BookingConfirmationAnt = ({ form, selectedHall, totalAmount, shifts }) => {
  return (
    <Card bordered={false}>
      <Title level={4}>Thông tin đơn đặt tiệc</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={12}>          <Card size="small" title="Thông tin sảnh tiệc">
            {selectedHall ? (
              <>
                <p><strong>Sảnh:</strong> {selectedHall.TenSanh}</p>
                <p><strong>Sức chứa:</strong> {selectedHall.SucChua} khách</p>
                <p><strong>Giá thuê:</strong> <FormattedPrice amount={selectedHall.GiaThue} /></p>
                <p><strong>Loại sảnh:</strong> {selectedHall.TenLoai || "Chung"}</p>
              </>
            ) : (
              <p>
                {form.getFieldValue('hallId') ? 
                  'Đang tải thông tin sảnh... Vui lòng quay lại bước 1 và chọn lại sảnh nếu thông tin không hiển thị.' : 
                  'Vui lòng chọn sảnh'}
              </p>
            )}
          </Card>
        </Col>
        
        <Col span={12}>
          <Card size="small" title="Thông tin thời gian">
            <p><strong>Ngày tổ chức:</strong> {form.getFieldValue('date')?.format('DD/MM/YYYY') || 'Chưa chọn'}</p>
            <p>
              <strong>Ca tiệc:</strong> {
                form.getFieldValue('shiftId') ? 
                shifts.find(s => s.ID_Ca === form.getFieldValue('shiftId'))?.TenCa || 'Không xác định' :
                'Chưa chọn'
              }
            </p>
            <p><strong>Số lượng khách:</strong> {form.getFieldValue('guestCount') || 0} người</p>
          </Card>
        </Col>
      </Row>
      
      <Card size="small" title="Dịch vụ đã chọn" style={{ marginTop: 16 }}>
        {form.getFieldValue('services') && Object.keys(form.getFieldValue('services')).length > 0 ? (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(form.getFieldValue('services') || {}).map(([serviceId, details]) => {
                const serviceTotal = parseFloat(details.price) * parseInt(details.quantity);
                return (
                  <tr key={serviceId}>
                    <td>{details.name}</td>
                    <td>{details.quantity}</td>
                    <td><FormattedPrice amount={details.price} /></td>
                    <td><FormattedPrice amount={serviceTotal} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Không có dịch vụ nào được chọn</p>
        )}
      </Card>
      
      <Card size="small" title="Tổng kết chi phí" style={{ marginTop: 16 }}>
        <Row>
          <Col span={12}>
            <Statistic 
              title="Tổng chi phí" 
              value={totalAmount} 
              formatter={(value) => (
                <FormattedPrice amount={value} />
              )}
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="Tiền cọc (50%)" 
              value={Math.round(totalAmount * 0.5)} 
              formatter={(value) => (
                <FormattedPrice amount={value} />
              )}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>
        <p style={{ marginTop: 16 }}>
          <small>* Tiền cọc phải được thanh toán trong vòng 24 giờ để xác nhận đặt tiệc</small>
        </p>
      </Card>
    </Card>
  );
};

export default BookingConfirmationAnt;