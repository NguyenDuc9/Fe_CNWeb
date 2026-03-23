'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllTaiKhoan,
  createTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
  TaiKhoan,
} from '@/service/TaiKhoan.api';

export default function NhanVienPage() {
  const [data, setData] = useState<TaiKhoan[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<TaiKhoan>({
    TenDangNhap: '',
    MatKhau: '',
    MaNV: '',
    VaiTro: '',
  });

  // load data
  const loadData = async () => {
    const result = await getAllTaiKhoan();
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
      await updateTaiKhoan(form.TenDangNhap, form);
    } else {
      await createTaiKhoan(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      TenDangNhap: '',
      MatKhau: '',
      MaNV: '',
      VaiTro: '',
    });

    loadData();
  };

  // edit
  const handleEdit = (tk: TaiKhoan) => {
    setForm(tk);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteTaiKhoan(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (tk) =>
      tk.TenDangNhap?.toLowerCase().includes(search.toLowerCase()) ||
      tk.MaNV?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sach Tai Khoan</h1>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setForm({
                TenDangNhap: '',
                MatKhau: '',
                MaNV: '',
                VaiTro: '',
              });
            }}
          >
            <Plus size={18} /> Thêm tai khoan
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
            <th>Ten Dang Nhap</th>
            <th>Mat Khau</th>
            <th>Ma Nhan Vien</th>
            <th>Vai Tro</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((tk) => (
            <tr key={tk.TenDangNhap}>
              <td>{tk.TenDangNhap}</td>
              <td>{tk.MatKhau}</td>
              <td>{tk.MaNV}</td>
              <td>{tk.VaiTro}</td>
              <td>
                <button onClick={() => handleEdit(tk)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(tk.TenDangNhap)}>
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
            <h2>{isEdit ? 'Chỉnh sửa Tai Khoan' : 'Thêm Tai Khoan'}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Ten Dang Nhap</label>
                <input
                  name="TenDangNhap"
                  value={form.TenDangNhap}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mat Khau</label>
                <input
                  name="MatKhau"
                  value={form.MatKhau}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ma Nhan Vien</label>
                <input
                  // type="date"
                  name="MaNV"
                  value={form.MaNV}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Vai Tro</label>
                <input
                  name="VaiTro"
                  value={form.VaiTro}
                  onChange={handleChange}
                />
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
