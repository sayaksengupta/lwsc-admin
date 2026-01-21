import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/admin/auth/refresh-token`, { refreshToken });
          
          // 1. Update Token (Handle both accessToken or token fields from response)
          const { accessToken, token } = response.data;
          const newAccessToken = accessToken || token;
          
          localStorage.setItem('token', newAccessToken);
          
          // 2. Update Header & Retry Original Request
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed -> Logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/api/v1/admin/auth/login', data),
  getMe: () => api.get('/api/v1/admin/auth/me'),
  changePassword: (data) => api.post('/api/v1/admin/auth/change-password', data),
  forgotPassword: (data) => api.post('/api/v1/admin/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/v1/admin/auth/reset-password', data),
  updateProfile: (data) => api.put('/api/v1/admin/auth/me', data),
};

export const dashboardApi = {
  getStats: (params) => api.get('/api/v1/admin/dashboard/stats', { params }),
};

export const logsApi = {
  getPainLogs: (params) => api.get('/api/v1/admin/logs/pain', { params }),
  getMoodLogs: (params) => api.get('/api/v1/admin/logs/mood', { params }),
  getHydrationLogs: (params) => api.get('/api/v1/admin/logs/hydration', { params }),
  getMedicationLogs: (params) => api.get('/api/v1/admin/logs/medications', { params }),
  getExportUrl: (type, params) => {
    const token = localStorage.getItem('token');
    const queryParams = { ...params, token };
    const queryString = new URLSearchParams(queryParams).toString();
    return `${API_BASE_URL}/api/v1/admin/logs/${type}/export?${queryString}`;
  }
};

export const userApi = {
  getUsers: (params) => api.get('/api/v1/admin/users', { params }),
  getUserById: (id) => api.get(`/api/v1/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/api/v1/admin/users/${id}`),
};

export const painLocationApi = {
  getLocations: () => api.get('/api/v1/admin/pain-locations'),
  createLocation: (formData) => api.post('/api/v1/admin/pain-locations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateLocation: (id, formData) => api.put(`/api/v1/admin/pain-locations/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteLocation: (id) => api.delete(`/api/v1/admin/pain-locations/${id}`),
};

export const rewardsApi = {
  getAchievements: () => api.get('/api/v1/admin/rewards/achievements'),
  createAchievement: (formData) => api.post('/api/v1/admin/rewards/achievements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateAchievement: (id, formData) => api.patch(`/api/v1/admin/rewards/achievements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getBadges: () => api.get('/api/v1/admin/rewards/badges'),
  createBadge: (formData) => api.post('/api/v1/admin/rewards/badges', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBadge: (id, formData) => api.patch(`/api/v1/admin/rewards/badges/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteBadge: (id) => api.delete(`/api/v1/admin/rewards/badges/${id}`),
};

export const facilityApi = {
  getFacilities: (params) => api.get('/api/v1/admin/facilities', { params }),
  getFacilityById: (id) => api.get(`/api/v1/admin/facilities/${id}`),
  createFacility: (data) => api.post('/api/v1/admin/facilities', data),
  updateFacility: (id, data) => api.put(`/api/v1/admin/facilities/${id}`, data),
  deleteFacility: (id) => api.delete(`/api/v1/admin/facilities/${id}`),
};

export const articleApi = {
  getArticles: (params) => api.get('/api/v1/admin/articles', { params }),
  getArticleById: (id) => api.get(`/api/v1/admin/articles/${id}`),
  createArticle: (data) => api.post('/api/v1/admin/articles', data),
  updateArticle: (id, data) => api.put(`/api/v1/admin/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/api/v1/admin/articles/${id}`),
};

export default api;
