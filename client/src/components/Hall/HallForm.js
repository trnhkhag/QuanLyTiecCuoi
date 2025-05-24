import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Row, Col, Upload, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const HallForm = ({ initialValues, hallTypes, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Reset form và hình ảnh khi initialValues thay đổi
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        TenSanh: initialValues.TenSanh,
        ID_LoaiSanh: initialValues.ID_LoaiSanh,
        SucChua: initialValues.SucChua,
        GiaThue: initialValues.GiaThue
      });

      // Xử lý hình ảnh nếu có
      if (initialValues.HinhAnh) {
        // Lấy tên file từ đường dẫn 
        const fileName = initialValues.HinhAnh.split('/').pop();
        const imageFullUrl = `http://localhost:3001/api/v1/wedding-service/lobby/image/${fileName}`;
        setImageUrl(imageFullUrl);
        setFileList([
          {
            uid: '-1',
            name: 'current-image.jpg',
            status: 'done',
            url: imageFullUrl,
          },
        ]);
      } else {
        setImageUrl(null);
        setFileList([]);
      }
    } else {
      form.resetFields();
      setImageUrl(null);
      setFileList([]);
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Thêm các trường cơ bản
      formData.append('TenSanh', values.TenSanh);
      formData.append('ID_LoaiSanh', values.ID_LoaiSanh);
      formData.append('SucChua', values.SucChua);
      formData.append('GiaThue', values.GiaThue);
      
      // Thêm hình ảnh nếu có file mới
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      await onSubmit(formData, fileList);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      // Kiểm tra kiểu file
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ có thể tải lên file hình ảnh!');
        return false;
      }
      
      // Kiểm tra kích thước file (giới hạn 5MB)
      const isLessThan5MB = file.size / 1024 / 1024 < 5;
      if (!isLessThan5MB) {
        message.error('Hình ảnh phải nhỏ hơn 5MB!');
        return false;
      }
      
      // Preview hình ảnh khi chọn
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      return false; // Ngăn việc tự động upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="TenSanh"
            label="Tên sảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên sảnh' }]}
          >
            <Input placeholder="Nhập tên sảnh" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="ID_LoaiSanh"
            label="Loại sảnh"
            rules={[{ required: true, message: 'Vui lòng chọn loại sảnh' }]}
          >
            <Select placeholder="Chọn loại sảnh">
              {hallTypes.map((type) => (
                <Option key={type.ID_LoaiSanh} value={type.ID_LoaiSanh}>
                  {type.TenLoai} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.GiaBanToiThieu)}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="SucChua"
            label="Sức chứa"
            rules={[
              { required: true, message: 'Vui lòng nhập sức chứa' },
              { type: 'number', min: 1, message: 'Sức chứa phải lớn hơn 0' }
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng khách" />
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
              formatter={value => {
                if (value) {
                  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
                return value;
              }}
              parser={value => value.replace(/\./g, '')}
              placeholder="Nhập giá thuê"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="HinhAnh"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh' }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      {imageUrl && (
        <Row gutter={16}>
          <Col span={24}>
            <Image
              src={imageUrl}
              alt="Hình ảnh sảnh"
              style={{ maxWidth: '100%', height: 'auto', marginTop: 16 }}
              preview={false}
            />
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button 
            onClick={onCancel} 
            style={{ marginRight: 8 }}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default HallForm;