/**
 * Service configuration for microservice architecture
 * Centralizes information about each service and its properties
 */

import { API_URL } from './env';

// Service definitions
export const SERVICES = {
  // Auth Service - handles user authentication and management
  AUTH: {
    name: 'auth-service',
    basePath: '/api/v1/auth-service',
    fullUrl: `${API_URL}/api/v1/auth-service`,
    description: 'Authentication and user management',
    endpoints: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      PROFILE: '/profile',
      HEALTH: '/health'
    }
  },
  
  // Wedding Service - handles wedding management
  WEDDING: {
    name: 'wedding-service',
    basePath: '/api/v1/wedding-service',
    fullUrl: `${API_URL}/api/v1/wedding-service`,
    description: 'Wedding management',
    modules: {
      TIEC_CUOI: {
        path: '/tiec-cuoi',
        fullUrl: `${API_URL}/api/v1/wedding-service/tiec-cuoi`,
      },
      CA_TIEC: {
        path: '/ca-tiec',
        fullUrl: `${API_URL}/api/v1/wedding-service/ca-tiec`,
      }
    },
    endpoints: {
      HEALTH: '/health'
    }
  },
  
  // Invoice Service - handles invoices and payments
  INVOICE: {
    name: 'invoice-service',
    basePath: '/api/v1/invoice-service',
    fullUrl: `${API_URL}/api/v1/invoice-service`,
    description: 'Invoice and payment management',
    endpoints: {
      HEALTH: '/health'
    }
  },
  
  // Report Service - handles reporting and analytics
  REPORT: {
    name: 'report-service',
    basePath: '/api/v1/report-service',
    fullUrl: `${API_URL}/api/v1/report-service`,
    description: 'Reporting and analytics',
    endpoints: {
      MONTHLY: '/monthly',
      REVENUE_TREND: '/revenue-trend',
      HEALTH: '/health'
    }
  }
};

/**
 * Helper function to get a service's full URL
 * @param {string} serviceName - Name of the service (AUTH, WEDDING, etc.)
 * @param {string} endpoint - Optional endpoint to append
 * @returns {string} Full URL to the service or endpoint
 */
export const getServiceUrl = (serviceName, endpoint = '') => {
  const service = SERVICES[serviceName];
  if (!service) {
    throw new Error(`Unknown service: ${serviceName}`);
  }
  
  return `${service.fullUrl}${endpoint}`;
};

/**
 * Helper function to get a module's full URL within a service
 * @param {string} serviceName - Name of the service (WEDDING, etc.)
 * @param {string} moduleName - Name of the module (TIEC_CUOI, etc.)
 * @param {string} endpoint - Optional endpoint to append
 * @returns {string} Full URL to the module or endpoint
 */
export const getModuleUrl = (serviceName, moduleName, endpoint = '') => {
  const service = SERVICES[serviceName];
  if (!service) {
    throw new Error(`Unknown service: ${serviceName}`);
  }
  
  const module = service.modules?.[moduleName];
  if (!module) {
    throw new Error(`Unknown module: ${moduleName} in service: ${serviceName}`);
  }
  
  return `${module.fullUrl}${endpoint}`;
};

export default SERVICES; 