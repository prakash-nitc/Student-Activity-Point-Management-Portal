import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// This interceptor automatically adds the user's auth token to every request
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});

// === Auth Routes ===
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// === Request Routes ===
export const createRequest = (requestData) => API.post('/requests', requestData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getMyRequests = () => API.get('/requests/myrequests');
export const getPendingRequestsForFA = () => API.get('/requests/pending/fa');
export const updateRequestStatus = (id, { status, comment }) => API.put(`/requests/${id}/status`, { status, comment });

// === Admin Routes ===
export const getFinalApprovalQueue = () => API.get('/requests/pending/admin');
export const getAllUsers = () => API.get('/admin/users');
export const assignPrimaryFa = (studentId, faId) => API.put('/admin/users/assign-fa', { studentId, faId });
export const getAllCategories = () => API.get('/admin/categories');
export const createCategory = (categoryData) => API.post('/admin/categories', categoryData);