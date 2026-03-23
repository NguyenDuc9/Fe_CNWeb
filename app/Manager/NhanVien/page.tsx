'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllNhanVien,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  NhanVien,
} from '@/service/NhanVien.api';

export default function NhanVienPage() {
  const [data, setData] = useState<NhanVien[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<NhanVien>({
    MaNV: '',
    HoTen: '',
    NgaySinh: '',
    GioiTinh: '',
    DienThoai: '',
    DiaChi: '',
    MaPhongBan: '',
    TrangThai: 'Dang lam',
  });

  // load data
  const loadData = async () => {
    const result = await getAllNhanVien();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  // input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      console.log(form);
      await updateNhanVien(form.MaNV, form);
    } else {
      console.log(form);
      await createNhanVien(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      MaNV: '',
      HoTen: '',
      NgaySinh: '',
      GioiTinh: '',
      DienThoai: '',
      DiaChi: '',
      MaPhongBan: '',
      TrangThai: 'Dang lam',
    });

    loadData();
  };

  // edit
  const handleEdit = (nv: NhanVien) => {
    setForm(nv);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteNhanVien(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (nv) =>
      nv.HoTen?.toLowerCase().includes(search.toLowerCase()) ||
      nv.MaNV?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sach Nhan Vien</h1>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setForm({
                MaNV: '',
                HoTen: '',
                NgaySinh: '',
                GioiTinh: '',
                DienThoai: '',
                DiaChi: '',
                MaPhongBan: '',
                TrangThai: 'Dang lam',
              });
            }}
          >
            <Plus size={18} /> Thêm nhân viên
          </button>
        </div>

        <input
          className="search"
          placeholder="Tìm nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Phòng ban</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((nv) => (
            <tr key={nv.MaNV}>
              <td>{nv.MaNV}</td>
              <td>{nv.HoTen}</td>
              <td>{nv.NgaySinh}</td>
              <td>{nv.GioiTinh}</td>
              <td>{nv.DienThoai}</td>
              <td>{nv.DiaChi}</td>
              <td>{nv.MaPhongBan}</td>
              <td>{nv.TrangThai}</td>

              <td>
                <button onClick={() => handleEdit(nv)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(nv.MaNV)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM MODAL */}

      {showForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h2>{isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Mã NV</label>
                <input name="MaNV" value={form.MaNV} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Họ tên</label>
                <input
                  name="HoTen"
                  value={form.HoTen}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="NgaySinh"
                  value={form.NgaySinh}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>

                <label>
                  <input
                    type="radio"
                    name="GioiTinh"
                    value="Nam"
                    checked={form.GioiTinh === 'Nam'}
                    onChange={handleChange}
                  />
                  Nam
                </label>

                <label>
                  <input
                    type="radio"
                    name="GioiTinh"
                    value="Nu"
                    checked={form.GioiTinh === 'Nu'}
                    onChange={handleChange}
                  />
                  Nữ
                </label>
              </div>

              <div className="form-group">
                <label>Điện thoại</label>
                <input
                  name="DienThoai"
                  value={form.DienThoai}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  name="DiaChi"
                  value={form.DiaChi}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mã phòng ban</label>
                <input
                  name="MaPhongBan"
                  value={form.MaPhongBan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>

                <select
                  name="TrangThai"
                  value={form.TrangThai}
                  onChange={handleChange}
                >
                  <option value="Dang lam">Đang làm</option>
                  <option value="Da nghi">Đã nghỉ</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-add">
                {isEdit ? 'Cập nhật' : 'Thêm'}
              </button>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForm(false)}
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
