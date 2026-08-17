import api from './api';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getDoctors = async () => {
  const response = await api.get('/doctors', authHeader());
  return response.data;
};