import api from './api';

export interface ThuongPhat {
  MaTP: number;
  MaNV: string;
  Thang: string;
  Nam: string;
  Loai: string;
  SoTien: string;
  LyDo: string;
}
export const getAllThuongPhat = async () => {
  const reponse = await api.get('/thuong-phat');
  return reponse.data;
};
// export const getNhanVienById = async (id: string) => {
//   const reponse = await api.get(`/nhan-vien/${id}`);
//   return reponse.data;
// };

export const createThuongPhat = async (data: ThuongPhat) => {
  const reponse = await api.post('/thuong-phat', data);
  return reponse.data;
};
export const updateThuongPhat = async (id: string, data: ThuongPhat) => {
  console.log('update data', data);
  const reponse = await api.put(`/thuong-phat/${id}`, data);
  return reponse.data;
};
export const deleteThuongPhat = async (id: string) => {
  const reponse = await api.delete(`/thuong-phat/${id}`);
  return reponse.data;
};
