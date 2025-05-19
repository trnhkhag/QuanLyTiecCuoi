import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Steps,
  Card,
  Row,
  Col,
  Alert,
  Space,
  Divider,
  Typography,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ShopOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';
import UserLayout from '../components/layout/UserLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import { FormattedPrice } from '../components/common/FormattedPrice';
import HallService from '../services/HallService';
import BookingService from '../services/BookingService';
import ServiceService from '../services/ServiceService';

const { Title } = Typography;
const { Step } = Steps;

/**
 * Trang đặt tiệc mới
 */
const BookingFormPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [halls, setHalls] = useState([]);
  const [services, setServices] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedHall, setSelectedHall] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Set initial values from URL params
    const hallId = searchParams.get('hallId');
    const date = searchParams.get('date');
    
    if (hallId) {
      form.setFieldsValue({ hallId });
      fetchHallDetails(hallId);
    }
    if (date) {
      form.setFieldsValue({ date: moment(date) });
    }
  }, [searchParams]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [hallsRes, servicesRes, shiftsRes] = await Promise.all([
        HallService.getHalls(),
        ServiceService.getServices(),
        BookingService.getShifts(),
      ]);

      setHalls(hallsRes.data || []);
      setServices(servicesRes.data || []);
      setShifts(shiftsRes.data || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Không thể tải thông tin cần thiết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHallDetails = async (hallId) => {
    try {
      const response = await HallService.getHallById(hallId);
      if (response.success) {
        setSelectedHall(response.data);
        calculateTotal({ hallId: response.data.ID_SanhTiec });
      }
    } catch (err) {
      console.error('Error fetching hall details:', err);
    }
  };

  const calculateTotal = (values = form.getFieldsValue()) => {
    let total = 0;
    
    // Tính giá sảnh
    if (values.hallId) {
      const hall = halls.find(h => h.ID_SanhTiec === values.hallId);
      if (hall) {
        total += hall.GiaThue;
      }
    }

    // Tính giá dịch vụ
    if (values.services && services.length > 0) {
      values.services.forEach(serviceId => {
        const service = services.find(s => s.ID_DichVu === serviceId);
        if (service) {
          total += service.Gia;
        }
      });
    }

    setTotalAmount(total);
  };

  const handleFormChange = (changedValues, allValues) => {
    if ('hallId' in changedValues) {
      fetchHallDetails(changedValues.hallId);
    }
    calculateTotal(allValues);
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <Card bordered={false}>
          <Form.Item
            name="hallId"
            label="Chọn sảnh tiệc"
            rules={[{ required: true, message: 'Vui lòng chọn sảnh tiệc' }]}
          >
            <Select
              placeholder="Chọn sảnh tiệc"
              optionFilterProp="children"
              showSearch
            >
              {halls.map(hall => (
                <Select.Option key={hall.ID_SanhTiec} value={hall.ID_SanhTiec}>
                  {hall.TenSanh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày tổ chức"
                rules={[{ required: true, message: 'Vui lòng chọn ngày tổ chức' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  disabledDate={current => current && current < moment().startOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shiftId"
                label="Ca tiệc"
                rules={[{ required: true, message: 'Vui lòng chọn ca tiệc' }]}
              >
                <Select placeholder="Chọn ca tiệc">
                  {shifts.map(shift => (
                    <Select.Option key={shift.ID_Ca} value={shift.ID_Ca}>
                      {shift.TenCa} ({shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="guestCount"
            label="Số lượng khách"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng khách' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={selectedHall?.SucChua || 1000}
              placeholder="Nhập số lượng khách dự kiến"
            />
          </Form.Item>
        </Card>
      ),
    },
    {
      title: 'Dịch vụ',
      content: (
        <Card bordered={false}>
          <Form.Item
            name="services"
            label="Chọn dịch vụ kèm theo"
          >
            <Select
              mode="multiple"
              placeholder="Chọn các dịch vụ kèm theo"
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {services.map(service => (
                <Select.Option key={service.ID_DichVu} value={service.ID_DichVu}>
                  {service.TenDichVu} - <FormattedPrice amount={service.Gia} />
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập yêu cầu đặc biệt hoặc ghi chú khác"
            />
          </Form.Item>
        </Card>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      content: (
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Tên khách hàng"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ" />
          </Form.Item>
        </Card>
      ),
    },
  ];

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const response = await BookingService.createBooking({
        ...values,
        totalAmount,
      });
      
      if (response.success) {
        navigate('/booking/success', { 
          state: { 
            bookingId: response.data.ID_DonDatTiec,
            ...values,
            totalAmount,
          }
        });
      } else {
        setError(response.message || 'Không thể tạo đơn đặt tiệc');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Không thể tạo đơn đặt tiệc. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <LoadingSpinner text="Đang tải thông tin..." />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Đặt Tiệc Cưới
        </Title>

        {error && (
          <Alert
            type="error"
            message="Lỗi"
            description={error}
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
        >
          {steps[currentStep].content}

          <Card bordered={false} style={{ marginTop: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  {currentStep > 0 && (
                    <Button 
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Quay lại
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button 
                      type="primary"
                      onClick={() => {
                        form.validateFields()
                          .then(() => setCurrentStep(currentStep + 1))
                          .catch(() => {});
                      }}
                    >
                      Tiếp theo
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button 
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                    >
                      Xác nhận đặt tiệc
                    </Button>
                  )}
                </Space>
              </Col>
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#666' }}>Tổng tiền:</div>
                  <div style={{ fontSize: 24, color: '#f5222d' }}>
                    <FormattedPrice amount={totalAmount} />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </UserLayout>
  );
};

export default BookingFormPage;