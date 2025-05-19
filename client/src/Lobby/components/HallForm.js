import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button } from 'antd';
import HallManagementService from '../services/HallManagementService';

const HallForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [hallTypes, setHallTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHallTypes();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const fetchHallTypes = async () => {
    try {
      const response = await HallManagementService.getAllHallTypes();
      setHallTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching hall types:', error);
    }
  };

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
        name="TenSanh"
        label="Tên sảnh"
        rules={[{ required: true, message: 'Vui lòng nhập tên sảnh' }]}
      >
        <Input placeholder="Nhập tên sảnh" />
      </Form.Item>

      <Form.Item
        name="ID_LoaiSanh"
        label="Loại sảnh"
        rules={[{ required: true, message: 'Vui lòng chọn loại sảnh' }]}
      >
        <Select placeholder="Chọn loại sảnh">
          {hallTypes.map(type => (
            <Select.Option key={type.ID_LoaiSanh} value={type.ID_LoaiSanh}>
              {type.TenLoai} - Giá bàn tối thiểu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.GiaBanToiThieu)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="SucChua"
        label="Sức chứa"
        rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
      >
        <InputNumber
          min={1}
          placeholder="Nhập sức chứa"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="GiaThue"
        label="Giá thuê"
        rules={[{ required: true, message: 'Vui lòng nhập giá thuê' }]}
      >
        <InputNumber
          min={0}
          step={100000}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
          placeholder="Nhập giá thuê"
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

export default HallForm;