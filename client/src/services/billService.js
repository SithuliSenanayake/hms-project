import api from './api';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getBills = async () => {
  const response = await api.get('/bills', authHeader());
  return response.data;
};

export const createBill = async (bill) => {
  const response = await api.post('/bills', bill, authHeader());
  return response.data;
};

export const markBillPaid = async (id) => {
  const response = await api.put(`/bills/${id}/pay`, {}, authHeader());
  return response.data;
};