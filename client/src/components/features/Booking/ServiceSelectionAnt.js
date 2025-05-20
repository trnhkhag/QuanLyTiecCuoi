import React, { useCallback, useState, useEffect } from 'react';
import { Row, Col, Card, Checkbox, InputNumber, Badge, Alert, Typography } from 'antd';
import { FormattedPrice } from '../../common/FormattedPrice';

const { Text, Title } = Typography;

/**
 * Component dùng để lựa chọn dịch vụ với giao diện Ant Design
 * @param {Array} services - Danh sách dịch vụ
 * @param {Object} value - Giá trị hiện tại (được quản lý bởi Form.Item)
 * @param {Function} onChange - Hàm callback khi lựa chọn thay đổi (được gọi bởi Form.Item)
 */
const ServiceSelectionAnt = ({ services = [], value = {}, onChange }) => {
  const [selectedServices, setSelectedServices] = useState(value || {});
  
  // Cập nhật state khi value thay đổi từ bên ngoài (Form)
  useEffect(() => {
    if (value) {
      setSelectedServices(value);
    }
  }, [value]);
    // Memoized function để kiểm tra dịch vụ đã được chọn chưa
  const isServiceSelected = useCallback((serviceId) => {
    return selectedServices && selectedServices[serviceId] !== undefined;
  }, [selectedServices]);
  
  // Tính tổng cho một dịch vụ cụ thể
  const getServiceTotal = useCallback((serviceId) => {
    if (!selectedServices || !selectedServices[serviceId]) return 0;
    const { price, quantity } = selectedServices[serviceId];
    
    // Đảm bảo chuyển đổi đúng kiểu dữ liệu
    const numericPrice = parseFloat(price) || 0;
    const numericQuantity = parseInt(quantity) || 0;
    const total = numericPrice * numericQuantity;
    
    console.log(`Service ${serviceId} total: ${numericPrice} x ${numericQuantity} = ${total}`);
    return total;
  }, [selectedServices]);
    // Tính tổng tiền tất cả dịch vụ
  const calculateTotal = useCallback(() => {
    if (!selectedServices) return 0;
    
    let total = 0;
    
    // Tính tổng và log để kiểm tra
    Object.entries(selectedServices).forEach(([id, service]) => {
      const price = parseFloat(service.price) || 0;
      const quantity = parseInt(service.quantity) || 0;
      const serviceTotal = price * quantity;
      
      total += serviceTotal;
      console.log(`Service in total (${service.name}): ${price} x ${quantity} = ${serviceTotal}`);
    });
    
    console.log(`Service selection total: ${total}`);
    return total;
  }, [selectedServices]);
  // Hàm xử lý khi người dùng chọn/bỏ chọn dịch vụ
  const handleServiceSelection = (serviceId, price, name) => {
    const newSelectedServices = { ...selectedServices };
    
    if (isServiceSelected(serviceId)) {
      delete newSelectedServices[serviceId];
    } else {
      // Đảm bảo price được chuyển đổi thành số
      const numericPrice = parseFloat(price) || 0;
      
      newSelectedServices[serviceId] = {
        price: numericPrice,
        quantity: 1,
        name
      };
      
      console.log(`Chọn dịch vụ: ${name}, ID: ${serviceId}, Giá: ${numericPrice}`);
    }
    
    setSelectedServices(newSelectedServices);
    if (onChange) {
      onChange(newSelectedServices);
    }
  };
  // Hàm xử lý khi người dùng thay đổi số lượng
  const handleQuantityChange = (serviceId, quantity) => {
    if (!selectedServices[serviceId]) return;
    
    // Đảm bảo số lượng là số nguyên dương
    const numQuantity = parseInt(quantity) || 1;
    
    const newSelectedServices = {
      ...selectedServices,
      [serviceId]: {
        ...selectedServices[serviceId],
        quantity: numQuantity
      }
    };
    
    console.log(`Thay đổi số lượng cho dịch vụ ID ${serviceId}: ${numQuantity}`);
    
    setSelectedServices(newSelectedServices);
    if (onChange) {
      onChange(newSelectedServices);
    }
  };
  
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {Object.keys(selectedServices).length > 0 && (
          <Badge count={Object.keys(selectedServices).length} style={{ backgroundColor: '#52c41a' }}>
            <Text type="success">dịch vụ đã chọn</Text>
          </Badge>
        )}
      </div>
        {/* Debug để kiểm tra dữ liệu dịch vụ */}
      {console.log("ServiceSelectionAnt received services:", services)}
      
      {!services || services.length === 0 ? (
        <Alert message="Không có dịch vụ nào." type="info" showIcon />
      ) : (
        <Row gutter={[16, 16]}>
          {services.map(service => {
            const selected = isServiceSelected(service.ID_DichVu);
            return (
              <Col xs={24} md={12} key={service.ID_DichVu}>
                <Card 
                  hoverable 
                  bordered={true}                  style={{ 
                    cursor: 'pointer',
                    borderColor: selected ? '#1890ff' : undefined,
                    boxShadow: selected ? '0 0 8px rgba(24,144,255,0.5)' : undefined 
                  }}
                  onClick={() => handleServiceSelection(service.ID_DichVu, parseFloat(service.DonGia), service.TenDichVu)}
                >                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={5} style={{ marginTop: 0 }}>{service.TenDichVu}</Title>
                      <Text type={selected ? "success" : "secondary"} strong={selected}>
                        <FormattedPrice amount={parseFloat(service.DonGia)} />{' '}
                        {selected && <small>/ đơn vị</small>}
                      </Text>
                    </div>
                    <Checkbox 
                      checked={selected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleServiceSelection(service.ID_DichVu, parseFloat(service.DonGia), service.TenDichVu);
                      }}
                    />
                  </div>
                  
                  {selected && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Số lượng:</Text>
                        <InputNumber 
                          min={1} 
                          value={selectedServices[service.ID_DichVu].quantity}
                          onChange={(value) => {
                            handleQuantityChange(service.ID_DichVu, value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: '50%' }}
                        />
                      </div>
                      <div style={{ textAlign: 'right', marginTop: 8 }}>
                        <Text type="success" strong>
                          Thành tiền: <FormattedPrice amount={getServiceTotal(service.ID_DichVu)} />
                        </Text>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      
      {Object.keys(selectedServices).length > 0 && (
        <Alert
          message={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>
                Tổng cộng: <FormattedPrice amount={calculateTotal()} />
              </Text>
              <Badge count={Object.keys(selectedServices).length} style={{ backgroundColor: '#52c41a' }} />
            </div>
          }
          type="success"
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default ServiceSelectionAnt;