import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FormattedPrice } from '../common/StatusComponents';

/**
 * Component để chọn dịch vụ bổ sung
 */
function ServiceSelection({ services, selectedServices, handleServiceSelection, handleServiceQuantity }) {
  return (
    <div className="service-selection">
      <h5 className="mb-3">Dịch vụ bổ sung</h5>
      
      <Row>
        {services.map(service => {
          const selectedService = selectedServices.find(s => s.id === service.id);
          
          return (
            <Col md={6} className="mb-3" key={service.id}>
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={!!selectedService}
                  onChange={() => handleServiceSelection(service.id)}
                  label={
                    <span>
                      {service.name}
                      <br />
                      <small className="text-muted"><FormattedPrice amount={service.price} /></small>
                    </span>
                  }
                />
              </div>
              
              {selectedService && (
                <div className="ms-4 mt-2">
                  <Form.Group>
                    <Form.Label>Số lượng</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control 
                        type="number" 
                        min="1"
                        value={selectedService.quantity} 
                        onChange={(e) => handleServiceQuantity(service.id, e.target.value)}
                        style={{width: '100px'}}
                      />
                      <span className="ms-3">
                        Thành tiền: <FormattedPrice amount={service.price * selectedService.quantity} />
                      </span>
                    </div>
                  </Form.Group>
                </div>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default ServiceSelection;
