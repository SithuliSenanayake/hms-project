import api from './api';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getAppointments = async () => {
  const response = await api.get('/appointments', authHeader());
  return response.data;
};

export const createAppointment = async (appointment) => {
  const response = await api.post('/appointments', appointment, authHeader());
  return response.data;
};

export const updateAppointment = async (id, appointment) => {
  const response = await api.put(`/appointments/${id}`, appointment, authHeader());
  return response.data;
};