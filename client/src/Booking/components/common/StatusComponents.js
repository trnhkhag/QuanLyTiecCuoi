import React from 'react';
import { Spinner, Alert } from 'react-bootstrap';

/**
 * Component hiển thị trạng thái loading
 */
export function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-2">{text}</p>
    </div>
  );
}

/**
 * Component hiển thị thông báo lỗi
 */
export function ErrorMessage({ message, variant = 'danger' }) {
  if (!message) return null;
  
  return (
    <Alert variant={variant} className="mb-4">
      {message}
    </Alert>
  );
}

/**
 * Component hiển thị trạng thái không có dữ liệu
 */
export function NoDataMessage({ message = 'Không có dữ liệu' }) {
  return (
    <div className="text-center my-5">
      <p className="text-muted">{message}</p>
    </div>
  );
}
export function EmptyState({ message = 'Không có dữ liệu', icon }) {
  return (
    <div className="text-center my-5 text-muted">
      {icon}
      <p className="mt-2">{message}</p>
    </div>
  );
}

/**
 * Component định dạng giá tiền
 */
export function FormattedPrice({ amount, currency = 'VNĐ' }) {
  if (amount === undefined || amount === null) return <span>-</span>;
  
  const formattedAmount = amount?.toLocaleString('vi-VN') || '0';
  return <span>{formattedAmount} {currency}</span>;
}

/**
 * Component format ngày tháng
 */
export function FormattedDate({ date, format = 'DD/MM/YYYY' }) {
  if (!date) return <span>-</span>;
  
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  // Simple formatter based on format string
  if (format === 'DD/MM/YYYY') {
    return <span>{dateObj.toLocaleDateString('vi-VN')}</span>;
  }
  
  return <span>{dateObj.toLocaleDateString('vi-VN')}</span>;
}
