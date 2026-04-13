import api from './api';
export default interface ChamVao {
  MaNV: string;
  MaChamCong: number;
  GioVao?: string | null;
}
export default interface ChamCongChiTiet {
  MaChiTiet?: number;
  MaNV: string;
  HoTen?: string; // join từ NhanVien
  MaChamCong: number;
  GioVao?: string | null; // TIME hoặc null
  GioRa?: string | null; // TIME hoặc null
}
export const getChiTietByCa = async (id: number) => {
  const reponse = await api.get(`/chi-tiet/${id}`);
  return reponse.data;
};
export const chamVao = async (data: {
  maNV: string;
  maChamCong: number;
  gioVao: string;
}) => {
  const response = await api.post('/chi-tiet/chamvao', data);
  return response.data;
};
export const chamRa = async (data: { MaChiTiet: string; GioRa: string }) => {
  console.log('data cham ra', data);
  const response = await api.put(`/chi-tiet/chamra/${data.MaChiTiet}`, data);

  return response.data;
};
export const getLichSu = async (id: number) => {
  const reponse = await api.get(`/chi-tiet/lichsu/${id}`);
  return reponse.data;
};
