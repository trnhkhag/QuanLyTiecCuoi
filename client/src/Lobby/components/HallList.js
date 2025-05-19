import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import HallManagementService from '../services/HallManagementService';
import HallForm from './HallForm';

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
      title: 'Tên sảnh',
      dataIndex: 'TenSanh',
      key: 'TenSanh',
    },
    {
      title: 'Loại sảnh',
      dataIndex: 'TenLoai',
      key: 'TenLoai',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'SucChua',
      key: 'SucChua',
      sorter: (a, b) => a.SucChua - b.SucChua,
    },
    {
      title: 'Giá thuê',
      dataIndex: 'GiaThue',
      key: 'GiaThue',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
      sorter: (a, b) => a.GiaThue - b.GiaThue,
    },
    {
      title: 'Thao tác',
      key: 'action',
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
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
      />

      <Modal
        title={editingHall ? "Sửa thông tin sảnh" : "Thêm sảnh mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingHall(null);
        }}
        footer={null}
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
    </div>
  );
};

export default HallList;