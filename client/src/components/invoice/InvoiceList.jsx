import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/invoice.css';

const InvoiceList = ({ invoices, onDelete, onConfirmPayment }) => {
  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Helper to determine if invoice is virtual
  const isVirtual = (invoice) => {
    return invoice.isVirtual || invoice.ID_HoaDon < 0;
  };

  // Helper to determine if invoice has penalty
  const hasPenalty = (invoice) => {
    return invoice.TienPhat && invoice.TienPhat > 0;
  };

  return (
    <div className="invoice-list">
      {invoices.length === 0 ? (
        <div className="invoice-empty">
          <p>Không có hóa đơn nào.</p>
        </div>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Mã HĐ</th>
              <th>Ngày lập</th>
              <th>Ngày tổ chức</th>
              <th>Ca tiệc</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Loại hóa đơn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr 
                key={invoice.ID_HoaDon} 
                className={`
                  ${isVirtual(invoice) ? 'virtual-invoice' : ''} 
                  ${hasPenalty(invoice) ? 'penalty-invoice' : ''}
                `}
              >
                <td>
                  {isVirtual(invoice) 
                    ? `Chưa cấp (${Math.abs(invoice.depositInvoiceId)})` 
                    : invoice.ID_HoaDon}
                </td>
                <td>{formatDate(invoice.NgayLap)}</td>
                <td>{formatDate(invoice.NgayToChuc)}</td>
                <td>{invoice.TenCa || 'N/A'}</td>
                <td>{formatCurrency(invoice.TongTien)}</td>
                <td>{formatCurrency(invoice.TienThanhToan)}</td>
                <td>
                  <span className={`invoice-type ${invoice.LoaiHoaDon === 'Thanh toán đặt cọc' ? 'deposit' : 'remaining'}`}>
                    {invoice.LoaiHoaDon}
                  </span>
                </td>
                <td>
                  {isVirtual(invoice) ? (
                    <span className="invoice-status pending">
                      {hasPenalty(invoice) 
                        ? `Trễ hạn (${invoice.SoNgayTreHan} ngày)` 
                        : 'Chưa thanh toán'}
                    </span>
                  ) : (
                    <span className="invoice-status paid">Đã thanh toán</span>
                  )}
                </td>
                <td className="invoice-actions">
                  {!isVirtual(invoice) && (
                    <Link 
                      to={`/invoice/${invoice.ID_HoaDon}`} 
                      className="view-btn"
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  )}
                  
                  {/* For virtual invoices, show confirm payment button */}
                  {isVirtual(invoice) && (
                    <button 
                      onClick={() => onConfirmPayment(invoice.ID_HoaDon)}
                      className="confirm-btn"
                      title="Xác nhận thanh toán"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => onDelete(invoice.ID_HoaDon)}
                    className="delete-btn"
                    title="Xóa hóa đơn"
                    disabled={isVirtual(invoice)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList; 