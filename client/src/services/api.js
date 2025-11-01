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

// === User Profile Route ===
export const getUserProfile = () => API.get('/users/profile');

// === Category Route ===
export const getAllCategories = () => API.get('/categories'); // For student dropdown

// === Student Routes ===
export const createRequest = (requestData) => API.post('/requests', requestData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getMyRequests = () => API.get('/requests/myrequests');

// === FA Routes (F6, F7) ===
export const getRequestsForFA = () => API.get('/fa/requests');
export const updateFAStatus = (id, { status, comment }) => API.put(`/fa/requests/${id}/status`, { status, comment });
export const bulkApproveRequests = (requestIds) => API.post('/fa/requests/bulk-approve', { requestIds });

// === Admin Routes (F3, F4, F11) ===
export const getFinalApprovalQueue = () => API.get('/admin/requests/final-queue');
export const finalizeAdminApproval = (id, { status, comment }) => API.put(`/requests/${id}/status`, { status, comment });
export const getAdminAllUsers = () => API.get('/admin/users');
export const assignPrimaryFA = (studentId, faId) => API.put('/admin/users/assign-fa', { studentId, faId });
export const getAdminCategories = () => API.get('/admin/categories'); // Gets all categories for admin
export const createAdminCategory = (categoryData) => API.post('/admin/categories', categoryData); // Creates a category
export const updateAdminCategoryFA = (categoryId, faId) => API.put(`/admin/categories/${categoryId}`, { faId }); // Updates a category's FA