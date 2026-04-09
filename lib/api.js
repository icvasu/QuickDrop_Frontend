import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// SLUG CHECK (Homepage)
// ============================================
export const checkSlugAvailability = async (slug) => {
  const response = await api.get(`/slugs/check/${slug}`);
  return response.data;
};

// ============================================
// PAGE INFO (Get all info for a slug)
// ============================================
export const getFileInfo = async (slug) => {
  const response = await api.get(`/files/${slug}/info`);
  return response.data;
};

// ============================================
// TEXT CONTENT (Separate from files)
// ============================================
export const saveTextContent = async (slug, textContent) => {
  const response = await api.post(`/text/${slug}/save`, { textContent });
  return response.data;
};

export const getTextContent = async (slug) => {
  const response = await api.get(`/text/${slug}`);
  return response.data;
};

// ============================================
// FILE UPLOADS (Only for actual files)
// ============================================
export const uploadFile = async (formData) => {
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============================================
// FILE DOWNLOAD
// ============================================
export const downloadFileById = async (fileId, password = null) => {
  const response = await api.get(`/files/download/${fileId}`, {
    headers: password ? { 'X-File-Password': password } : {},
    responseType: 'blob'
  });
  return response;
};

// ============================================
// FILE DELETE
// ============================================
export const deleteFileById = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};

// ============================================
// LOCK/UNLOCK PAGE
// ============================================
export const lockPage = async (slug, password) => {
  const response = await api.post(`/files/${slug}/lock`, { password });
  return response.data;
};

export const unlockPage = async (slug, password) => {
  const response = await api.post(`/files/${slug}/unlock`, { password });
  return response.data;
};

// Verify password for locked page
export const verifyPassword = async (slug, password) => {
  const response = await api.post(`/files/${slug}/verify-password`, { password });
  return response.data;
};

export default api;