import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar';
import InvoiceDetail from '../../components/invoice/InvoiceDetail';
import authService from '../../services/authService';
import invoiceService from '../../services/invoiceService';
import '../../styles/invoice.css';

const InvoiceInformationPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchInvoiceDetails();
  }, [id, navigate, fetchInvoiceDetails]);
  
  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await invoiceService.getInvoiceById(id);
      
      // Check if the data property exists
      if (response && response.data) {
        setInvoice(response.data);
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra API.');
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      
      // More specific error messages based on the error type
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo server đang chạy.');
      } else if (err.response && err.response.status === 404) {
        setError(`Không tìm thấy hóa đơn với ID ${id}.`);
      } else if (err.response) {
        setError(`Lỗi từ máy chủ: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError('Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchInvoiceDetails();
  };

  const handleBack = () => {
    navigate('/invoices');
  };

  return (
    <div className="app-container">
      <DashboardNavbar />
      
      <div className="content-container">
        <div className="page-header">
          <div className="header-title">
            <h1>Chi tiết hóa đơn</h1>
            <p>Xem thông tin chi tiết của hóa đơn</p>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <div className="error-actions">
              <button className="retry-btn" onClick={handleRetry}>
                <i className="fas fa-sync-alt"></i> Thử lại
              </button>
              <button className="back-btn" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Quay lại
              </button>
            </div>
          </div>
        )}
        
        <div className="page-content">
          {loading ? (
            <div className="loading">
              <p>Đang tải thông tin hóa đơn...</p>
            </div>
          ) : (
            <InvoiceDetail invoice={invoice} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceInformationPage; 