import React, { useState, useEffect } from 'react';
import { Container, Table, Card } from 'react-bootstrap';
import BookingLayout from '../../components/layout/Booking/BookingLayout';
import { LoadingSpinner, ErrorMessage } from '../../components/common/StatusComponents';
import RegulationService from '../../services/RegulationService';

/**
 * Trang hiển thị danh sách quy định
 */
function RegulationListPage() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchRegulations();
  }, []);

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
        <h1 className="mb-4">Danh sách quy định</h1>

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
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </BookingLayout>
  );
}

export default RegulationListPage;