import React from 'react';
import { Form, Input, Card } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const BookingContactInfoAnt = () => {
  return (
    <Card bordered={false}>
      <Form.Item
        name="customerName"
        label="Tên khách hàng"
        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
      </Form.Item>
      
      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại' },
          { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
        ]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
      >
        <Input.TextArea placeholder="Nhập địa chỉ" />
      </Form.Item>
    </Card>
  );
};

export default BookingContactInfoAnt;