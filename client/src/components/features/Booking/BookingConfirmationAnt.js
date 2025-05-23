import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { FormattedPrice } from '../../common/FormattedPrice';
import Title from 'antd/lib/typography/Title';

const BookingConfirmationAnt = ({ form, selectedHall, totalAmount, shifts, foods = [] }) => {
  const formValues = form.getFieldsValue(true);
  
  // Tính toán chi tiết món ăn đã chọn
  const foodDetails = [];
  
  if (formValues.foods && Object.keys(formValues.foods).length > 0 && foods.length > 0) {
    Object.entries(formValues.foods).forEach(([foodId, quantity]) => {
      if (!quantity || quantity <= 0) return;
      
      const food = foods.find(f => f.ID_MonAn === parseInt(foodId));
      if (food) {
        foodDetails.push({
          key: `food-${foodId}`,
          name: food.TenMonAn,
          quantity: quantity,
          price: food.DonGia,
          total: food.DonGia * quantity
        });
      }
    });
  }

  return (
    <Card variant="outlined">
      <Title level={4}>Thông tin đơn đặt tiệc</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card size="small" title="Thông tin sảnh tiệc">
            {selectedHall ? (
              <>                <p><strong>Sảnh:</strong> {selectedHall.TenSanh}</p>
                <p><strong>Sức chứa:</strong> {selectedHall.SucChua} khách</p>
                <p><strong>Giá thuê sảnh:</strong> <FormattedPrice amount={selectedHall.GiaThue} /></p>
                <p><strong>Loại sảnh:</strong> {selectedHall.TenLoai || "Chung"}</p>
                <p><strong>Giá bàn tối thiểu:</strong> <FormattedPrice amount={selectedHall.GiaBanToiThieu} /> / bàn</p>
                <p><strong>Số lượng bàn:</strong> {form.getFieldValue('tableCount') || 0} bàn</p>
                <p><strong>Tổng tiền bàn:</strong> <FormattedPrice amount={(form.getFieldValue('tableCount') || 0) * (selectedHall.GiaBanToiThieu || 0)} /></p>
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
            <p><strong>Số lượng bàn đặt:</strong> {form.getFieldValue('tableCount') || 0} bàn</p>
            <p><strong>Số bàn dự phòng:</strong> {Math.ceil((parseInt(form.getFieldValue('tableCount')) || 1) * 0.1)} bàn</p>
          </Card>
        </Col>
      </Row>
      
      {/* Phần dịch vụ đã chọn */}
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
      
      {/* Phần món ăn đã chọn - THÊM MỚI */}
      {foodDetails.length > 0 && (
        <Card size="small" title="Món ăn đã chọn" style={{ marginTop: 16 }}>
          <Table
            dataSource={foodDetails}
            columns={[
              { title: 'Tên món', dataIndex: 'name' },
              { title: 'Số lượng', dataIndex: 'quantity' },
              { title: 'Đơn giá', dataIndex: 'price', render: price => <FormattedPrice amount={price} /> },
              { title: 'Thành tiền', dataIndex: 'total', render: total => <FormattedPrice amount={total} /> }
            ]}
            pagination={false}
            rowKey="key"
          />
        </Card>
      )}
      
      {/* Phần tổng kết chi phí */}
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