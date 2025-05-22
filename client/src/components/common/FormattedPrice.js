import React from 'react';

export const FormattedPrice = ({ amount, showSymbol = true }) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (!showSymbol) {
    return formatted.replace('₫', '').trim();
  }

  return formatted;
};