import api from './api';
export default interface PhongBan {
  MaPhongBan: string;
  TenPhongBan: string;
}
export const getAllPhongBan = async () => {
  const reponse = await api.get('/phong-ban');
  return reponse.data;
};
export const createPhongBan = async (data: PhongBan) => {
  const reponse = await api.post('/phong-ban/', data);
  return reponse.data;
};
export const updatePhongBan = async (id: string, data: PhongBan) => {
  const reponse = await api.put(`/phong-ban/${id}`, data);
  return reponse.data;
};
export const deletePhongBan = async (id: string) => {
  console.log(id);
  const reponse = await api.delete(`/phong-ban/${id}`);
  return reponse.data;
};
