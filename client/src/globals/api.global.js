import { API_URL } from '../utils/env';

// Export the base API URL for use in axios default configuration
export const BASE_API_URL = API_URL;

// Debug the base URL
console.log('API_GLOBAL: Raw API_URL value:', API_URL);

// Auth service endpoints with explicit URLs
export const AUTH_ENDPOINTS = {
  // Legacy paths - explicitly set full URLs
  BASE: 'http://localhost:3001/api/auth',
  LOGIN: 'http://localhost:3001/api/auth/login',
  REGISTER: 'http://localhost:3001/api/auth/register',
  LOGOUT: 'http://localhost:3001/api/auth/logout',
  PROFILE: 'http://localhost:3001/api/auth/profile',
  HEALTH: 'http://localhost:3001/api/auth/health',
  
  // Microservice paths (not used by default)
  MS_BASE: 'http://localhost:3001/api/v1/auth-service',
  MS_LOGIN: 'http://localhost:3001/api/v1/auth-service/login',
  MS_REGISTER: 'http://localhost:3001/api/v1/auth-service/register',
  MS_LOGOUT: 'http://localhost:3001/api/v1/auth-service/logout',
  MS_PROFILE: 'http://localhost:3001/api/v1/auth-service/profile',
  MS_HEALTH: 'http://localhost:3001/api/v1/auth-service/health',
};

// Wedding service endpoints - removed /api prefix to avoid duplication
export const WEDDING_ENDPOINTS = {
  BASE: `${API_URL}/v1/wedding-service/tiec-cuoi`,
  GET_ALL: `${API_URL}/v1/wedding-service/tiec-cuoi`,
  GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/tiec-cuoi/${id}`,
  CREATE: `${API_URL}/v1/wedding-service/tiec-cuoi`,
  UPDATE: (id) => `${API_URL}/v1/wedding-service/tiec-cuoi/${id}`,
  DELETE: (id) => `${API_URL}/v1/wedding-service/tiec-cuoi/${id}`,
  HEALTH: `${API_URL}/v1/wedding-service/health`,
};

// Ca Tiec endpoints (part of Wedding service) - removed /api prefix
export const CA_TIEC_ENDPOINTS = {
  BASE: `${API_URL}/v1/wedding-service/ca-tiec`,
  GET_ALL: `${API_URL}/v1/wedding-service/ca-tiec`,
};

// Invoice service endpoints - removed /api prefix
export const INVOICE_ENDPOINTS = {
  BASE: `${API_URL}/v1/invoice-service`,
  GET_ALL: `${API_URL}/v1/invoice-service`,
  GET_BY_ID: (id) => `${API_URL}/v1/invoice-service/${id}`,
  CREATE: `${API_URL}/v1/invoice-service`,
  UPDATE: (id) => `${API_URL}/v1/invoice-service/${id}`,
  DELETE: (id) => `${API_URL}/v1/invoice-service/${id}`,
  HEALTH: `${API_URL}/v1/invoice-service/health`,
};

// Report service endpoints - removed /api prefix
export const REPORT_ENDPOINTS = {
  BASE: `${API_URL}/v1/report-service`,
  MONTHLY: `${API_URL}/v1/report-service/monthly`,
  REVENUE_TREND: `${API_URL}/v1/report-service/revenue-trend`,
  HEALTH: `${API_URL}/v1/report-service/health`,
};

// Function to create URL with query parameters
export const createUrlWithParams = (baseUrl, params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  return queryParams.toString() 
    ? `${baseUrl}?${queryParams.toString()}` 
    : baseUrl;
}; 