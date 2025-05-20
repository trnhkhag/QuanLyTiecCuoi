import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Popconfirm,
  Card,
  Typography
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import HallManagementService from '../services/HallManagementService';
import HallTypeForm from './HallTypeForm';

const { Title } = Typography;

const HallTypeList = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await HallManagementService.getAllHallTypes();
      setTypes(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách loại sảnh');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleEdit = (record) => {
    setEditingType(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await HallManagementService.deleteHallType(id);
      message.success('Xóa loại sảnh thành công');
      fetchTypes();
    } catch (error) {
      message.error('Không thể xóa loại sảnh');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingType) {
        await HallManagementService.updateHallType(editingType.ID_LoaiSanh, values);
        message.success('Cập nhật loại sảnh thành công');
      } else {
        await HallManagementService.createHallType(values);
        message.success('Thêm loại sảnh mới thành công');
      }
      setIsModalVisible(false);
      setEditingType(null);
      fetchTypes();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu thông tin loại sảnh');
    }
  };

  const columns = [
    {
      title: 'Tên loại sảnh',
      dataIndex: 'TenLoai',
      key: 'TenLoai',
      width: '40%',
    },
    {
      title: 'Giá bàn tối thiểu',
      dataIndex: 'GiaBanToiThieu',
      key: 'GiaBanToiThieu',
      width: '40%',
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
      sorter: (a, b) => a.GiaBanToiThieu - b.GiaBanToiThieu,
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
            title="Bạn có chắc chắn muốn xóa loại sảnh này?"
            onConfirm={() => handleDelete(record.ID_LoaiSanh)}
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
        <Title level={5} style={{ margin: 0 }}>Danh sách loại sảnh</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingType(null);
            setIsModalVisible(true);
          }}
        >
          Thêm loại sảnh mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={types}
        rowKey="ID_LoaiSanh"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} loại sảnh`
        }}
      />

      <Modal
        title={editingType ? "Sửa thông tin loại sảnh" : "Thêm loại sảnh mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingType(null);
        }}
        footer={null}
        width={600}
      >
        <HallTypeForm
          initialValues={editingType}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingType(null);
          }}
        />
      </Modal>
    </Card>
  );
};

export default HallTypeList;