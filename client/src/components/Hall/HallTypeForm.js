import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Row, Col } from 'antd';

const HallTypeForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form với giá trị ban đầu khi initialValues thay đổi
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSubmit(values);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="TenLoai"
            label="Tên loại sảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại sảnh' }]}
          >
            <Input placeholder="Nhập tên loại sảnh" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="GiaThue"
            label="Giá thuê"
            rules={[
              { required: true, message: 'Vui lòng nhập giá thuê' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => {
                if (value === null || value === undefined) return '';
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND';
              }}
              parser={(value) => {
                if (!value) return 0;
                // Chỉ trích xuất các số từ chuỗi, loại bỏ tất cả ký tự không phải số
                const parsed = value.replace(/[^0-9.-]+/g, '');
                return parsed ? parseFloat(parsed) : 0;
              }}
              min={0}
              precision={0} // Chỉ nhận số nguyên
              step={1000} // Mỗi lần tăng/giảm 1000 đồng
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={onCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default HallTypeForm;