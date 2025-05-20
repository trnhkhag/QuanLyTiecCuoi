import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Card, Space, Typography, Breadcrumb, Tooltip, Tabs, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import RegulationService from '../services/RegulationService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const RegulationList = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const data = await RegulationService.getRegulations();
      if (Array.isArray(data)) {
        setRegulations(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setRegulations([]);
      }
    } catch (err) {
      console.error('Error fetching regulations:', err);
      message.error('Không thể tải danh sách quy định. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.ID_QuyDinh);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await RegulationService.deleteRegulation(record.ID_QuyDinh);
      setRegulations(regulations.filter(item => item.ID_QuyDinh !== record.ID_QuyDinh));
      message.success('Đã xóa quy định thành công');
    } catch (err) {
      console.error('Error deleting regulation:', err);
      message.error('Không thể xóa quy định. Vui lòng thử lại sau.');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        const updatedRegulation = await RegulationService.updateRegulation(editingId, values);
        setRegulations(regulations.map(item => 
          item.ID_QuyDinh === editingId ? { ...item, ...updatedRegulation } : item
        ));
        message.success('Đã cập nhật quy định thành công');
      } else {
        const newRegulation = await RegulationService.createRegulation(values);
        setRegulations([...regulations, newRegulation]);
        message.success('Đã thêm quy định mới thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchRegulations();
    } catch (err) {
      console.error('Error submitting regulation:', err);
      message.error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} quy định. Vui lòng thử lại sau.`);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRegulation(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID_QuyDinh',
      key: 'ID_QuyDinh',
      width: 100,
    },
    {
      title: 'Tên quy định',
      dataIndex: 'TenQuyDinh',
      key: 'TenQuyDinh',
      sorter: (a, b) => a.TenQuyDinh.localeCompare(b.TenQuyDinh),
    },
    {
      title: 'Mô tả',
      dataIndex: 'MoTa',
      key: 'MoTa',
      ellipsis: true,
      render: (text) => (
        <Tooltip title="Nhấn nút chi tiết để xem đầy đủ">
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'GhiChu',
      key: 'GhiChu',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa quy định"
              description="Bạn có chắc chắn muốn xóa quy định này?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = regulations.filter(item =>
    item.TenQuyDinh.toLowerCase().includes(searchText.toLowerCase()) ||
    item.ID_QuyDinh.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="regulation-list">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm kiếm theo ID hoặc tên quy định"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm quy định mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="ID_QuyDinh"
        loading={loading}
        bordered
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} quy định`
        }}
      />

      <Modal
        title={editingId ? "Sửa quy định" : "Thêm quy định mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!editingId && (
            <Form.Item
              name="ID_QuyDinh"
              label="ID Quy định"
              rules={[
                { required: true, message: 'Vui lòng nhập ID quy định' },
                { pattern: /^QD\d+$/, message: 'ID phải có định dạng QDx (x là số)' }
              ]}
            >
              <Input placeholder="VD: QD1, QD2, ..." />
            </Form.Item>
          )}
          
          <Form.Item
            name="TenQuyDinh"
            label="Tên quy định"
            rules={[{ required: true, message: 'Vui lòng nhập tên quy định' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="MoTa"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea
              rows={4}
              showCount
              maxLength={1000}
              placeholder="Nhập mô tả chi tiết về quy định..."
            />
          </Form.Item>
          
          <Form.Item
            name="GhiChu"
            label="Ghi chú"
          >
            <Input.TextArea
              rows={2}
              showCount
              maxLength={500}
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 12 }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingId(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết quy định"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedRegulation && (
          <div style={{ padding: '0 24px' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16, marginRight: 8 }}>
                ID:
              </Text>
              <Text>{selectedRegulation.ID_QuyDinh}</Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16, marginRight: 8 }}>
                Tên quy định:
              </Text>
              <Text>{selectedRegulation.TenQuyDinh}</Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                Mô tả:
              </Text>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {selectedRegulation.MoTa}
              </Paragraph>
            </div>
            
            {selectedRegulation.GhiChu && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                  Ghi chú:
                </Text>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRegulation.GhiChu}
                </Paragraph>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const RegulationManagementPage = () => {
  const [activeKey, setActiveKey] = useState('regulations');

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }} items={[
        { title: 'Trang chủ' },
        { title: 'Quản lý quy định' }
      ]} />
      
      <div className="regulation-management">
        <Card>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>Quản lý quy định</Title>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            type="card"
          >
            <TabPane tab="Danh sách quy định" key="regulations">
              <RegulationList />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default RegulationManagementPage;