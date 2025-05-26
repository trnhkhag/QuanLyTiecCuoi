import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import pdfService from '../../services/pdfService';
import '../../styles/invoice.css';

const InvoiceDetail = ({ invoice }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!invoice) {
    return <div className="invoice-loading">Đang tải...</div>;
  }

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

  // Calculate remaining or paid percentage
  const calculatePercentage = () => {
    return Math.round((invoice.TienThanhToan / invoice.TongTien) * 100);
  };

  // Helper to check if there's a penalty
  const hasPenalty = () => {
    return invoice.TienPhat && invoice.TienPhat > 0;
  };

  // Handle PDF generation
  const handlePrintInvoice = async () => {
    try {
      setIsGeneratingPDF(true);
      await pdfService.generateInvoicePDF(invoice);
      // Success message could be shown here if needed
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Không thể tạo file PDF. Vui lòng thử lại.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`invoice-detail-card ${hasPenalty() ? 'has-penalty' : ''}`}>
      <div className="invoice-header">
        <div className="invoice-title">
          <h2>Hóa Đơn #{invoice.ID_HoaDon}</h2>
          <span className={`invoice-type ${invoice.LoaiHoaDon === 'Thanh toán đặt cọc' ? 'deposit' : 'remaining'}`}>
            {invoice.LoaiHoaDon}
          </span>
        </div>
        <div className="invoice-date">
          <p>Ngày lập: {formatDate(invoice.NgayLap)}</p>
        </div>
      </div>

      <div className="invoice-body">
        <h3>Thông tin tiệc cưới</h3>
        <div className="detail-row">
          <div className="detail-label">Mã tiệc cưới:</div>
          <div className="detail-value">{invoice.ID_TiecCuoi}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Ngày tổ chức:</div>
          <div className="detail-value">{formatDate(invoice.NgayToChuc)}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Ca tiệc:</div>
          <div className="detail-value">{invoice.TenCa || 'N/A'}</div>
        </div>
        
        <h3>Thông tin thanh toán</h3>
        <div className="detail-row">
          <div className="detail-label">Tổng tiền:</div>
          <div className="detail-value">{formatCurrency(invoice.TongTien)}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Tiền thanh toán:</div>
          <div className="detail-value highlight">{formatCurrency(invoice.TienThanhToan)}</div>
        </div>
        
        {hasPenalty() && (
          <>
            <div className="detail-row penalty-row">
              <div className="detail-label">Số ngày trễ hạn:</div>
              <div className="detail-value penalty">{invoice.SoNgayTreHan} ngày</div>
            </div>
            
            <div className="detail-row penalty-row">
              <div className="detail-label">Tiền phạt (1%/ngày):</div>
              <div className="detail-value penalty">{formatCurrency(invoice.TienPhat)}</div>
            </div>
            
            <div className="detail-row penalty-row">
              <div className="detail-label">Tổng phải thanh toán:</div>
              <div className="detail-value penalty-total">{formatCurrency(invoice.TongTien + invoice.TienPhat)}</div>
            </div>
          </>
        )}
        
        <div className="detail-row">
          <div className="detail-label">Ghi chú:</div>
          <div className="detail-value note">{invoice.GhiChu || 'Không có ghi chú'}</div>
        </div>

        <div className="payment-progress">
          <div className="progress-label">
            <span>Tiến độ thanh toán</span>
            <span>{calculatePercentage()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-value" 
              style={{ width: `${calculatePercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="invoice-footer">
        <Link to="/invoices" className="back-btn">
          <i className="fas fa-arrow-left"></i> Quay lại
        </Link>
        <button 
          className="print-btn" 
          onClick={handlePrintInvoice}
          disabled={isGeneratingPDF}
        >
          <i className={`fas ${isGeneratingPDF ? 'fa-spinner fa-spin' : 'fa-print'}`}></i> 
          {isGeneratingPDF ? 'Đang tạo PDF...' : 'In hóa đơn'}
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail; 