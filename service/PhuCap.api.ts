import api from './api';

export interface PhuCap {
  MaPhuCap: string;
  MaNV: string;
  TenPhuCap: string;
  SoTien: number;
}

export const getAllPhuCap = async () => {
  const reponse = await api.get('/phu-cap');
  return reponse.data;
};
export const getPhuCapById = async (id: string) => {
  const reponse = await api.get(`/phu-cap/${id}`);
  return reponse.data;
};

export const createPhuCap = async (data: PhuCap) => {
  const reponse = await api.post('/phu-cap', data);
  return reponse.data;
};
export const updatePhuCap = async (id: string, data: PhuCap) => {
  const reponse = await api.put(`/phu-cap/${id}`, data);
  return reponse.data;
};
export const deletePhuCap = async (id: string) => {
  const reponse = await api.delete(`/phu-cap/${id}`);
  return reponse.data;
};
