import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { searchWeddings } from '../services/WeddingLookupService';
import BookingLayout from '../components/layout/BookingLayout';

function WeddingLookupPage() {
  const [filters, setFilters] = useState({
    customerName: '',
    date: '',
    hallName: ''
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchWeddings(filters);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Lỗi khi gọi API');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/booking/weddings/${id}`);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const data = await searchWeddings({});
        setResults(data);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu ban đầu');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <BookingLayout>
      <h2 className="text-center mb-4">Tra cứu tiệc cưới</h2>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="customerName"
                  placeholder="Tên khách hàng"
                  value={filters.customerName}
                  onChange={handleChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="hallName"
                  placeholder="Tên sảnh"
                  value={filters.hallName}
                  onChange={handleChange}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Ngày tổ chức</th>
                <th>Ca</th>
                <th>Tên sảnh</th>
                <th>Số bàn</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Đang tải...</td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Không có kết quả</td>
                </tr>
              ) : (
                results.map((item) => (
                  <tr
                    key={item.ID_TiecCuoi}
                    onClick={() => handleRowClick(item.ID_TiecCuoi)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{item.ID_TiecCuoi}</td>
                    <td>{item.TenKhachHang}</td>
                    <td>{new Date(item.NgayToChuc).toLocaleDateString('vi-VN')}</td>
                    <td>{item.TenCa}</td>
                    <td>{item.TenSanh}</td>
                    <td>{item.SoLuongBan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </BookingLayout>
  );
}

export default WeddingLookupPage;