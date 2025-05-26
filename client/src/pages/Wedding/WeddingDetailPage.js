import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Spinner, Alert, Table, Row, Col, Badge, Button } from 'react-bootstrap';
import { getWeddingById } from '../../services/weddingLookupService';
import BookingLayout from '../../components/layout/Booking/BookingLayout';

function WeddingDetailPage() {
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        setLoading(true);
        const response = await getWeddingById(id);
        
        // Kiểm tra format dữ liệu trả về
        if (response && (response.data || response.success)) {
          // Nếu response có cấu trúc { success, data } hoặc có data trực tiếp
          const weddingData = response.data || response;
          setWedding(weddingData);
        } else {
          // Nếu response là dữ liệu trực tiếp
          setWedding(response);
        }
      } catch (err) {
        console.error("Error fetching wedding:", err);
        setError('Không thể tải thông tin tiệc cưới. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWedding();
    }
  }, [id]);

  // Hàm format số tiền
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return Number(value).toLocaleString('vi-VN') + ' VND';
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  // Hàm format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (error) {
      return 'Thời gian không hợp lệ';
    }
  };

  // Hàm xác định màu cho trạng thái
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Không xác định</Badge>;
    
    switch (status.toLowerCase()) {
      case 'đã thanh toán':
      case 'confirmed':
      case 'completed':
        return <Badge bg="success">{status}</Badge>;
      case 'đang xử lý':
      case 'pending':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'đã hủy':
      case 'cancelled':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  // Tính tổng tiền dịch vụ
  const calculateServiceTotal = (services) => {
    if (!services || !Array.isArray(services) || services.length === 0) return 0;
    
    return services.reduce((total, service) => {
      const quantity = Number(service.SoLuong || 1);
      const price = Number(service.DonGia || service.Gia || 0);
      return total + (quantity * price);
    }, 0);
  };

  // Kiểm tra dữ liệu trước khi hiển thị
  const renderWeddingInfo = () => {
    if (!wedding) return <Alert variant="warning">Không có thông tin tiệc cưới</Alert>;

    const services = wedding.services || wedding.DichVu || [];
    const serviceTotal = calculateServiceTotal(services);
    const deposit = Number(wedding.TienCoc || 0);
    const hallPrice = Number(wedding.GiaThue || wedding.GiaThueSanh || 0);
    const totalAmount = serviceTotal + hallPrice;

    return (
      <>
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Thông tin tiệc cưới</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td><strong>Mã đơn:</strong></td>
                      <td>{wedding.ID_TiecCuoi || wedding.id || id}</td>
                    </tr>
                    <tr>
                      <td><strong>Khách hàng:</strong></td>
                      <td>{wedding.TenKhachHang || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Số điện thoại:</strong></td>
                      <td>{wedding.SoDienThoai || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Ngày tổ chức:</strong></td>
                      <td>{formatDate(wedding.NgayToChuc)}</td>
                    </tr>
                    <tr>
                      <td><strong>Thời điểm đặt:</strong></td>
                      <td>{formatDateTime(wedding.ThoiDiemDat || wedding.NgayDat)}</td>
                    </tr>
                    <tr>
                      <td><strong>Trạng thái:</strong></td>
                      <td>{getStatusBadge(wedding.TrangThai || wedding.status)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Thông tin sảnh tiệc</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td><strong>Sảnh:</strong></td>
                      <td>{wedding.TenSanh || wedding.SanhTiec?.TenSanh || `Sảnh ${wedding.ID_SanhTiec}` || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Ca:</strong></td>
                      <td>{wedding.TenCa || `Ca ${wedding.ID_Ca}` || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Giá thuê sảnh:</strong></td>
                      <td>{formatCurrency(wedding.GiaThue || wedding.GiaThueSanh)}</td>
                    </tr>
                    <tr>
                      <td><strong>Số lượng bàn chính:</strong></td>
                      <td>{wedding.SoLuongBan || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Số bàn dự trữ:</strong></td>
                      <td>{wedding.SoBanDuTru || 0}</td>
                    </tr>
                    <tr>
                      <td><strong>Tiền cọc:</strong></td>
                      <td>{deposit > 0 ? formatCurrency(deposit) : 'Chưa đặt cọc'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Dịch vụ đã đặt</h5>
          </Card.Header>
          <Card.Body>
            {services && services.length > 0 ? (
              <Table bordered hover responsive className="mt-2">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Tên dịch vụ</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, idx) => {
                    const quantity = Number(service.SoLuong || 1);
                    const price = Number(service.DonGia || service.Gia || 0);
                    const total = quantity * price;
                    
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{service.TenDichVu}</td>
                        <td>{quantity}</td>
                        <td>{formatCurrency(price)}</td>
                        <td>{formatCurrency(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Tổng tiền dịch vụ:</strong></td>
                    <td><strong>{formatCurrency(serviceTotal)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <p className="text-center">Không có dịch vụ nào được đặt</p>
            )}
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Tổng kết hoá đơn</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td><strong>Giá thuê sảnh:</strong></td>
                      <td>{formatCurrency(hallPrice)}</td>
                    </tr>
                    <tr>
                      <td><strong>Tổng tiền dịch vụ:</strong></td>
                      <td>{formatCurrency(serviceTotal)}</td>
                    </tr>
                    <tr>
                      <td><strong>Tổng cộng:</strong></td>
                      <td><strong>{formatCurrency(totalAmount)}</strong></td>
                    </tr>
                    <tr>
                      <td><strong>Đã cọc:</strong></td>
                      <td>{formatCurrency(deposit)}</td>
                    </tr>
                    <tr>
                      <td><strong>Còn lại:</strong></td>
                      <td><strong>{formatCurrency(totalAmount - deposit)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-between mb-4">
          <Link to="/booking/list">
            <Button variant="secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Quay lại danh sách
            </Button>
          </Link>
          
          {(wedding.TrangThai !== 'Đã hủy' && wedding.status !== 'cancelled') && (
            <div>
              <Link to={`/booking/${wedding.ID_TiecCuoi || wedding.id || id}/edit`}>
                <Button variant="primary" className="me-2">
                  <i className="bi bi-pencil me-2"></i>
                  Chỉnh sửa
                </Button>
              </Link>
              <Button variant="success">
                <i className="bi bi-printer me-2"></i>
                In hoá đơn
              </Button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <BookingLayout>
      <div className="d-flex justify-content-between mb-4">
        <h2>Chi tiết tiệc cưới #{id}</h2>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={() => window.location.reload()} variant="outline-danger">Thử lại</Button>
          </div>
        </Alert>
      ) : (
        renderWeddingInfo()
      )}
    </BookingLayout>
  );
}

export default WeddingDetailPage;