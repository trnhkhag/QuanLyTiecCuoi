/**
 * Environment configuration utility
 * Provides access to environment variables with fallbacks
 */

// API URL with fallback to localhost:3001 (base URL without /api prefix)
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Debug configuration
console.log('ENV: Using API_URL:', API_URL);

// Domain URL with fallback to localhost:3000
export const DOMAIN = process.env.REACT_APP_DOMAIN || 'http://localhost:3000';

// Helper function to get full API endpoint path
export const apiEndpoint = (path) => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`; 