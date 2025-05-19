import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import BookingLayout from '../components/layout/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../components/common/StatusComponents';
import RegulationService from '../services/RegulationService';

function RegulationManagementPage() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRegulation, setCurrentRegulation] = useState({
    TenQuyDinh: '',
    MoTa: '',
    GhiChu: ''
  });

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      setLoading(true);
      const data = await RegulationService.getRegulations();
      setRegulations(data);
    } catch (err) {
      setError('Không thể tải danh sách quy định');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRegulation.ID_QuyDinh) {
        await RegulationService.updateRegulation(currentRegulation.ID_QuyDinh, currentRegulation);
      } else {
        await RegulationService.createRegulation(currentRegulation);
      }
      setShowModal(false);
      fetchRegulations();
    } catch (err) {
      console.error('Error saving regulation:', err);
      setError('Không thể lưu quy định');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <BookingLayout>
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quản lý quy định</h1>
          <Button variant="primary" onClick={() => {
            setCurrentRegulation({ TenQuyDinh: '', MoTa: '', GhiChu: '' });
            setShowModal(true);
          }}>
            Thêm quy định mới
          </Button>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên quy định</th>
              <th>Mô tả</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {regulations.map(reg => (
              <tr key={reg.ID_QuyDinh}>
                <td>{reg.ID_QuyDinh}</td>
                <td>{reg.TenQuyDinh}</td>
                <td>{reg.MoTa}</td>
                <td>{reg.GhiChu}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setCurrentRegulation(reg);
                      setShowModal(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={async () => {
                      if (window.confirm('Bạn có chắc muốn xóa quy định này?')) {
                        try {
                          await RegulationService.deleteRegulation(reg.ID_QuyDinh);
                          fetchRegulations();
                        } catch (err) {
                          console.error('Error deleting regulation:', err);
                          setError('Không thể xóa quy định');
                        }
                      }
                    }}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentRegulation.ID_QuyDinh ? 'Sửa quy định' : 'Thêm quy định mới'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên quy định</Form.Label>
                <Form.Control
                  type="text"
                  value={currentRegulation.TenQuyDinh}
                  onChange={(e) => setCurrentRegulation({
                    ...currentRegulation,
                    TenQuyDinh: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentRegulation.MoTa}
                  onChange={(e) => setCurrentRegulation({
                    ...currentRegulation,
                    MoTa: e.target.value
                  })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  type="text"
                  value={currentRegulation.GhiChu}
                  onChange={(e) => setCurrentRegulation({
                    ...currentRegulation,
                    GhiChu: e.target.value
                  })}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  Lưu
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </BookingLayout>
  );
}

export default RegulationManagementPage;