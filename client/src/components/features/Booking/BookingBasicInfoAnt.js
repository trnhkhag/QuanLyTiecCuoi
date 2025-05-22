import React, { useEffect } from 'react';
import { Form, Select, DatePicker, InputNumber, Card, Alert } from 'antd';
import { FormattedPrice } from '../../common/FormattedPrice';
import moment from 'moment';

const { Option } = Select;

const BookingBasicInfoAnt = ({ form, halls, shifts, selectedHall, fetchHallDetails }) => {
  // Effect để cập nhật thông tin sảnh khi component mount
  useEffect(() => {
    const currentHallId = form.getFieldValue('hallId');
    if (currentHallId && fetchHallDetails) {
      fetchHallDetails(currentHallId);
    }
  }, [form, fetchHallDetails]);

  return (
    <Card bordered={false}>
      {selectedHall && (
        <Alert
          type="info"
          message={`Sảnh đã chọn: ${selectedHall.TenSanh}`}
          description={
            <div>
              <div>Sức chứa: {selectedHall.SucChua} khách</div>
              <div>Giá thuê: <FormattedPrice amount={selectedHall.GiaThue} /></div>
              <div>Loại sảnh: {selectedHall.TenLoai || "Chung"}</div>
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Form.Item
        name="hallId"
        label="Chọn sảnh tiệc"
        rules={[{ required: true, message: 'Vui lòng chọn sảnh tiệc' }]}
      >
        <Select
          placeholder="Chọn sảnh tiệc"
          optionFilterProp="children"
          showSearch
          onChange={(value) => {
            // Gọi fetchHallDetails khi người dùng chọn sảnh mới
            if (fetchHallDetails && value) {
              fetchHallDetails(value);
            }
          }}
        >
          {halls.map(hall => (
            <Option key={hall.ID_SanhTiec} value={hall.ID_SanhTiec}>
              {hall.TenSanh}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Ngày tổ chức"
        rules={[{ required: true, message: 'Vui lòng chọn ngày tổ chức' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          disabledDate={current => current && current < moment().startOf('day')}
        />
      </Form.Item>
      
      <Form.Item
        name="shiftId"
        label="Ca tiệc"
        rules={[{ required: true, message: 'Vui lòng chọn ca tiệc' }]}
      >
        <Select placeholder="Chọn ca tiệc">
          {shifts.map(shift => (
            <Option key={shift.ID_Ca} value={shift.ID_Ca}>
              {shift.TenCa}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="guestCount"
        label="Số lượng khách"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng khách' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          max={selectedHall?.SucChua || 1000}
          placeholder="Nhập số lượng khách dự kiến"
        />
      </Form.Item>
    </Card>
  );
};

export default BookingBasicInfoAnt;