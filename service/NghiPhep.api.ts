import api from './api';

export interface NghiPhep {
  MaNghiPhep: number;
  MaNV: string;
  NgayBatDau: string; // date
  NgayKetThuc: string; // date
  LyDo: string;
  TrangThai: 'Dang cho duyet' | 'Da duyet' | 'Tu choi';
  NgayTao: string; // date
}
export interface Leave {
  MaNghiPhep: number;
  MaNV: string;
  HoTen: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  LyDo: string;
  TrangThai: 'Dang cho duyet' | 'Da duyet' | 'Tu choi';
  NgayTao: string;
  SoNgay: number;
  LyDoTuChoi?: string;
}

export const getAllNghiPhep = async () => {
  const reponse = await api.get('/nghi-phep');
  return reponse.data;
};
export const getNghiPhepById = async (id: string) => {
  const reponse = await api.get(`/nghi-phep/${id}`);
  return reponse.data;
};

export const createNghiPhep = async (data: NghiPhep) => {
  const reponse = await api.post('/nghi-phep', data);
  return reponse.data;
};
export const updateNghiPhep = async (id: number, data: NghiPhep) => {
  const reponse = await api.put(`/nghi-phep/${id}`, data);
  return reponse.data;
};
export const deleteNghiPhep = async (id: number) => {
  const reponse = await api.delete(`/nghi-phep/${id}`);
  return reponse.data;
};
