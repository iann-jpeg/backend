import axios from 'axios';



const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic with exponential backoff
const retryRequest = async (
  config: any,
  retries = 3,
  backoffMs = 1000
): Promise<any> => {
  try {
    return await axiosInstance(config);
  } catch (error) {
  if (retries === 0 || (error as any)?.response?.status === 401) {
      throw error;
    }

    console.log(`Retrying request (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    return retryRequest(config, retries - 1, backoffMs * 2);
  }
};

// Handle offline state and caching
const withOfflineSupport = async (
  key: string,
  request: () => Promise<any>,
  options = { ttl: 3600000 } // 1 hour cache TTL
) => {
  try {
    const response = await request();
    localStorage.setItem(
      `cache_${key}`,
      JSON.stringify({
        data: response.data,
        timestamp: Date.now(),
      })
    );
    return response;
  } catch (error) {
    if (!navigator.onLine) {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < options.ttl) {
          return { data, fromCache: true };
        }
      }
    }
    throw error;
  }
};

// API endpoints
export const api = {
  quotes: {
    submit: async (data: any) => {
      return retryRequest({
        method: 'POST',
        url: '/quotes',
        data,
      });
    },
    get: async (id: string) => {
      return withOfflineSupport(`quote_${id}`, () =>
        retryRequest({
          method: 'GET',
          url: `/quotes/${id}`,
        })
      );
    },
    list: async (params?: any) => {
      return withOfflineSupport('quotes_list', () =>
        retryRequest({
          method: 'GET',
          url: '/quotes',
          params,
        })
      );
    },
  },
  // Add other API endpoints here
};

export const handleApiError = (error: any) => {
  if (!navigator.onLine) {
    return 'You are offline. Please check your internet connection.';
  }

  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return data.message || 'Invalid request. Please check your data.';
      case 401:
        // Handle unauthorized (e.g., redirect to login)
        localStorage.removeItem('token');
        window.location.href = '/login';
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  if (error.request) {
    // Request made but no response
    return 'Unable to reach the server. Please try again later.';
  }

  // Request setup error
  return 'An error occurred while setting up the request.';
};

export default api;
