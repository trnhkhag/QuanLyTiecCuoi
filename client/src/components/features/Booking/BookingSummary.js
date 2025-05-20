import React, { useState, useEffect } from 'react';
import { ListGroup, Form, Row, Col } from 'react-bootstrap';
import { FormattedPrice } from '../../common/StatusComponents';

function BookingSummary({ 
  formData, 
  halls, 
  selectedHall,
  calculateTotal, 
  deposit,
  handleDepositChange 
}) {
  // State to hold calculated values
  const [hallInfo, setHallInfo] = useState(null);
  const [servicesTotal, setServicesTotal] = useState(0);
  const [hallPrice, setHallPrice] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Find hall information from ID
  useEffect(() => {
    const getHallInfo = () => {
      if (selectedHall) return selectedHall;
      
      if (!formData.hallId) return null;
      
      return halls.find(hall => hall.ID_SanhTiec === parseInt(formData.hallId));
    };
    
    const currentHallInfo = getHallInfo();
    setHallInfo(currentHallInfo);
    setHallPrice(currentHallInfo ? currentHallInfo.GiaThue : 0);
  }, [selectedHall, formData.hallId, halls]);
    // Calculate services total whenever selectedServices changes
  useEffect(() => {
    const calculateServicesTotal = () => {
      // Safety check for services
      if (!formData.selectedServices || Object.keys(formData.selectedServices).length === 0) {
        console.log('No services selected, setting total to 0');
        return 0;
      }
      
      console.log('Calculating services total from:', formData.selectedServices);
      
      try {
        // Calculate total with detailed logging
        let runningTotal = 0;
        
        Object.entries(formData.selectedServices).forEach(([id, service]) => {
          // Ensure price and quantity are numbers
          const price = Number(service.price) || 0;
          const quantity = Number(service.quantity) || 0;
          const serviceTotal = price * quantity;
          
          console.log(`Service ${id} (${service.name}): ${price} x ${quantity} = ${serviceTotal}`);
          runningTotal += serviceTotal;
        });
        
        console.log('Services total calculated:', runningTotal);
        return runningTotal;
      } catch (error) {
        console.error('Error calculating services total:', error);
        return 0;
      }
    };
    
    const newServicesTotal = calculateServicesTotal();
    console.log('Setting services total state:', newServicesTotal);
    setServicesTotal(newServicesTotal);
  }, [formData.selectedServices]);
  // Update total whenever hallPrice or servicesTotal changes
  useEffect(() => {
    // Convert to numbers explicitly to ensure proper addition
    const hallPriceNum = Number(hallPrice) || 0;
    const servicesTotalNum = Number(servicesTotal) || 0;
    const newTotal = hallPriceNum + servicesTotalNum;
    
    console.log('Updating total calculation:', { 
      hallPrice: hallPriceNum, 
      servicesTotal: servicesTotalNum, 
      newTotal: newTotal 
    });
    
    setTotal(newTotal);
  }, [hallPrice, servicesTotal]);  // Calculate deposit (default is 50% of total)
  const [defaultDeposit, setDefaultDeposit] = useState(0);
  
  // Update default deposit when total changes
  useEffect(() => {
    // Calculate the true total directly for deposit calculation
    const trueTotal = Number(hallPrice) + Number(servicesTotal);
    console.log('Calculating deposit based on total:', trueTotal);
    setDefaultDeposit(Math.round(trueTotal * 0.5));
  }, [hallPrice, servicesTotal, total]);
  
  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span>Thông tin cơ bản:</span>
          </div>
          <div className="ms-3 mt-2">
            {/* {formData.groomName && formData.brideName ? (
              <div><small>Cặp đôi: {formData.groomName} & {formData.brideName}</small></div>
            ) : null} */}

            {formData.customerName ? (
              <div><small>Khách hàng: {formData.customerName}</small></div>
            ) : null}
            
            {formData.weddingDate ? (
              <div><small>Ngày: {new Date(formData.weddingDate).toLocaleDateString('vi-VN')}</small></div>
            ) : null}
            
            {formData.numberOfGuests ? (
              <div><small>Số khách: {formData.numberOfGuests}</small></div>
            ) : null}
            
            {formData.numberOfTables ? (
              <div><small>Số bàn: {formData.numberOfTables}</small></div>
            ) : null}
          </div>
        </ListGroup.Item>
        
        <ListGroup.Item>
          <div className="d-flex justify-content-between">
            <span>Sảnh tiệc:</span>
            <span>{hallInfo ? <FormattedPrice amount={hallInfo.GiaThue} /> : '-'}</span>
          </div>
          {hallInfo && (
            <div className="ms-3 mt-2">
              <small>{hallInfo.TenSanh} - Sức chứa: {hallInfo.SucChua} khách</small>
            </div>
          )}
        </ListGroup.Item>
          {Object.keys(formData.selectedServices || {}).length > 0 && (
          <ListGroup.Item>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Dịch vụ bổ sung:</span>
              <span className="fw-bold">{servicesTotal > 0 ? <FormattedPrice amount={servicesTotal} /> : '-'}</span>
            </div>
            <div className="ms-3 mt-2">
              {Object.entries(formData.selectedServices || {}).map(([serviceId, details]) => {
                // Ensure price and quantity are numbers
                const price = Number(details.price) || 0;
                const quantity = Number(details.quantity) || 0;
                const itemTotal = price * quantity;
                
                return (
                  <div key={serviceId} className="d-flex justify-content-between mb-1">
                    <small>{details.name} x{quantity}</small>
                    <small className="text-primary"><FormattedPrice amount={itemTotal} /></small>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 border-top pt-1 text-end">
              <small className="text-muted">
                Tổng dịch vụ: <FormattedPrice amount={servicesTotal} />
              </small>
            </div>
          </ListGroup.Item>
        )}          <ListGroup.Item className="fw-bold bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fs-5">Tổng tiền:</span>
            <span className="fs-5 text-success">
              {total > 0 ? (
                <FormattedPrice amount={Number(hallPrice) + Number(servicesTotal)} />
              ) : '-'}
            </span>
          </div>
          <div className="small mt-1 text-muted">
            <div className="d-flex justify-content-between">
              <span>Sảnh cưới:</span> 
              <span><FormattedPrice amount={hallPrice} /></span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Dịch vụ bổ sung:</span> 
              <span><FormattedPrice amount={servicesTotal} /></span>
            </div>
          </div>
        </ListGroup.Item>
        
        <ListGroup.Item>
          <Form.Group as={Row}>
            <Form.Label column>Tiền cọc (50%):</Form.Label>
            <Col>
              {/* Ẩn input số thực để lưu giá trị */}
              <Form.Control
                type="number"
                className="d-none"
                value={deposit || defaultDeposit}
                onChange={handleDepositChange}
              />
              
              {/* Hiển thị input có định dạng tiền tệ */}
              <div className="position-relative">
                <Form.Control
                  type="text"
                  value={(deposit || defaultDeposit).toLocaleString('vi-VN')}
                  onChange={(e) => {
                    // Chuyển chuỗi có định dạng về số
                    const rawValue = e.target.value.replace(/\./g, '');
                    if (!isNaN(rawValue) && rawValue.trim() !== '') {
                      handleDepositChange({
                        target: { name: 'deposit', value: parseInt(rawValue) }
                      });
                    }
                  }}
                  className="pe-4"
                />
                <span className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted">
                  VNĐ
                </span>
              </div>
            </Col>
          </Form.Group>          <div className="text-end mt-2">
            <small>Còn lại: <FormattedPrice 
              amount={(Number(hallPrice) + Number(servicesTotal)) - (deposit || defaultDeposit)} 
            /></small>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

export default BookingSummary;