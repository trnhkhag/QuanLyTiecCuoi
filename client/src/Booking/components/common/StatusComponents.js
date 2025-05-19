import React from 'react';
import { Spin, Alert, Result, Button } from 'antd';

/**
 * Component hiển thị trạng thái loading
 */
export const LoadingSpinner = ({ text = 'Đang tải...' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <Spin size="large" />
    <div>{text}</div>
  </div>
);

/**
 * Component hiển thị thông báo lỗi
 */
export const ErrorMessage = ({ 
  message = 'Đã xảy ra lỗi', 
  description,
  onRetry
}) => (
  <Result
    status="error"
    title={message}
    subTitle={description}
    extra={onRetry && [
      <Button type="primary" key="retry" onClick={onRetry}>
        Thử lại
      </Button>
    ]}
  />
);

/**
 * Component hiển thị trạng thái không có dữ liệu
 */
export const EmptyState = ({ 
  title = 'Không có dữ liệu',
  description = 'Không tìm thấy dữ liệu phù hợp',
  image,
  extra 
}) => (
  <Result
    icon={image}
    title={title}
    subTitle={description}
    extra={extra}
  />
);

/**
 * Component định dạng giá tiền
 */
export function FormattedPrice({ amount, currency = 'VNĐ' }) {
  if (amount === undefined || amount === null) return <span>-</span>;
  
  const formattedAmount = Math.round(Number(amount)).toLocaleString('vi-VN');
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
