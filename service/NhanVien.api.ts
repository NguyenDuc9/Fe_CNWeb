import api from './api';

export interface NhanVien {
  MaNV: string;
  HoTen: string;
  NgaySinh?: string;
  GioiTinh?: string;
  DienThoai?: string;
  DiaChi?: string;
  MaPhongBan?: string;
  TrangThai?: 'Dang lam' | 'Nghi viec';
}

export const getAllNhanVien = async () => {
  const reponse = await api.get('/nhan-vien');
  return reponse.data;
};
export const getNhanVienById = async (id: string) => {
  const reponse = await api.get(`/nhan-vien/${id}`);
  return reponse.data;
};

export const createNhanVien = async (data: NhanVien) => {
  const reponse = await api.post('/nhan-vien', data);
  return reponse.data;
};
export const updateNhanVien = async (id: string, data: NhanVien) => {
  const reponse = await api.put(`/nhan-vien/${id}`, data);
  return reponse.data;
};
export const deleteNhanVien = async (id: string) => {
  const reponse = await api.delete(`/nhan-vien/${id}`);
  return reponse.data;
};
