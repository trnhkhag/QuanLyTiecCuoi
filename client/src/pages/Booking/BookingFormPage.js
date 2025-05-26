import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useBookingForm } from '../../hooks/Booking/useBookings';
import { addWeddingToHistory } from '../../redux/slices/profile.slice';
import BookingBasicInfoAnt from '../../components/features/Booking/BookingBasicInfoAnt';
import { Form, Button, Steps, message, Typography, Spin, Alert, Input, Tabs, Table, InputNumber } from 'antd';
import { FormattedPrice } from '../../components/common/FormattedPrice';
import BookingConfirmationAnt from '../../components/features/Booking/BookingConfirmationAnt';
import UserLayout from '../../components/layout/User/UserLayout';
import authService from '../../services/authService';

const { Title } = Typography;
const { Step } = Steps;

/**
 * Trang đặt tiệc mới
 */
const BookingFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  
  const preSelectedHallId = searchParams.get('hallId');
  
  const {
    halls,
    services,
    shifts,
    foods,
    selectedHall,
    loading,
    error,
    submitting,
    totalAmount,
    fetchHallDetails,
    calculateTotal,
    handleSubmit
  } = useBookingForm(preSelectedHallId);
  // Set initial values from URL params
  useEffect(() => {
    const hallId = searchParams.get('hallId');
    const date = searchParams.get('date');
    
    if (hallId) {
      console.log('Setting initial hall ID from URL:', hallId);
      // Chuyển đổi sang số để đảm bảo tương thích với component Select
      const hallIdNumber = parseInt(hallId);
      if (!isNaN(hallIdNumber)) {
        form.setFieldsValue({ hallId: hallIdNumber });
      } else {
        form.setFieldsValue({ hallId });
      }
      fetchHallDetails(hallId);
    }
    if (date) {
      form.setFieldsValue({ date: moment(date) });
    }
  }, [searchParams, form, fetchHallDetails]);
  
  // Update calculations when form values change
  const handleFormChange = (changedValues, allValues) => {
    console.log('Form values changed:', changedValues);
    calculateTotal(allValues);
  };

  // Recalculate total when switching to confirmation step
  useEffect(() => {
    if (currentStep === 3) { // Confirmation step
      const values = form.getFieldsValue(true);
      calculateTotal(values);
    }
  }, [currentStep, form, calculateTotal]);
  
  // Update selectedHall when hallId changes
  useEffect(() => {
    const values = form.getFieldsValue(true);
    if (values.hallId && (!selectedHall || selectedHall.ID_SanhTiec !== parseInt(values.hallId))) {
      fetchHallDetails(values.hallId);
    }
  }, [form, selectedHall, fetchHallDetails]);
  // Define steps
  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: <BookingBasicInfoAnt 
        form={form} 
        halls={halls} 
        shifts={shifts} 
        selectedHall={selectedHall}
        fetchHallDetails={fetchHallDetails} 
      />
    },
    {
      title: 'Dịch vụ và món ăn',
      content: (
        <div>
          <Tabs defaultActiveKey="services" style={{ marginBottom: 20 }}>
            <Tabs.TabPane tab="Dịch vụ đi kèm" key="services">
              <Form.Item name="services" initialValue={{}}>
                <Table
                  rowSelection={{
                    type: 'checkbox',
                    getCheckboxProps: (record) => ({
                      name: record.ID_DichVu,
                    }),
                    onSelect: (record, selected) => {
                      const currentServices = form.getFieldValue('services') || {};
                      let newServices = { ...currentServices };
                      
                      if (selected) {
                        newServices[record.ID_DichVu] = {
                          name: record.TenDichVu,
                          price: record.DonGia,
                          quantity: 1
                        };
                      } else {
                        delete newServices[record.ID_DichVu];
                      }
                      
                      form.setFieldsValue({ services: newServices });
                      const allValues = form.getFieldsValue(true);
                      calculateTotal(allValues);
                    }
                  }}
                  dataSource={services}
                  columns={[
                    {
                      title: 'Tên dịch vụ',
                      dataIndex: 'TenDichVu',
                      key: 'TenDichVu',
                    },
                    {
                      title: 'Mô tả',
                      dataIndex: 'MoTa',
                      key: 'MoTa',
                      ellipsis: true,
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'DonGia',
                      key: 'DonGia',
                      render: (text) => <FormattedPrice amount={text} />,
                    },
                    {
                      title: 'Số lượng',
                      key: 'quantity',
                      render: (_, record) => {
                        const services = form.getFieldValue('services') || {};
                        const isSelected = services[record.ID_DichVu];
                        
                        return isSelected ? (
                          <InputNumber
                            min={1}
                            defaultValue={1}
                            value={services[record.ID_DichVu]?.quantity || 1}
                            onChange={(value) => {
                              const currentServices = form.getFieldValue('services') || {};
                              const newServices = { 
                                ...currentServices,
                                [record.ID_DichVu]: {
                                  ...currentServices[record.ID_DichVu],
                                  quantity: value
                                }
                              };
                              
                              form.setFieldsValue({ services: newServices });
                              const allValues = form.getFieldsValue(true);
                              calculateTotal(allValues);
                            }}
                          />
                        ) : null;
                      }
                    }
                  ]}
                  rowKey="ID_DichVu"
                  pagination={false}
                />
              </Form.Item>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Món ăn" key="foods">
              <Form.Item name="foods" initialValue={{}}>
                <Table
                  dataSource={foods || []}
                  columns={[
                    {
                      title: 'Tên món',
                      dataIndex: 'TenMonAn',
                      key: 'TenMonAn',
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'DonGia',
                      key: 'DonGia',
                      render: (text) => <FormattedPrice amount={text} />,
                    },
                    {
                      title: 'Số lượng',
                      key: 'quantity',
                      render: (_, record) => {
                        const foodsValue = form.getFieldValue('foods') || {};
                        
                        return (
                          <InputNumber
                            min={0}
                            value={foodsValue[record.ID_MonAn] || 0}
                            onChange={(value) => {
                              const currentFoods = form.getFieldValue('foods') || {};
                              let newFoods = { ...currentFoods };
                              
                              if (value > 0) {
                                newFoods[record.ID_MonAn] = value;
                              } else {
                                delete newFoods[record.ID_MonAn];
                              }
                              
                              form.setFieldsValue({ foods: newFoods });
                              const allValues = form.getFieldsValue(true);
                              calculateTotal(allValues);
                            }}
                          />
                        );
                      }
                    }
                  ]}
                  rowKey="ID_MonAn"
                  pagination={false}
                />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
          
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea
              rows={4}
              placeholder="Nhập yêu cầu đặc biệt hoặc ghi chú khác"
            />
          </Form.Item>
        </div>
      )
    },    {
      title: 'Xác nhận đặt tiệc',
      content: <BookingConfirmationAnt 
        form={form} 
        selectedHall={selectedHall} 
        totalAmount={totalAmount} 
        shifts={shifts} 
        foods={foods}
      />
    }
  ];  const submitBooking = async () => {
    try {
      // Check if user is logged in before validating fields
      const userData = authService.getCurrentUser()?.user;
      if (!userData) {
        message.error('Bạn cần đăng nhập để đặt tiệc');
        navigate('/login');
        return;
      }
      
      // Validate form fields
      await form.validateFields(['hallId', 'date', 'shiftId', 'guestCount', 'tableCount']);
      const values = form.getFieldsValue(true);
      
      // Set user information to form values      values.customerName = userData.name || userData.username || 'Khách hàng';
      values.email = userData.email || '';
      values.phone = userData.phone || '';
      values.address = userData.address || '';
      
      // Show loading message
      message.loading({ 
        content: 'Đang xử lý đơn đặt tiệc...', 
        key: 'bookingSubmit', 
        duration: 0 
      });
      
      // Ensure hall details are loaded
      if (values.hallId && (!selectedHall || selectedHall.ID_SanhTiec !== parseInt(values.hallId))) {
        await fetchHallDetails(values.hallId);
      }
      
      // Calculate final total
      calculateTotal(values);
      
      // Submit booking
      const result = await handleSubmit(values);
      
      if (!result) {
        throw new Error('Không nhận được kết quả từ server');
      }
      
      // Show success message
      message.success({ 
        content: 'Đặt tiệc thành công!',
        key: 'bookingSubmit',
        duration: 2 
      });
      
      // Find shift name for display
      const selectedShift = shifts.find(s => s.ID_Ca === parseInt(values.shiftId));
      const shiftName = selectedShift ? selectedShift.TenCa : 'Không xác định';
      
      // Prepare success data
      const successData = {
        ID_TiecCuoi: result.ID_TiecCuoi || result.id || 'WD-' + Date.now(),
        totalAmount: totalAmount,
        depositAmount: Math.round(totalAmount * 0.5),
        customerName: values.customerName || '',
        phone: values.phone || '',
        email: values.email || '',
        address: values.address || '',
        weddingDate: values.date ? values.date.format('DD/MM/YYYY') : '',
        hallName: selectedHall?.TenSanh || '',
        hallId: values.hallId,
        shiftId: values.shiftId,
        shiftName: shiftName,
        numberOfGuests: values.guestCount || 0,
        guestCount: values.guestCount || 0,
        services: values.services || {},
        foods: values.foods || {},
        foodsData: foods || []
      };

      // Cập nhật wedding history trong Redux
      const weddingHistoryData = {
        ID_TiecCuoi: successData.ID_TiecCuoi,
        TenSanh: selectedHall?.TenSanh || '',
        LoaiSanh: selectedHall?.TenLoai || 'Chung',
        TenCa: shiftName,
        SoLuongBan: values.tableCount || 0,
        SoBanDuTru: 0,
        ThoiDiemDat: new Date().toISOString(),
        TongDaThanhToan: Math.round(totalAmount * 0.5), // Tiền cọc
        TrangThai: 'Đang xử lý',
        NgayToChuc: values.date ? values.date.format('YYYY-MM-DD') : null
      };
      
      dispatch(addWeddingToHistory(weddingHistoryData));
      
      // Save to localStorage as backup
      localStorage.setItem('bookingSuccessData', JSON.stringify(successData));
        // IMPORTANT: Navigate to success page with replace: true to prevent going back to form
      console.log('Navigating to success page with data:', JSON.stringify(successData));
      
      // Save to sessionStorage for more reliable state persistence between routes
      sessionStorage.setItem('bookingSuccessData', JSON.stringify(successData));
      
      // Navigate immediately
      navigate('/booking/success', { 
        state: successData, 
        replace: true 
      });
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      
      // Show error message
      message.error({
        content: error.message || 'Có lỗi xảy ra khi đặt tiệc. Vui lòng thử lại.',
        key: 'bookingSubmit'
      });
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Alert
          type="error"
          message="Lỗi"
          description={error}
          style={{ marginBottom: 16 }}
        />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Đặt Tiệc Cưới</Title>
      
      <Steps 
        current={currentStep}
        onChange={(step) => {
          // Validate current step before allowing navigation
          if (currentStep === 0 && step > currentStep) {
            form.validateFields(['hallId', 'date', 'shiftId', 'guestCount'])
              .then(() => {
                const values = form.getFieldsValue(true);
                calculateTotal(values);
                setCurrentStep(step);
              })
              .catch(() => {
                message.error('Vui lòng điền đầy đủ thông tin cần thiết');
              });          } else if (currentStep === 1 && step > currentStep) {
            // Không còn bước thông tin liên hệ, chuyển thẳng sang xác nhận đặt tiệc
            setCurrentStep(step);
          } else {
            // For other steps or going back, just update
            const values = form.getFieldsValue(true);
            calculateTotal(values);
            setCurrentStep(step);
          }
        }}
        style={{ marginBottom: 32 }}
      >
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <Form 
        form={form} 
        layout="vertical"
        onValuesChange={(changedValues, allValues) => {
          // Chỉ thực hiện tính toán lại nếu thay đổi các giá trị quan trọng
          const importantFields = ['hallId', 'services', 'guestCount'];
          const hasImportantChanges = Object.keys(changedValues).some(key => importantFields.includes(key));
          
          if (hasImportantChanges) {
            handleFormChange(changedValues, allValues);
          }
        }}
      >
        {steps[currentStep].content}
        
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          {currentStep > 0 && (
            <Button 
              style={{ marginRight: 8 }} 
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
                  .then(() => {
                    const values = form.getFieldsValue(true);
                    
                    // Nếu là bước 0 và đang chuyển sang bước 1, cần đảm bảo đã có thông tin sảnh
                    if (currentStep === 0 && values.hallId) {
                      // Đảm bảo selectedHall được cập nhật khi chuyển bước
                      fetchHallDetails(values.hallId);
                    }
                    
                    calculateTotal(values);
                    setCurrentStep(currentStep + 1);
                  })
                  .catch(() => {
                    message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                  });
              }}
            >
              Tiếp theo
            </Button>
          )}
            {currentStep === steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={async () => {                try {
                  // Validate only required fields without contact info
                  await form.validateFields(['hallId', 'date', 'shiftId', 'guestCount', 'tableCount']);
                  // Additional validation for key fields
                  const values = form.getFieldsValue(true);
                  if (!values.hallId || !values.date || !values.shiftId) {
                    message.error('Vui lòng điền đầy đủ thông tin cơ bản');
                    return;
                  }
                  
                  // Check if user is logged in
                  if (!authService.isLoggedIn()) {
                    message.error('Bạn cần đăng nhập để đặt tiệc');
                    navigate('/login');
                    return;
                  }
                  
                  // If all validation passes, submit booking
                  await submitBooking();
                } catch (error) {
                  console.error('Validation error:', error);
                  message.error('Vui lòng kiểm tra lại thông tin đặt tiệc');
                }
              }}
              loading={submitting}
            >
              Xác nhận đặt tiệc
            </Button>
          )}
        </div>
      </Form>
    </UserLayout>
  );
};

export default BookingFormPage;
