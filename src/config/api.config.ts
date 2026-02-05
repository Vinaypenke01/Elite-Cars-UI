/**
 * Elite Motors - API Configuration
 * Base configuration for Django REST API
 */

// API Base URL - Update this based on your environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Manufacturers - /api/v1/cars/manufacturers/
  MANUFACTURERS: '/cars/manufacturers/',

  // Cars - /api/v1/cars/
  CARS: '/cars/',
  CAR_DETAIL: (id: string) => `/cars/${id}/`,
  FEATURED_CARS: '/cars/featured/',
  RECENTLY_SOLD: '/cars/recently-sold/',
  ADD_CAR_TO_RECENTLY_SOLD: '/cars/recently-sold/add-car/',
  SETTINGS: '/cars/settings/',
  SETTINGS_UPDATE: '/cars/settings/update/',


  // Orders/Bookings - /api/v1/orders/
  BOOKINGS: '/orders/bookings/',
  BOOKING_DETAIL: (id: string) => `/orders/bookings/${id}/`,
  UPDATE_BOOKING_STATUS: (id: string) => `/orders/bookings/${id}/update_status/`,

  // Authentication - /api/v1/accounts/
  AUTH_REGISTER: '/accounts/register/',
  AUTH_LOGIN: '/accounts/login/',
  AUTH_LOGOUT: '/accounts/logout/',
  AUTH_PROFILE: '/accounts/profile/',
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
  };
};
