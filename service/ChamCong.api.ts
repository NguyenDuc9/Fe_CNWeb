import api from './api';

export default interface ChamCong {
  MaChamCong: number;
  CaLamViec: string;
  ThoiGian: string;
}
export interface TaoChamCong {
  CaLamViec: string;
  ThoiGian: string;
}

export const getAllChamCong = async () => {
  const reponse = await api.get('/cham-cong');
  return reponse.data;
};

export const createChamCong = async (data: TaoChamCong) => {
  const reponse = await api.post('/cham-cong', data);
  return reponse.data;
};
export const updateChamCong = async (id: number, data: ChamCong) => {
  const reponse = await api.put(`/cham-cong/${id}`, data);
  return reponse.data;
};
export const deleteChamCong = async (id: number) => {
  const reponse = await api.delete(`/cham-cong/${id}`);
  return reponse.data;
};
export const getChamCongHomNay = async () => {
  const reponse = await api.get('/cham-cong/conghomnay');
  return reponse.data;
};
