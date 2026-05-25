import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
  refresh:  ()     => api.post('/auth/refresh'),
};

export const productAPI = {
  getAll:      (params) => api.get('/products', { params }),
  getBySlug:   (slug)   => api.get(`/products/${slug}`),
  getFeatured: ()       => api.get('/products/featured'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export const orderAPI = {
  create:    (data) => api.post('/orders', data),
  getMyOrders: ()   => api.get('/orders/my'),
  getById:   (id)   => api.get(`/orders/${id}`),
  stripeIntent: (amount) => api.post('/orders/stripe-intent', { amount }),
};

export const notificationAPI = {
  getMy: () => api.get('/notifications/my'),
};

export const userAPI = {
  toggleWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  getWishlist:    ()          => api.get('/users/wishlist'),
};

export default api;
