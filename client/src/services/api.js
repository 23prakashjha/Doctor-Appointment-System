import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create auth API instance
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for authAPI
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for authAPI
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Services
export const authService = {
  login: (credentials) => authAPI.post('/auth/login', credentials),
  register: (userData) => authAPI.post('/auth/register', userData),
  getProfile: () => authAPI.get('/auth/me'),
  updateProfile: (userData) => authAPI.put('/auth/profile', userData),
  changePassword: (passwordData) => authAPI.put('/auth/change-password', passwordData),
  logout: () => authAPI.post('/auth/logout'),
}

export const doctorService = {
  getAllDoctors: (params) => authAPI.get('/doctors', { params }),
  getDoctorById: (id) => authAPI.get(`/doctors/${id}`),
  registerDoctor: (doctorData) => authAPI.post('/doctors/register', doctorData),
  updateDoctorProfile: (doctorData) => authAPI.put('/doctors/profile', doctorData),
  getDoctorAppointments: (params) => authAPI.get('/doctors/my-appointments', { params }),
  updateAppointmentStatus: (id, data) => authAPI.put(`/doctors/appointments/${id}/status`, data),
  getDoctorStats: () => authAPI.get('/doctors/stats'),
  getAvailableSlots: (doctorId, date) => authAPI.get(`/appointments/available-slots/${doctorId}/${date}`),
}

export const appointmentService = {
  bookAppointment: (appointmentData) => authAPI.post('/appointments', appointmentData),
  getUserAppointments: (params) => authAPI.get('/appointments/my-appointments', { params }),
  getAppointmentById: (id) => authAPI.get(`/appointments/${id}`),
  cancelAppointment: (id, data) => authAPI.put(`/appointments/${id}/cancel`, data),
  rescheduleAppointment: (id, data) => authAPI.put(`/appointments/${id}/reschedule`, data),
  addPrescription: (id, prescriptionData) => authAPI.put(`/appointments/${id}/prescription`, prescriptionData),
}

export const paymentService = {
  createOrder: (orderData) => authAPI.post('/payments/create-order', orderData),
  verifyPayment: (paymentData) => authAPI.post('/payments/verify', paymentData),
  getPaymentHistory: (params) => authAPI.get('/payments/history', { params }),
  getPaymentById: (id) => authAPI.get(`/payments/${id}`),
  getPaymentStats: () => authAPI.get('/payments/stats'),
}

export const reviewService = {
  createReview: (reviewData) => authAPI.post('/reviews', reviewData),
  getDoctorReviews: (doctorId, params) => authAPI.get(`/reviews/doctor/${doctorId}`, { params }),
  getUserReviews: (params) => authAPI.get('/reviews/my-reviews', { params }),
  updateReview: (id, reviewData) => authAPI.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => authAPI.delete(`/reviews/${id}`),
  markReviewHelpful: (id) => authAPI.put(`/reviews/${id}/helpful`),
  reportReview: (id, data) => authAPI.put(`/reviews/${id}/report`, data),
}

export const diseaseService = {
  getAllDiseases: (params) => api.get('/diseases', { params }),
  getPopularDiseases: (params) => api.get('/diseases/popular', { params }),
  searchDiseases: (query, params) => api.get('/diseases/search', { params: { q: query, ...params } }),
  getDiseaseById: (id) => api.get(`/diseases/${id}`),
  getDiseaseCategories: () => api.get('/diseases/categories/list'),
  getDiseasesByCategory: (category, params) => api.get(`/diseases/category/${category}`, { params }),
}

export const blogService = {
  getAllBlogs: (params) => api.get('/blogs', { params }),
  getFeaturedBlogs: (params) => api.get('/blogs/featured', { params }),
  searchBlogs: (query, params) => api.get('/blogs/search', { params: { q: query, ...params } }),
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  getBlogCategories: () => api.get('/blogs/categories/list'),
  getBlogsByCategory: (category, params) => api.get(`/blogs/category/${category}`, { params }),
  addComment: (id, commentData) => authAPI.post(`/blogs/${id}/comments`, commentData),
  toggleLike: (id) => authAPI.put(`/blogs/${id}/like`),
}

export const notificationService = {
  getNotifications: (params) => authAPI.get('/notifications', { params }),
  getUnreadCount: () => authAPI.get('/notifications/unread-count'),
  markAsRead: (data) => authAPI.put('/notifications/mark-read', data),
  markNotificationAsRead: (id) => authAPI.put(`/notifications/${id}/read`),
  archiveNotification: (id) => authAPI.put(`/notifications/${id}/archive`),
  deleteNotification: (id) => authAPI.delete(`/notifications/${id}`),
  clearAllNotifications: () => authAPI.delete('/notifications/clear-all'),
}

export const chatService = {
  sendMessage: (messageData) => authAPI.post('/chat/send', messageData),
  getChatHistory: (roomId, params) => authAPI.get(`/chat/history/${roomId}`, { params }),
  getChatRooms: () => authAPI.get('/chat/rooms'),
  markMessagesAsRead: (roomId) => authAPI.put(`/chat/read/${roomId}`),
  deleteMessage: (messageId) => authAPI.delete(`/chat/${messageId}`),
  clearChatHistory: (roomId) => authAPI.delete(`/chat/room/${roomId}`),
  getUnreadCount: () => authAPI.get('/chat/unread-count'),
  createRoom: (otherUserId) => authAPI.post('/chat/create-room', { otherUserId }),
}

export const adminService = {
  getUsers: (params) => authAPI.get('/users', { params }),
  getUserById: (id) => authAPI.get(`/users/${id}`),
  updateUser: (id, userData) => authAPI.put(`/users/${id}`, userData),
  deleteUser: (id) => authAPI.delete(`/users/${id}`),
  updateUserStatus: (id, statusData) => authAPI.put(`/users/${id}/status`, statusData),
  getUserStats: () => authAPI.get('/users/stats/dashboard'),
  
  getDoctors: (params) => authAPI.get('/doctors', { params }),
  approveDoctor: (id) => authAPI.put(`/doctors/${id}/approve`),
  rejectDoctor: (id, data) => authAPI.put(`/doctors/${id}/reject`, data),
  
  getAppointments: (params) => authAPI.get('/appointments', { params }),
  getPayments: (params) => authAPI.get('/payments', { params }),
  
  createDisease: (diseaseData) => authAPI.post('/diseases', diseaseData),
  updateDisease: (id, diseaseData) => authAPI.put(`/diseases/${id}`, diseaseData),
  deleteDisease: (id) => authAPI.delete(`/diseases/${id}`),
  
  createBlog: (blogData) => authAPI.post('/blogs', blogData),
  updateBlog: (id, blogData) => authAPI.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => authAPI.delete(`/blogs/${id}`),
  getAdminBlogs: (params) => authAPI.get('/blogs/admin/all', { params }),
  
  createNotification: (notificationData) => authAPI.post('/notifications', notificationData),
  sendBulkNotifications: (notificationData) => authAPI.post('/notifications/bulk', notificationData),
  getNotificationStats: () => authAPI.get('/notifications/stats/dashboard'),
}

export default api
