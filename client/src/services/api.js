import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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
export const updateRequestStatus = (id, { status, comment }) => API.put(`/requests/${id}/status`, { status, comment });

// === FA Routes ===
export const getRequestsForFA = () => API.get('/fa/requests');
export const submitFAReview = (requestId, { comment }) => API.put(`/fa/requests/${requestId}/review`, { comment });

// === Admin Routes ===
export const getUnassignedRequests = () => API.get('/admin/requests/unassigned');
export const getFinalApprovalQueue = () => API.get('/admin/requests/final-queue');
export const assignFaToRequest = (requestId, faId) => API.put(`/admin/requests/${requestId}/assign-fa`, { faId });
export const getAllUsers = () => API.get('/admin/users');

// === Category Routes ===
export const getAllCategories = () => API.get('/categories');