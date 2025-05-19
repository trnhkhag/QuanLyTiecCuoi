import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWeddingById } from '../services/weddingApi';
import '../../css/WeddingDetail.css';

const WeddingDetail = () => {
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);
  const [error, setError] = useState(null);

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
      }
    };

    fetchWedding();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!wedding) return <p>Đang tải...</p>;

  return (
    <div className="wedding-detail-container" style={{ padding: '20px' }}>
      <h2>Chi tiết tiệc cưới #{wedding.ID_TiecCuoi}</h2>

      <section className="detail-section" style={{ marginBottom: '20px' }}>
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
      </section>

      <section className="detail-section">
        <h3>Dịch vụ đã đặt</h3>
        {wedding.services && wedding.services.length > 0 ? (
          <table className="services-table" border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
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
          </table>
        ) : (
          <p>Không có dịch vụ nào</p>
        )}
      </section>
    </div>
  );
};

export default WeddingDetail;