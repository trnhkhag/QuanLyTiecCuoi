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
    <Card variant="outlined">      
    {selectedHall && (
        <Alert
          type="info"
          message={`Sảnh đã chọn: ${selectedHall.TenSanh}`}
          description={
            <div>
              <div>Sức chứa: {selectedHall.SucChua} khách</div>
              <div>Giá thuê sảnh: <FormattedPrice amount={selectedHall.GiaThue} /></div>
              <div>Loại sảnh: {selectedHall.TenLoai || "Chung"}</div>
              <div>Giá bàn tối thiểu: <FormattedPrice amount={selectedHall.GiaBanToiThieu} /> / bàn</div>
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
        >            {Array.isArray(halls) && halls.length > 0 ? 
            halls.map(hall => (
              <Option key={`hall-${hall.ID_SanhTiec}`} value={hall.ID_SanhTiec || ''}>
                {hall.TenSanh || 'Sảnh không xác định'}
              </Option>
            )) : 
            <Option key="no-halls" value="">Không có sảnh tiệc</Option>
          }
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
          {Array.isArray(shifts) && shifts.length > 0 ? (              shifts.map((shift, index) => {
              console.log('Rendering shift:', shift); // Debug info
              return (              
                <Option 
                  key={`shift-${shift.ID_Ca || index}`} 
                  value={shift.ID_Ca}
                >
                  {shift.TenCa}
                </Option>
              );
            })
          ) : (
            <Option key="no-shift" value="" disabled>
              Không có ca tiệc
            </Option>
          )}
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

      <Form.Item
        name="tableCount"
        label="Số lượng bàn"
        rules={[{ required: true, message: 'Vui lòng nhập số lượng bàn' }]}
        tooltip="Giá bàn sẽ được tính dựa trên loại sảnh đã chọn"
      >
        <InputNumber
          style={{ width: '100%' }}
          min={1}
          placeholder="Nhập số lượng bàn"
          onChange={(value) => {
            // Cập nhật giá trị và trigger lại việc tính toán tổng tiền
            form.setFieldsValue({ tableCount: value });
            // Tự động cập nhật số lượng khách dự kiến (mỗi bàn ~10 khách)
            if (value) {
              form.setFieldsValue({ guestCount: value * 10 });
            }
          }}
        />
      </Form.Item>
    </Card>
  );
};

export default BookingBasicInfoAnt;