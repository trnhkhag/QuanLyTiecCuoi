import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar';
import InvoiceList from '../../components/invoice/InvoiceList';
import authService from '../../services/authService';
import invoiceService from '../../services/invoiceService';
import '../../styles/invoice.css';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [virtualInvoices, setVirtualInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });
  
  // Sorting state
  const [sorting, setSorting] = useState({
    sortBy: 'NgayLap',
    sortOrder: 'desc'
  });
  
  // Filtering state
  const [filters, setFilters] = useState({
    loaiHoaDon: []  // Empty array means "All"
  });
  
  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchInvoices();
  }, [navigate, pagination.page, pagination.limit, sorting.sortBy, sorting.sortOrder, filters.loaiHoaDon, fetchInvoices]);
  
  // Combine real and virtual invoices whenever either changes
  useEffect(() => {
    const combined = [...invoices, ...virtualInvoices];
    // Sort by ID in descending order (newest first)
    combined.sort((a, b) => b.ID_HoaDon - a.ID_HoaDon);
    setAllInvoices(combined);
  }, [invoices, virtualInvoices]);
  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      // Prepare API parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder
      };
      
      // Add filter by invoice type if not "All"
      if (filters.loaiHoaDon.length > 0) {
        params.loaiHoaDon = filters.loaiHoaDon;
      }
      
      const response = await invoiceService.getAllInvoices(params);
      
      // Check if the data property exists
      if (response && response.data) {
        const realInvoices = response.data;
        setInvoices(realInvoices);
        
        // Update pagination metadata
        if (response.pagination) {
          setPagination(response.pagination);
        }
        
        // Generate virtual invoices for deposit payments
        generateVirtualInvoices(realInvoices);
        
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Định dạng dữ liệu không hợp lệ. Vui lòng kiểm tra API.');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      
      // More specific error messages based on the error type
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo server đang chạy.');
      } else if (err.response) {
        setError(`Lỗi từ máy chủ: ${err.response.status} - ${err.response.statusText}`);
      } else {
        setError('Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Function to generate virtual invoices for deposit payments
  const generateVirtualInvoices = (realInvoices) => {
    // Filter for deposit payments
    const depositInvoices = realInvoices.filter(
      invoice => invoice.LoaiHoaDon === 'Thanh toán đặt cọc'
    );
    
    // Get all invoices with 'Thanh toán còn lại' type (real remaining payment invoices)
    const remainingPaymentInvoices = realInvoices.filter(
      invoice => invoice.LoaiHoaDon === 'Thanh toán còn lại'
    );
    
    // Get TiecCuoi IDs that already have a remaining payment invoice
    const remainingPaymentTiecCuoiIds = remainingPaymentInvoices.map(
      invoice => invoice.ID_TiecCuoi
    );
    
    // Create a lookup map to check for duplicated TiecCuoi IDs in deposit invoices
    const tiecCuoiIdCount = new Map();
    depositInvoices.forEach(invoice => {
      const count = tiecCuoiIdCount.get(invoice.ID_TiecCuoi) || 0;
      tiecCuoiIdCount.set(invoice.ID_TiecCuoi, count + 1);
    });
    
    // Find deposit invoices that:
    // 1. Don't have a corresponding remaining payment invoice yet
    // 2. Don't have duplicated TiecCuoi IDs among deposit invoices
    const eligibleDepositInvoices = depositInvoices.filter(invoice =>
      !remainingPaymentTiecCuoiIds.includes(invoice.ID_TiecCuoi) &&
      tiecCuoiIdCount.get(invoice.ID_TiecCuoi) === 1
    );
    
    // Create virtual invoices for eligible deposit invoices
    const virtuals = eligibleDepositInvoices.map(invoice => {
      // Calculate remaining amount to pay
      const remainingAmount = invoice.TongTien - invoice.TienThanhToan;
      
      // The penalty is already calculated by the server
      const tienPhat = invoice.TienPhat || 0;
      const soNgayTreHan = invoice.SoNgayTreHan || 0;
      
      // Create a virtual invoice with negative ID to distinguish it
      return {
        ID_HoaDon: -invoice.ID_HoaDon, // Negative ID to mark as virtual
        ID_TiecCuoi: invoice.ID_TiecCuoi,
        NgayLap: new Date().toISOString().split('T')[0], // Today's date
        NgayToChuc: invoice.NgayToChuc,
        TenCa: invoice.TenCa,
        TongTien: invoice.TongTien,
        TienThanhToan: remainingAmount,
        LoaiHoaDon: 'Thanh toán còn lại',
        GhiChu: `Thanh toán số tiền còn lại cho tiệc cưới #${invoice.ID_TiecCuoi}`,
        isVirtual: true, // Flag to mark as virtual
        depositInvoiceId: invoice.ID_HoaDon, // Reference to the deposit invoice
        TienPhat: tienPhat,
        SoNgayTreHan: soNgayTreHan
      };
    });
    
    setVirtualInvoices(virtuals);
  };
  
  const handleDeleteInvoice = async (id) => {
    // Check if this is a virtual invoice
    if (id < 0) {
      // Cannot delete virtual invoices
      alert('Không thể xóa hóa đơn ảo thanh toán còn lại. Bạn cần xóa hóa đơn đặt cọc tương ứng.');
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      try {
        await invoiceService.deleteInvoice(id);
        
        // Get the invoice being deleted
        const deletedInvoice = invoices.find(invoice => invoice.ID_HoaDon === id);
        
        // If deleting a deposit invoice, also remove its virtual remaining invoice
        if (deletedInvoice && deletedInvoice.LoaiHoaDon === 'Thanh toán đặt cọc') {
          setVirtualInvoices(prev => 
            prev.filter(vi => vi.depositInvoiceId !== id)
          );
        }
        
        // Remove the actual invoice
        setInvoices(invoices.filter(invoice => invoice.ID_HoaDon !== id));
        
      } catch (err) {
        console.error('Error deleting invoice:', err);
        
        if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
          setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo server đang chạy.');
        } else {
          setError('Không thể xóa hóa đơn. Vui lòng thử lại sau.');
        }
      }
    }
  };
  
  const handleConfirmRemainingPayment = async (virtualInvoiceId) => {
    // Get the virtual invoice that's being confirmed
    const virtualInvoice = virtualInvoices.find(vi => vi.ID_HoaDon === virtualInvoiceId);
    
    if (!virtualInvoice) {
      setError('Không tìm thấy hóa đơn ảo.');
      return;
    }
    
    // Calculate total amount including penalty
    const totalWithPenalty = virtualInvoice.TienThanhToan + (virtualInvoice.TienPhat || 0);
    const confirmMessage = virtualInvoice.TienPhat > 0 
      ? `Xác nhận thanh toán số tiền còn lại cùng với tiền phạt trễ hạn ${formatCurrency(virtualInvoice.TienPhat)}?` 
      : 'Xác nhận thanh toán số tiền còn lại?';
    
    if (window.confirm(confirmMessage)) {
      try {
        // Create an actual invoice from the virtual one
        const newInvoice = {
          ...virtualInvoice,
          ID_HoaDon: undefined, // Remove the ID so the server will assign a new one
          NgayLap: new Date().toISOString().split('T')[0], // Today's date
          TienThanhToan: totalWithPenalty, // Include penalty in payment amount
          GhiChu: virtualInvoice.TienPhat > 0 
            ? `Thanh toán số tiền còn lại cho tiệc cưới #${virtualInvoice.ID_TiecCuoi} (bao gồm phạt trễ hạn ${virtualInvoice.SoNgayTreHan} ngày)` 
            : virtualInvoice.GhiChu,
          isVirtual: undefined, // Remove virtual flag
          depositInvoiceId: undefined // Remove reference to deposit
        };
        
        // Save to the server
        const response = await invoiceService.createInvoice(newInvoice);
        
        if (response && response.data) {
          // Add the new invoice to the list
          setInvoices(prev => [...prev, response.data]);
          
          // Remove the virtual invoice
          setVirtualInvoices(prev => 
            prev.filter(vi => vi.ID_HoaDon !== virtualInvoiceId)
          );
          
          alert('Thanh toán thành công!');
        }
      } catch (err) {
        console.error('Error confirming payment:', err);
        setError('Không thể xác nhận thanh toán. Vui lòng thử lại sau.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 })); // Reset to page 1 when changing limit
  };
  
  const handleSortChange = (field) => {
    setSorting(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleFilterChange = (filterType, values) => {
    if (filterType === 'loaiHoaDon') {
      setFilters(prev => ({ ...prev, loaiHoaDon: values }));
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filtering
    }
  };
  
  const handleRetry = () => {
    fetchInvoices();
  };

  // Filter option for invoice types
  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Thanh toán đặt cọc', label: 'Thanh toán đặt cọc' },
    { value: 'Thanh toán còn lại', label: 'Thanh toán còn lại' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'NgayLap', label: 'Ngày lập' },
    { value: 'NgayToChuc', label: 'Ngày tổ chức' }
  ];
  
  return (
    <div className="app-container">
      <DashboardNavbar />
      
      <div className="content-container">
        <div className="page-header">
          <div className="header-title">
            <h1>Quản lý hóa đơn</h1>
            <p>Xem, tạo và quản lý các hóa đơn tiệc cưới</p>
          </div>
          <div className="header-actions">
            <button className="create-btn">
              <i className="fas fa-plus"></i> Tạo hóa đơn mới
            </button>
          </div>
        </div>
        
        {/* Filter and sort controls */}
        <div className="controls-container">
          <div className="filter-controls">
            <div className="filter-group">
              <label>Loại hóa đơn:</label>
              <div className="filter-tags">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    className={`filter-tag ${option.value === 'all' && filters.loaiHoaDon.length === 0 ? 'active' : ''} 
                              ${option.value !== 'all' && filters.loaiHoaDon.includes(option.value) ? 'active' : ''}
                              ${option.value === 'all' && filters.loaiHoaDon.length > 0 ? 'disabled' : ''}`}
                    onClick={() => {
                      if (option.value === 'all') {
                        handleFilterChange('loaiHoaDon', []);
                      } else {
                        // If "all" was active, deactivate it first
                        let newFilters = [...filters.loaiHoaDon];
                        
                        // Toggle the selected filter
                        if (newFilters.includes(option.value)) {
                          newFilters = newFilters.filter(f => f !== option.value);
                        } else {
                          newFilters.push(option.value);
                        }
                        
                        handleFilterChange('loaiHoaDon', newFilters);
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="sort-controls">
            <div className="sort-group">
              <label>Sắp xếp theo:</label>
              <div className="sort-options">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    className={`sort-option ${sorting.sortBy === option.value ? 'active' : ''}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                    {sorting.sortBy === option.value && (
                      <i className={`fas fa-arrow-${sorting.sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            <button className="retry-btn" onClick={handleRetry}>
              <i className="fas fa-sync-alt"></i> Thử lại
            </button>
          </div>
        )}
        
        <div className="page-content">
          {loading ? (
            <div className="loading">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <InvoiceList 
                invoices={allInvoices} 
                onDelete={handleDeleteInvoice}
                onConfirmPayment={handleConfirmRemainingPayment}
              />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn" 
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <div className="pagination-info">
                    Trang {pagination.page} / {pagination.totalPages}
                  </div>
                  
                  <button 
                    className="pagination-btn" 
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                  
                  <select 
                    className="limit-select"
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  >
                    <option value="5">5 dòng</option>
                    <option value="10">10 dòng</option>
                    <option value="15">15 dòng</option>
                    <option value="20">20 dòng</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage; 