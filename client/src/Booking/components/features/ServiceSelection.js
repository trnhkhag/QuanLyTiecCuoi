import React, { useCallback } from 'react';
import { Row, Col, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { FormattedPrice } from '../common/StatusComponents';

function ServiceSelection({
  services,
  selectedServices,
  handleServiceSelection,
  handleServiceQuantity
}) {
  // Memoized function to check if service is selected
  const isServiceSelected = useCallback((serviceId) => {
    return selectedServices && selectedServices[serviceId] !== undefined;
  }, [selectedServices]);
  
  // Calculate total for a specific service
  const getServiceTotal = useCallback((serviceId) => {
    if (!selectedServices || !selectedServices[serviceId]) return 0;
    const { price, quantity } = selectedServices[serviceId];
    return price * quantity;
  }, [selectedServices]);
  
  return (
    <>
      <h5 className="mb-4">
        Chọn dịch vụ bổ sung
        {Object.keys(selectedServices || {}).length > 0 && (
          <Badge bg="success" className="ms-2">
            {Object.keys(selectedServices || {}).length} dịch vụ đã chọn
          </Badge>
        )}
      </h5>
      
      {services.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">Không có dịch vụ nào.</p>
        </div>
      ) : (
        <Row>
          {services.map(service => {
            const selected = isServiceSelected(service.ID_DichVu);
            return (
            <Col md={6} className="mb-4" key={service.ID_DichVu}>
              <Card 
                className={`h-100 ${selected ? 'border-primary shadow-sm' : ''}`}
                onClick={() => handleServiceSelection(service.ID_DichVu, service.DonGia)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>{service.TenDichVu}</Card.Title>
                      <Card.Text className={`${selected ? 'text-primary fw-bold' : 'text-muted'}`}>
                        <FormattedPrice amount={service.DonGia} />{' '}
                        {selected && (
                          <small>/ đơn vị</small>
                        )}
                      </Card.Text>
                    </div>
                    <Form.Check
                      type="checkbox"
                      checked={selected}
                      onChange={() => {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelection(service.ID_DichVu, service.DonGia);
                      }}
                    />
                  </div>
                  
                  {selected && (
                    <>
                      <div className="mt-3">
                        <InputGroup>
                          <InputGroup.Text>Số lượng</InputGroup.Text>
                          <Form.Control
                            type="number"
                            min="1"
                            value={selectedServices[service.ID_DichVu].quantity}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleServiceQuantity(service.ID_DichVu, parseInt(e.target.value) || 1)}
                          />
                        </InputGroup>
                      </div>
                      <div className="mt-2 text-end">
                        <small className="text-success fw-bold">
                          Thành tiền: <FormattedPrice amount={getServiceTotal(service.ID_DichVu)} />
                        </small>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )})}
        </Row>      )}
      
      {Object.keys(selectedServices || {}).length > 0 && (
        <div className="alert alert-success mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <strong>Tổng cộng:</strong> <FormattedPrice 
                amount={Object.values(selectedServices).reduce((sum, service) => sum + (service.price * service.quantity), 0)} 
              />
            </span>
            <span className="badge bg-success">{Object.keys(selectedServices).length} dịch vụ</span>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceSelection;