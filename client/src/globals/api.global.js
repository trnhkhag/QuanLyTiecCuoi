import { API_URL } from '../utils/env';

// Base API URL
export const BASE_API_URL = API_URL;

// Auth service endpoints
export const AUTH_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/v1/auth-service`,
  LOGIN: `${BASE_API_URL}/api/v1/auth-service/login`,
  REGISTER: `${BASE_API_URL}/api/v1/auth-service/register`,
  LOGOUT: `${BASE_API_URL}/api/v1/auth-service/logout`,
  PROFILE: `${BASE_API_URL}/api/v1/auth-service/profile`,
  HEALTH: `${BASE_API_URL}/api/v1/auth-service/health`,
};

// Wedding service endpoints
export const WEDDING_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi`,
  GET_ALL: `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi`,
  GET_BY_ID: (id) => `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi/${id}`,
  CREATE: `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi`,
  UPDATE: (id) => `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi/${id}`,
  DELETE: (id) => `${BASE_API_URL}/api/v1/wedding-service/tiec-cuoi/${id}`,
  HEALTH: `${BASE_API_URL}/api/v1/wedding-service/health`,
};

// Ca Tiec endpoints (part of Wedding service)
export const CA_TIEC_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/v1/wedding-service/ca-tiec`,
  GET_ALL: `${BASE_API_URL}/api/v1/wedding-service/ca-tiec`,
};

// Invoice service endpoints
export const INVOICE_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/v1/invoice-service`,
  GET_ALL: `${BASE_API_URL}/api/v1/invoice-service`,
  GET_BY_ID: (id) => `${BASE_API_URL}/api/v1/invoice-service/${id}`,
  CREATE: `${BASE_API_URL}/api/v1/invoice-service`,
  UPDATE: (id) => `${BASE_API_URL}/api/v1/invoice-service/${id}`,
  DELETE: (id) => `${BASE_API_URL}/api/v1/invoice-service/${id}`,
  HEALTH: `${BASE_API_URL}/api/v1/invoice-service/health`,
};

// Report service endpoints
export const REPORT_ENDPOINTS = {
  BASE: `${BASE_API_URL}/api/v1/report-service`,
  MONTHLY: `${BASE_API_URL}/api/v1/report-service/monthly`,
  REVENUE_TREND: `${BASE_API_URL}/api/v1/report-service/revenue-trend`,
  HEALTH: `${BASE_API_URL}/api/v1/report-service/health`,
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