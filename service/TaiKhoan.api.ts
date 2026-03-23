import api from './api';

export interface TaiKhoan {
  TenDangNhap: string;
  MatKhau: string;
  MaNV?: string;
  VaiTro?: string;
}

export const getAllTaiKhoan = async () => {
  const reponse = await api.get('/tai-khoan');
  return reponse.data;
};
// export const getNhanVienById = async (id: string) => {
//   const reponse = await api.get(`/nhan-vien/${id}`);
//   return reponse.data;
// };

export const createTaiKhoan = async (data: TaiKhoan) => {
  const reponse = await api.post('/tai-khoan', data);
  return reponse.data;
};
export const updateTaiKhoan = async (id: string, data: TaiKhoan) => {
  const reponse = await api.put(`/tai-khoan/${id}`, data);
  return reponse.data;
};
export const deleteTaiKhoan = async (id: string) => {
  const reponse = await api.delete(`/tai-khoan/${id}`);
  return reponse.data;
};
