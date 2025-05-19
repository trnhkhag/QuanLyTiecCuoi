import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

//Hàm xử lý ngày tháng
function parseDate(dateString) {
  try {
    // Nếu là chuỗi YYYY-MM-DD, thêm giờ để tránh vấn đề múi giờ
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateString = dateString + 'T12:00:00';  // Thêm giờ noon để tránh vấn đề múi giờ
    }
    
    const date = new Date(dateString);
    
    // Kiểm tra xem date có hợp lệ không
    return !isNaN(date.getTime()) ? date : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

function BookingBasicInfo({
  formData,
  handleInputChange,
  handleDateChange,
  shifts,
  halls,
  handleHallSelect,
  preSelectedHallId,
  errors = {}
}) {
  return (
    <>
      <h5 className="mb-3">Thông tin khách hàng</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={formData.customerName || ""}
              onChange={handleInputChange}
              isInvalid={errors.customerName}
              required
            />
            {errors.customerName && (
              <Form.Control.Feedback type="invalid">
                {errors.customerName}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              isInvalid={errors.phoneNumber}
              required
            />
            {errors.phoneNumber && (
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              isInvalid={errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />
      
      <h5 className="mb-3">Thông tin tiệc cưới</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ngày tổ chức</Form.Label>
            <DatePicker
              selected={formData.weddingDate ? parseDate(formData.weddingDate) : null}
              onChange={date => handleDateChange("weddingDate", date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className={`form-control ${errors.weddingDate ? 'is-invalid' : ''}`}
              required
            />
            {errors.weddingDate && (
              <div className="invalid-feedback">
                {errors.weddingDate}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ca</Form.Label>
            <Form.Select
              name="shiftId"
              value={formData.shiftId || ""}
              onChange={handleInputChange}
              isInvalid={errors.shiftId}
              required
            >
              <option value="">Chọn ca</option>
              {shifts.map(shift => (
                <option key={shift.ID_Ca} value={shift.ID_Ca}>
                  {shift.TenCa} ({shift.GioBatDau} - {shift.GioKetThuc})
                </option>
              ))}
            </Form.Select>
            {errors.shiftId && (
              <Form.Control.Feedback type="invalid">
                {errors.shiftId}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số khách dự kiến</Form.Label>
            <Form.Control
              type="number"
              name="numberOfGuests"
              value={formData.numberOfGuests || ""}
              onChange={handleInputChange}
              isInvalid={errors.numberOfGuests}
              min="1"
            />
            {errors.numberOfGuests && (
              <Form.Control.Feedback type="invalid">
                {errors.numberOfGuests}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số bàn dự kiến</Form.Label>
            <Form.Control
              type="number"
              name="numberOfTables"
              value={formData.numberOfTables || ""}
              onChange={handleInputChange}
              isInvalid={errors.numberOfTables}
              min="1"
            />
            {errors.numberOfTables && (
              <Form.Control.Feedback type="invalid">
                {errors.numberOfTables}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>
      
      {!preSelectedHallId && (
        <Row className="mb-3">
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Sảnh cưới</Form.Label>
              <Form.Select
                name="hallId"
                value={formData.hallId || ""}
                onChange={(e) => handleHallSelect(e.target.value)}
                isInvalid={errors.hallId}
                required
              >
                <option value="">Chọn sảnh cưới</option>
                {halls.map(hall => (
                  <option key={hall.ID_SanhTiec} value={hall.ID_SanhTiec}>
                    {hall.TenSanh} - Sức chứa: {hall.SucChua} khách - Giá: {hall.GiaThue.toLocaleString()} VNĐ
                  </option>
                ))}
              </Form.Select>
              {errors.hallId && (
                <Form.Control.Feedback type="invalid">
                  {errors.hallId}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
      )}
      
      <Row className="mb-3">
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

export default BookingBasicInfo;