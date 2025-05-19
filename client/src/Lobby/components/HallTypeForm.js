import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

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
      <Form.Item
        name="TenLoai"
        label="Tên loại sảnh"
        rules={[
          { required: true, message: 'Vui lòng nhập tên loại sảnh' },
          { max: 1, message: 'Tên loại sảnh chỉ được phép 1 ký tự' }
        ]}
      >
        <Input placeholder="Nhập tên loại sảnh (A, B, C,...)" />
      </Form.Item>

      <Form.Item
        name="GiaBanToiThieu"
        label="Giá bàn tối thiểu"
        rules={[{ required: true, message: 'Vui lòng nhập giá bàn tối thiểu' }]}
      >
        <InputNumber
          min={0}
          step={100000}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
          placeholder="Nhập giá bàn tối thiểu"
        />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
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