import api from './api';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getPatients = async (search = '') => {
  const response = await api.get(`/patients${search ? `?search=${search}` : ''}`, authHeader());
  return response.data;
};

export const createPatient = async (patient) => {
  const response = await api.post('/patients', patient, authHeader());
  return response.data;
};

export const updatePatient = async (id, patient) => {
  const response = await api.put(`/patients/${id}`, patient, authHeader());
  return response.data;
};