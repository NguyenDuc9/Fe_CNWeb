import api from './api';

export interface Luong {
  MaLuong?: number; // optional vì AUTO_INCREMENT
  MaNV: string;
  Thang: number;
  Nam: number;

  LuongCoBan: number;
  TienNgayCong: number;
  TongPhuCap: number;
  TienTangCa: number;
  TongThuong: number;
  TongPhat: number;
  BaoHiem: number;
  LuongThucNhan: number;

  NgayTinhLuong?: string; // optional vì có default CURRENT_TIMESTAMP
}

export const getAllLuong = async () => {
  const reponse = await api.get('/luong');
  return reponse.data;
};
export const getLuongById = async (id: string) => {
  const reponse = await api.get(`/luong/${id}`);
  return reponse.data;
};

export const createLuong = async (data: Luong) => {
  const reponse = await api.post('/luong', data);
  return reponse.data;
};
export const updateLuong = async (id: string, data: Luong) => {
  const reponse = await api.put(`/luong/${id}`, data);
  return reponse.data;
};
export const deleteLuong = async (id: string) => {
  const reponse = await api.delete(`/luong/${id}`);
  return reponse.data;
};
