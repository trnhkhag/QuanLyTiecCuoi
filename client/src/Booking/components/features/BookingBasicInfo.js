import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Component form thông tin cơ bản của đặt tiệc
 */
function BookingBasicInfo({ formData, handleInputChange, handleDateChange, shifts, halls, handleHallSelect }) {
  return (
    <>
      {/* Thông tin cặp đôi */}
      <h5 className="mb-3">Thông tin cặp đôi</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tên chú rể</Form.Label>
            <Form.Control 
              type="text" 
              name="groomName" 
              value={formData.groomName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tên cô dâu</Form.Label>
            <Form.Control 
              type="text" 
              name="brideName" 
              value={formData.brideName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control 
              type="tel" 
              name="phoneNumber" 
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      {/* Thông tin tiệc cưới */}
      <h5 className="mt-4 mb-3">Thông tin tiệc cưới</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ngày tổ chức</Form.Label>
            <DatePicker
              selected={formData.weddingDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="form-control"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ca</Form.Label>
            <Form.Select 
              name="shiftId" 
              value={formData.shiftId}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Chọn ca --</option>
              {shifts.map(shift => (
                <option key={shift.id} value={shift.id}>
                  {shift.name} ({shift.startTime} - {shift.endTime})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Sảnh tiệc</Form.Label>
            <Form.Select 
              name="hallId" 
              value={formData.hallId}
              onChange={(e) => handleHallSelect(e.target.value)}
              required
            >
              <option value="">-- Chọn sảnh --</option>
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>
                  {hall.name} - {hall.type} (Sức chứa: {hall.capacity} khách)
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng bàn</Form.Label>
            <Form.Control 
              type="number" 
              name="tableCount" 
              value={formData.tableCount}
              onChange={handleInputChange}
              min="1"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số bàn dự trù</Form.Label>
            <Form.Control 
              type="number" 
              name="reserveTableCount" 
              value={formData.reserveTableCount}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default BookingBasicInfo;
