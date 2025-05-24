import React from 'react';
import './ProfileComponents.css';

const WeddingHistory = ({ history }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Đã xác nhận': { class: 'status-confirmed', icon: 'fas fa-check-circle' },
      'Đã hoàn thành': { class: 'status-completed', icon: 'fas fa-star' },
      'Đang xử lý': { class: 'status-processing', icon: 'fas fa-clock' },
      'Đã hủy': { class: 'status-cancelled', icon: 'fas fa-times-circle' },
    };
    
    const statusInfo = statusMap[status] || { class: 'status-default', icon: 'fas fa-info-circle' };
    
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        <i className={statusInfo.icon}></i>
        {status}
      </span>
    );
  };

  if (!history || history.length === 0) {
    return (
      <div className="profile-form-container">
        <div className="profile-form-header">
          <h3>Lịch sử tiệc cưới</h3>
        </div>
        <div className="empty-history">
          <i className="fas fa-calendar-times"></i>
          <p>Bạn chưa có lịch sử đặt tiệc cưới nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-form-container">
      <div className="profile-form-header">
        <h3>Lịch sử tiệc cưới</h3>
        <span className="history-count">{history.length} tiệc cưới</span>
      </div>

      <div className="wedding-history-list">
        {history.map((wedding, index) => (
          <div key={wedding.ID_TiecCuoi} className="wedding-history-item">
            <div className="wedding-header">
              <div className="wedding-title">
                <h4>
                  <i className="fas fa-heart"></i>
                  Tiệc cưới #{wedding.ID_TiecCuoi}
                </h4>
                {getStatusBadge(wedding.TrangThai)}
              </div>
              <div className="wedding-date">
                <i className="fas fa-calendar-alt"></i>
                {formatDate(wedding.NgayToChuc)}
              </div>
            </div>

            <div className="wedding-details">
              <div className="detail-row">
                <div className="detail-item">
                  <label>
                    <i className="fas fa-building"></i>
                    Sảnh tiệc
                  </label>
                  <span>{wedding.TenSanh}</span>
                </div>
                <div className="detail-item">
                  <label>
                    <i className="fas fa-layer-group"></i>
                    Loại sảnh
                  </label>
                  <span>{wedding.LoaiSanh}</span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>
                    <i className="fas fa-clock"></i>
                    Ca tiệc
                  </label>
                  <span>{wedding.TenCa}</span>
                </div>
                <div className="detail-item">
                  <label>
                    <i className="fas fa-users"></i>
                    Số bàn
                  </label>
                  <span>{wedding.SoLuongBan} bàn ({wedding.SoBanDuTru} dự trù)</span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>
                    <i className="fas fa-calendar-plus"></i>
                    Ngày đặt
                  </label>
                  <span>{formatDate(wedding.ThoiDiemDat)}</span>
                </div>
                <div className="detail-item">
                  <label>
                    <i className="fas fa-money-bill-wave"></i>
                    Đã thanh toán
                  </label>
                  <span className="amount-paid">
                    {formatCurrency(wedding.TongDaThanhToan)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingHistory; 