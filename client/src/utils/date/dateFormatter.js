import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} formatStr - The format string (default: 'dd/MM/yyyy')
 * @returns {string} The formatted date
 */
export const formatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
      
    return format(date, formatStr, { locale: vi });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
};

/**
 * Format a date and time string to a readable format
 * @param {string} dateTimeString - The date and time string to format
 * @param {string} formatStr - The format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} The formatted date and time
 */
export const formatDateTime = (dateTimeString, formatStr = 'dd/MM/yyyy HH:mm') => {
  return formatDate(dateTimeString, formatStr);
};

/**
 * Get a relative time description (e.g. "2 hours ago")
 * @param {string} dateString - The date string to format
 * @returns {string} The relative time description
 */
export const getRelativeTimeFromNow = (dateString) => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return dateString || '';
  }
}; 