import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import RegulationService from '../services/RegulationService';

/**
 * Trang quản lý quy định
 */
function RegulationManagementPage() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch regulations on component mount
  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const response = await RegulationService.getRegulations();
      if (response.success) {
        setRegulations(response.data);
      } else {
        setError('Không thể tải danh sách quy định');
      }
    } catch (err) {
      console.error('Error fetching regulations:', err);
      setError(err.message || 'Không thể tải danh sách quy định. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening edit modal
  const handleEdit = async (regulation) => {
    try {
      const response = await RegulationService.getRegulationById(regulation.ID_QuyDinh);
      if (response.success) {
        const regulationDetail = response.data;
        setSelectedRegulation(regulationDetail);
        setEditForm({
          id: regulationDetail.ID_QuyDinh,
          description: regulationDetail.MoTa,
          note: regulationDetail.GhiChu,
          details: regulationDetail.details
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching regulation details:', error);
      setError('Không thể tải chi tiết quy định');
    }
  };

  // Handle saving changes
  const handleSave = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await RegulationService.updateRegulation(editForm.id, editForm);
      
      if (response.success) {
        await fetchRegulations(); // Refresh the list
        setShowModal(false);
      } else {
        setSubmitError(response.message || 'Không thể cập nhật quy định');
      }
    } catch (error) {
      console.error('Error saving regulation:', error);
      setSubmitError(error.message || 'Đã xảy ra lỗi khi cập nhật quy định');
    } finally {
      setSubmitting(false);
    }
  };

  // Render form based on regulation type
  const renderEditForm = () => {
    if (!selectedRegulation) return null;

    switch (selectedRegulation.ID_QuyDinh) {
      case 'QD1':
        return (
          <>
            <h5>Loại sảnh và đơn giá tối thiểu</h5>
            {editForm.details?.halls?.map((hall, index) => (
              <Row key={hall.LoaiSanh} className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Loại sảnh {hall.LoaiSanh}</Form.Label>
                    <Form.Control
                      type="number"
                      value={hall.GiaBanToiThieu}
                      onChange={(e) => {
                        const newHalls = [...editForm.details.halls];
                        newHalls[index] = {
                          ...hall,
                          GiaBanToiThieu: parseInt(e.target.value)
                        };
                        setEditForm({
                          ...editForm,
                          details: { ...editForm.details, halls: newHalls }
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </>
        );

      case 'QD2':
        return (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số lượng dịch vụ tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    value={editForm.details?.SoLuongDichVuToiDa}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      details: { 
                        ...editForm.details, 
                        SoLuongDichVuToiDa: parseInt(e.target.value) 
                      }
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số lượng món ăn tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    value={editForm.details?.SoLuongMonAnToiDa}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      details: { 
                        ...editForm.details, 
                        SoLuongMonAnToiDa: parseInt(e.target.value) 
                      }
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        );

      case 'QD4':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Phần trăm phạt mỗi ngày (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={editForm.details?.TyLePhat}
                onChange={(e) => setEditForm({
                  ...editForm,
                  details: { 
                    ...editForm.details, 
                    TyLePhat: parseFloat(e.target.value) 
                  }
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="penalty-switch"
                label="Áp dụng quy định phạt"
                checked={editForm.details?.ApDung}
                onChange={(e) => setEditForm({
                  ...editForm,
                  details: { 
                    ...editForm.details, 
                    ApDung: e.target.checked 
                  }
                })}
              />
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) return (
    <BookingLayout>
      <LoadingSpinner text="Đang tải danh sách quy định..." />
    </BookingLayout>
  );

  if (error) return (
    <BookingLayout>
      <ErrorMessage message={error} />
    </BookingLayout>
  );

  return (
    <BookingLayout>
      <Container className="py-4">
        <h1 className="mb-4">Quản lý quy định</h1>

        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr className="bg-light">
                  <th width="50">STT</th>
                  <th width="120">MS Qui định</th>
                  <th width="150">Tên qui định</th>
                  <th>Mô tả chi tiết</th>
                  <th width="200">Ghi chú</th>
                  <th width="100">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {regulations.map((regulation, index) => (
                  <tr key={regulation.ID_QuyDinh}>
                    <td className="text-center">{index + 1}</td>
                    <td>{regulation.ID_QuyDinh}</td>
                    <td>{regulation.TenQuyDinh}</td>
                    <td style={{ whiteSpace: 'pre-line' }}>{regulation.MoTa}</td>
                    <td>{regulation.GhiChu}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(regulation)}
                      >
                        Chỉnh sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa {selectedRegulation?.TenQuyDinh}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {submitError && (
              <ErrorMessage message={submitError} />
            )}
            
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.note || ''}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                />
              </Form.Group>

              <hr />

              {renderEditForm()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </BookingLayout>
  );
}

export default RegulationManagementPage;