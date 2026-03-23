import api from './api';

export default interface ChamCongChiTiet {
  MaChiTiet?: number;
  MaNV: string;
  TenNV?: string; // join từ NhanVien
  MaChamCong: number;
  GioVao?: string | null; // TIME hoặc null
  GioRa?: string | null; // TIME hoặc null
}
export const getChiTietByCa = async (id: number) => {
  const reponse = await api.get(`/chi-tiet/${id}`);
  return reponse.data;
};
