import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Alert, Table } from 'react-bootstrap';
import { getWeddingById } from '../services/WeddingLookupService';
import BookingLayout from '../components/layout/BookingLayout';

function WeddingDetailPage() {
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const response = await getWeddingById(id); // response = { success, data }
        if (response.success) {
          setWedding(response.data);
        } else {
          throw new Error('Dữ liệu không hợp lệ');
        }
      } catch (err) {
        setError('Không thể tải thông tin tiệc cưới');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  return (
    <BookingLayout>
      <h2 className="mb-4">Chi tiết tiệc cưới #{id}</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h5>Thông tin tiệc cưới</h5>
              <p><strong>Khách hàng:</strong> {wedding.TenKhachHang}</p>
              <p><strong>Số điện thoại:</strong> {wedding.SoDienThoai}</p>
              <p><strong>Ngày tổ chức:</strong> {new Date(wedding.NgayToChuc).toLocaleDateString('vi-VN')}</p>
              <p><strong>Ca:</strong> {wedding.TenCa}</p>
              <p><strong>Sảnh:</strong> {wedding.TenSanh}</p>
              <p><strong>Giá thuê sảnh:</strong> {Number(wedding.GiaThue).toLocaleString('vi-VN')} VND</p>
              <p><strong>Số lượng bàn:</strong> {wedding.SoLuongBan}</p>
              <p><strong>Số bàn dự trữ:</strong> {wedding.SoBanDuTru}</p>
              <p><strong>Tiền cọc:</strong> {wedding.TienCoc ? Number(wedding.TienCoc).toLocaleString('vi-VN') + ' VND' : 'Chưa đặt cọc'}</p>
              <p><strong>Thời điểm đặt:</strong> {new Date(wedding.ThoiDiemDat).toLocaleString('vi-VN')}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5>Dịch vụ đã đặt</h5>
              {wedding.services && wedding.services.length > 0 ? (
                <Table bordered hover responsive className="mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>Tên dịch vụ</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wedding.services.map((service, idx) => (
                      <tr key={idx}>
                        <td>{service.TenDichVu}</td>
                        <td>{service.SoLuong}</td>
                        <td>{Number(service.DonGia).toLocaleString('vi-VN')} VND</td>
                        <td>{(Number(service.DonGia) * service.SoLuong).toLocaleString('vi-VN')} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Không có dịch vụ nào</p>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </BookingLayout>
  );
}

export default WeddingDetailPage;