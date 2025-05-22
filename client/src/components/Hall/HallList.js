import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Card,
  Typography,
  Image
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import HallManagementService from '../services/HallManagementService';
import HallForm from './HallForm';

const { Title } = Typography;

const HallList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHall, setEditingHall] = useState(null);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await HallManagementService.getAllHalls();
      setHalls(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách sảnh');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const handleEdit = (record) => {
    setEditingHall(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await HallManagementService.deleteHall(id);
      message.success('Xóa sảnh thành công');
      fetchHalls();
    } catch (error) {
      message.error('Không thể xóa sảnh');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingHall) {
        await HallManagementService.updateHall(editingHall.ID_SanhTiec, values);
        message.success('Cập nhật sảnh thành công');
      } else {
        await HallManagementService.createHall(values);
        message.success('Thêm sảnh mới thành công');
      }
      setIsModalVisible(false);
      setEditingHall(null);
      fetchHalls();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu thông tin sảnh');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      key: 'HinhAnh',
      width: '15%',
      render: (_, record) => (
        record.HinhAnh ? (
          <Image
            src={`http://localhost:5000${record.HinhAnh}`}
            alt={record.TenSanh}
            style={{ width: 100, height: 60, objectFit: 'cover' }}
            placeholder={
              <div style={{ 
                width: 100, 
                height: 60, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5' 
              }}>
                Loading...
              </div>
            }
          />
        ) : (
          <div style={{ 
            width: 100, 
            height: 60, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5' 
          }}>
            No image
          </div>
        )
      ),
    },
    {
      title: 'Tên sảnh',
      dataIndex: 'TenSanh',
      key: 'TenSanh',
      width: '20%',
    },
    {
      title: 'Loại sảnh',
      dataIndex: 'TenLoai',
      key: 'TenLoai',
      width: '15%',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'SucChua',
      key: 'SucChua',
      width: '15%',
      align: 'right',
      render: (value) => `${value} khách`,
      sorter: (a, b) => a.SucChua - b.SucChua,
    },
    {
      title: 'Giá thuê',
      dataIndex: 'GiaThue',
      key: 'GiaThue',
      width: '15%',
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
      sorter: (a, b) => a.GiaThue - b.GiaThue,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sảnh này?"
            onConfirm={() => handleDelete(record.ID_SanhTiec)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0 }}>Danh sách sảnh cưới</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingHall(null);
            setIsModalVisible(true);
          }}
        >
          Thêm sảnh mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={halls}
        rowKey="ID_SanhTiec"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sảnh`
        }}
      />

      <Modal
        title={editingHall ? "Sửa thông tin sảnh" : "Thêm sảnh mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingHall(null);
        }}
        footer={null}
        width={800}
      >
        <HallForm
          initialValues={editingHall}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingHall(null);
          }}
        />
      </Modal>
    </Card>
  );
};

export default HallList;