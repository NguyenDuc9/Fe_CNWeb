import api from './api';

export default interface HDLD {
  MaHD: string;
  MaNV: string;
  LuongCoBan: string;
  NgayBatDau: string;
  NgayKetThuc: string;
}

export const getAllHDLD = async () => {
  const reponse = await api.get('/hop-dong');
  return reponse.data;
};
export const getHDLDById = async (id: string) => {
  const reponse = await api.get(`/hop-dong/${id}`);
  return reponse.data;
};

export const createHDLD = async (data: HDLD) => {
  const reponse = await api.post('/hop-dong', data);
  return reponse.data;
};
export const updateHDLD = async (id: string, data: HDLD) => {
  const reponse = await api.put(`/hop-dong/${id}`, data);
  return reponse.data;
};
export const deleteHDLD = async (id: string) => {
  const reponse = await api.delete(`/hop-dong/${id}`);
  return reponse.data;
};
