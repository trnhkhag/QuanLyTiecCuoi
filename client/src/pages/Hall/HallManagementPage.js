import React, { useState, useEffect } from 'react';
import { Tabs, Card, Button, Input, Table, Tag, Space, Modal, Form, Select, Upload, Tooltip, Badge, message, InputNumber } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import AdminHallService from '../../services/AdminHallService';

const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

const HallList = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingHall, setEditingHall] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [hallTypes, setHallTypes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);

  useEffect(() => {
    fetchHalls();
    fetchHallTypes();
  }, []);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await AdminHallService.getAllHalls();
      setHalls(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách sảnh');
    }
    setLoading(false);
  };

  const fetchHallTypes = async () => {
    try {
      const response = await AdminHallService.getAllHallTypes();
      setHallTypes(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách loại sảnh');
    }
  };

  const showEditModal = (hall) => {
    setEditingHall(hall);
    form.setFieldsValue({
      TenSanh: hall.TenSanh,
      ID_LoaiSanh: hall.ID_LoaiSanh,
      SucChua: hall.SucChua,
      GiaThue: hall.GiaThue,
    });
    if (hall.HinhAnh) {
      setFileList([
        {
          uid: '-1',
          name: 'current-image.jpg',
          status: 'done',
          url: `http://localhost:5000${hall.HinhAnh}`,
        },
      ]);
    }
    setModalVisible(true);
  };

  const showDetailModal = (hall) => {
    setSelectedHall(hall);
    setDetailModalVisible(true);
  };

  const showDeleteConfirm = (hall) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa sảnh ${hall.TenSanh}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await AdminHallService.deleteHall(hall.ID_SanhTiec);
          message.success('Xóa sảnh thành công');
          fetchHalls();
        } catch (error) {
          message.error('Không thể xóa sảnh');
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('TenSanh', values.TenSanh);
      formData.append('SucChua', values.SucChua);
      formData.append('GiaThue', values.GiaThue);
      formData.append('ID_LoaiSanh', values.ID_LoaiSanh);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      let response;
      if (editingHall) {
        if (!fileList[0]?.originFileObj && fileList[0]?.url) {
          const jsonData = {
            TenSanh: values.TenSanh,
            SucChua: values.SucChua,
            GiaThue: values.GiaThue,
            ID_LoaiSanh: values.ID_LoaiSanh
          };
          response = await AdminHallService.updateHall(editingHall.ID_SanhTiec, jsonData);
          message.success({
            content: `Cập nhật sảnh "${values.TenSanh}" thành công`,
            key: 'hall-update'
          });
        } else {
          response = await AdminHallService.updateHall(editingHall.ID_SanhTiec, formData);
          message.success({
            content: `Cập nhật sảnh "${values.TenSanh}" thành công`,
            key: 'hall-update'
          });
        }
      } else {
        response = await AdminHallService.createHall(formData);
        message.success({
          content: `Thêm sảnh "${values.TenSanh}" thành công`,
          key: 'hall-create'
        });
      }

      setModalVisible(false);
      form.resetFields();
      setEditingHall(null);
      setFileList([]);
      fetchHalls();
    } catch (error) {
      console.error('Error:', error);
      message.error({
        content: 'Có lỗi xảy ra khi lưu thông tin sảnh',
        key: 'hall-error'
      });
    }
  };

  const handlePriceChange = (value) => {
    if (value < 0) {
      form.setFields([
        {
          name: 'GiaThue',
          errors: ['Giá thuê không thể âm'],
        },
      ]);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ có thể tải lên file hình ảnh!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    maxCount: 1,
  };

  const columns = [
    {
      title: 'Hình ảnh',
      key: 'HinhAnh',
      width: '15%',
      render: (_, record) => (
        record.HinhAnh ? (
          <img
            src={`http://localhost:5000${record.HinhAnh}`}
            alt={record.TenSanh}
            style={{ width: 100, height: 60, objectFit: 'cover' }}
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
      filters: hallTypes.map(type => ({ text: type.TenLoai, value: type.ID_LoaiSanh })),
      onFilter: (value, record) => record.ID_LoaiSanh === value,
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
      render: (value) => `${value.toLocaleString('vi-VN')} đ`,
      sorter: (a, b) => a.GiaThue - b.GiaThue,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = halls.filter(item =>
    item.TenSanh.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="hall-list">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Tìm kiếm theo tên sảnh"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingHall(null);
            form.resetFields();
            setFileList([]);
            setModalVisible(true);
          }}
        >
          Thêm sảnh mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="ID_SanhTiec"
        loading={loading}
        bordered
      />

      <Modal
        title={editingHall ? "Sửa thông tin sảnh" : "Thêm sảnh mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingHall(null);
          setFileList([]);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="TenSanh"
            label="Tên sảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên sảnh' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ID_LoaiSanh"
            label="Loại sảnh"
            rules={[{ required: true, message: 'Vui lòng chọn loại sảnh' }]}
          >
            <Select>
              {hallTypes.map(type => (
                <Option key={type.ID_LoaiSanh} value={type.ID_LoaiSanh}>
                  {type.TenLoai} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.GiaBanToiThieu)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="SucChua"
            label="Sức chứa"
            rules={[
              { required: true, message: 'Vui lòng nhập sức chứa' },
              { type: 'number', min: 1, message: 'Sức chứa phải lớn hơn 0' }
            ]}
          >
            <InputNumber type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="GiaThue"
            label="Giá thuê"
            rules={[
              { required: true, message: 'Vui lòng nhập giá thuê' },
              { type: 'number', min: 0, message: 'Giá thuê không thể âm' }
            ]}
            validateFirst={true}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={handlePriceChange}
              onBlur={(e) => handlePriceChange(e.target.value)}
              addonAfter="VNĐ"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>


          <Form.Item
            label="Hình ảnh"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingHall(null);
                setFileList([]);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingHall ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết sảnh"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedHall && (
          <div>
            <p><strong>Tên sảnh:</strong> {selectedHall.TenSanh}</p>
            <p><strong>Loại sảnh:</strong> {selectedHall.TenLoai}</p>
            <p><strong>Sức chứa:</strong> {selectedHall.SucChua} khách</p>
            <p><strong>Giá thuê:</strong> {selectedHall.GiaThue.toLocaleString('vi-VN')} đ</p>
            {selectedHall.HinhAnh && (
              <div>
                <strong>Hình ảnh:</strong>
                <img
                  src={`http://localhost:5000${selectedHall.HinhAnh}`}
                  alt={selectedHall.TenSanh}
                  style={{ width: '100%', maxHeight: 400, objectFit: 'cover', marginTop: 8 }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const HallTypeList = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingType, setEditingType] = useState(null);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await AdminHallService.getAllHallTypes();
      setTypes(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách loại sảnh');
    }
    setLoading(false);
  };

  const showEditModal = (type) => {
    setEditingType(type);
    form.setFieldsValue({
      TenLoai: type.TenLoai,
      GiaBanToiThieu: type.GiaBanToiThieu,
    });
    setModalVisible(true);
  };

  const showDeleteConfirm = (type) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa loại sảnh ${type.TenLoai}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await AdminHallService.deleteHallType(type.ID_LoaiSanh);
          message.success('Xóa loại sảnh thành công');
          fetchTypes();
        } catch (error) {
          message.error('Không thể xóa loại sảnh');
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingType) {
        await AdminHallService.updateHallType(editingType.ID_LoaiSanh, values);
        message.success('Cập nhật loại sảnh thành công');
      } else {
        await AdminHallService.createHallType(values);
        message.success('Thêm loại sảnh mới thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingType(null);
      fetchTypes();
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu thông tin loại sảnh');
    }
  };

  const columns = [
    {
      title: 'Mã loại',
      dataIndex: 'ID_LoaiSanh',
      key: 'ID_LoaiSanh',
    },
    {
      title: 'Tên loại sảnh',
      dataIndex: 'TenLoai',
      key: 'TenLoai',
    },
    {
      title: 'Giá bàn tối thiểu',
      dataIndex: 'GiaBanToiThieu',
      key: 'GiaBanToiThieu',
      render: (value) => `${value.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="hall-type-list">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div></div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingType(null);
            form.resetFields();
            setModalVisible(true);
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
        bordered
      />

      <Modal
        title={editingType ? "Sửa loại sảnh" : "Thêm loại sảnh mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingType(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="TenLoai"
            label="Tên loại sảnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại sảnh' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="GiaBanToiThieu"
            label="Giá bàn tối thiểu"
            rules={[
              { required: true, message: 'Vui lòng nhập giá bàn tối thiểu' },
              { type: 'number', min: 0, message: 'Giá không thể âm' }
            ]}
          >
            <Input type="number" min={0} addonAfter="VNĐ" />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingType(null);
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingType ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const HallManagementPage = () => {
  const [activeKey, setActiveKey] = useState('halls');

  return (
    <div>
      <div className="hall-management">
        <div style={{ marginBottom: 16 }}>
          <h2>Quản lý Sảnh cưới</h2>
        </div>

        <Card>
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            type="card"
          >
            <TabPane tab="Quản lý sảnh" key="halls">
              <HallList />
            </TabPane>
            <TabPane tab="Quản lý loại sảnh" key="hall-types">
              <HallTypeList />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default HallManagementPage;