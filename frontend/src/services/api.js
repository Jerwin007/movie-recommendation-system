// frontend/src/services/api.js
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Add token to requests
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

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getMe: () => api.get('/auth/me')
};

// Movies API
export const moviesAPI = {
  getAllMovies: (params) => api.get('/movies', { params }),
  getMovie: (id) => api.get(`/movies/${id}`),
  createMovie: (data) => api.post('/movies', data),
  updateMovie: (id, data) => api.put(`/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/movies/${id}`),
  getStats: () => api.get('/movies/stats/dashboard')
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats/count')
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: () => api.get('/recommendations'),
  trackView: (movieId) => api.post('/recommendations/track-view', { movieId }),
  likeMovie: (movieId) => api.post('/recommendations/like', { movieId }),
  dislikeMovie: (movieId) => api.post('/recommendations/dislike', { movieId }),
  getPreferences: () => api.get('/recommendations/preferences'),
  resetPreferences: () => api.delete('/recommendations/reset')
};

export default api;