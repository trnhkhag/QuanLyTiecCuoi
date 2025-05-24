import { API_URL } from '../utils/env';

// Export the base API URL for use in axios default configuration
export const BASE_API_URL = API_URL;

// Debug the base URL
console.log('API_GLOBAL: Raw API_URL value:', API_URL);

// Helper function to create URL with query parameters
export const createUrlWithParams = (baseUrl, params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
};

// Auth service endpoints
export const AUTH_ENDPOINTS = {
  BASE: `${API_URL}/v1/auth-service`,
  LOGIN: `${API_URL}/v1/auth-service/login`,
  HEALTH: `${API_URL}/v1/auth-service/health`
};

// Wedding service endpoints
export const WEDDING_ENDPOINTS = {
  BASE: `${API_URL}/v1/wedding-service`,
  CA_TIEC: {
    BASE: `${API_URL}/v1/wedding-service/ca-tiec`,
    GET_ALL: `${API_URL}/v1/wedding-service/ca-tiec`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/ca-tiec/${id}`,
  },  FOOD: {
    BASE: `${API_URL}/v1/wedding-service/mon-an`,
    GET_ALL: `${API_URL}/v1/wedding-service/mon-an`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/mon-an/${id}`,
  },
  BOOKING: {
    BASE: `${API_URL}/v1/wedding-service/bookings`,
    GET_ALL: `${API_URL}/v1/wedding-service/bookings`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/bookings/${id}`,
    CREATE: `${API_URL}/v1/wedding-service/bookings`,
    UPDATE: (id) => `${API_URL}/v1/wedding-service/bookings/${id}`,
    DELETE: (id) => `${API_URL}/v1/wedding-service/bookings/${id}`
  },
  HALL: {
    BASE: `${API_URL}/v1/wedding-service/lobby/halls`,
    GET_ALL: `${API_URL}/v1/wedding-service/lobby/halls`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/lobby/halls/${id}`,
    CREATE: `${API_URL}/v1/wedding-service/lobby/halls`,
    UPDATE: (id) => `${API_URL}/v1/wedding-service/lobby/halls/${id}`,
    DELETE: (id) => `${API_URL}/v1/wedding-service/lobby/halls/${id}`
  },
  HALL_TYPE: {
    BASE: `${API_URL}/v1/wedding-service/lobby/hall-types`,
    GET_ALL: `${API_URL}/v1/wedding-service/lobby/hall-types`,
    CREATE: `${API_URL}/v1/wedding-service/lobby/hall-types`,
    UPDATE: (id) => `${API_URL}/v1/wedding-service/lobby/hall-types/${id}`,
    DELETE: (id) => `${API_URL}/v1/wedding-service/lobby/hall-types/${id}`
  },
  REGULATION: {
    BASE: `${API_URL}/v1/wedding-service/regulations`,
    GET_ALL: `${API_URL}/v1/wedding-service/regulations`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/regulations/${id}`,
    CREATE: `${API_URL}/v1/wedding-service/regulations`,
    UPDATE: (id) => `${API_URL}/v1/wedding-service/regulations/${id}`,
    DELETE: (id) => `${API_URL}/v1/wedding-service/regulations/${id}`
  },
  SERVICE: {
    BASE: `${API_URL}/v1/wedding-service/services`,
    GET_ALL: `${API_URL}/v1/wedding-service/services`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/services/${id}`,
    CREATE: `${API_URL}/v1/wedding-service/services`,
    UPDATE: (id) => `${API_URL}/v1/wedding-service/services/${id}`,
    DELETE: (id) => `${API_URL}/v1/wedding-service/services/${id}`
  },  LOOKUP: {
    BASE: `${API_URL}/v1/wedding-service/lookup`,
    SEARCH: `${API_URL}/v1/wedding-service/lookup`,
    GET_BY_ID: (id) => `${API_URL}/v1/wedding-service/lookup/${id}`,
    SHIFTS: `${API_URL}/v1/wedding-service/lookup/shifts`,
    FOODS: `${API_URL}/v1/wedding-service/lookup/foods`
  }
};

// Report service endpoints
export const REPORT_ENDPOINTS = {
  BASE: `${API_URL}/v1/report-service`,
  MONTHLY: `${API_URL}/v1/report-service/monthly`,
  YEARLY: `${API_URL}/v1/report-service/yearly`,
  REVENUE_TREND: `${API_URL}/v1/report-service/revenue-trend`,
  HEALTH: `${API_URL}/v1/report-service/health`
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

// Profile service endpoints
export const PROFILE_ENDPOINTS = {
  BASE: `${API_URL}/v1/profile-service`,
  GET_PROFILE: `${API_URL}/v1/profile-service/profile`,
  UPDATE_CUSTOMER: `${API_URL}/v1/profile-service/customer`,
  UPDATE_EMPLOYEE: `${API_URL}/v1/profile-service/employee`,
  CHANGE_PASSWORD: `${API_URL}/v1/profile-service/change-password`,
  PERMISSIONS: `${API_URL}/v1/profile-service/permissions`,
  HEALTH: `${API_URL}/v1/profile-service/health`
};

// Unified API endpoints object for easier access
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  WEDDING: WEDDING_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  INVOICE: INVOICE_ENDPOINTS,
  PROFILE: PROFILE_ENDPOINTS
};
