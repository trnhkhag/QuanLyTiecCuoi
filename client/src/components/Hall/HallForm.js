import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Row, Col, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import HallManagementService from '../services/HallManagementService';

const HallForm = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [hallTypes, setHallTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialValues?.HinhAnh || null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchHallTypes();
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.HinhAnh) {
        setImageUrl(initialValues.HinhAnh);
        setFileList([
          {
            uid: '-1',
            name: 'current-image.jpg',
            status: 'done',
            url: initialValues.HinhAnh,
          },
        ]);
      }
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
      const formData = new FormData();

      if (initialValues?.ID_SanhTiec) {
        formData.append('ID_SanhTiec', initialValues.ID_SanhTiec);
      }

      Object.keys(values).forEach(key => {
        if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      await onSubmit(formData);
      form.resetFields();
      setFileList([]);
      setImageUrl(null);
    } finally {
      setLoading(false);
    }
  };


  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ có thể tải lên file hình ảnh!');
        return false;
      }
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      if (newFileList[0]?.originFileObj) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(newFileList[0].originFileObj);
      }
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="TenSanh"
            label="Tên sảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên sảnh' }]}
          >
            <Input placeholder="Nhập tên sảnh" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="ID_LoaiSanh"
            label="Loại sảnh"
            rules={[{ required: true, message: 'Vui lòng chọn loại sảnh' }]}
          >
            <Select placeholder="Chọn loại sảnh">
              {hallTypes.map(type => (
                <Select.Option key={type.ID_LoaiSanh} value={type.ID_LoaiSanh}>
                  {type.TenLoai} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.GiaBanToiThieu)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="SucChua"
            label="Sức chứa"
            rules={[
              { required: true, message: 'Vui lòng nhập sức chứa' },
              { type: 'number', min: 1, message: 'Sức chứa phải lớn hơn 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập sức chứa"
              min={1}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="GiaThue"
            label="Giá thuê"
            rules={[
              { required: true, message: 'Vui lòng nhập giá thuê' },
              {
                validator: async (_, value) => {
                  if (value === undefined || value === null) {
                    return Promise.reject(new Error('Vui lòng nhập giá thuê'));
                  }
                  // Chuyển đổi value về số trước khi kiểm tra
                  const numericValue = typeof value === 'string' ?
                    parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

                  if (isNaN(numericValue)) {
                    return Promise.reject(new Error('Giá thuê không hợp lệ'));
                  }

                  if (numericValue < 0) {
                    return Promise.reject(new Error('Giá thuê không thể âm'));
                  }

                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'
              }
              parser={(value) => {
                const parsed = value.replace(/[^0-9.-]+/g, '');
                return parsed ? parseFloat(parsed) : '';
              }}
              min={0}
            />
          </Form.Item>

        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Hình ảnh sảnh"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 8 }}>
                <Image
                  src={imageUrl}
                  alt="preview"
                  style={{ maxWidth: '200px' }}
                />
              </div>
            )}
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

export default HallForm;