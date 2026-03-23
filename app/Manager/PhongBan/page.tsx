'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllPhongBan,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
} from '@/service/PhongBan.api';
import PhongBan from '@/service/PhongBan.api';
export default function PhongBanPage() {
  const [data, setData] = useState<PhongBan[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<PhongBan>({
    MaPhongBan: '',
    TenPhongBan: '',
  });

  // load data
  const loadData = async () => {
    const result = await getAllPhongBan();
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
      await updatePhongBan(form.MaPhongBan, form);
    } else {
      console.log(form);
      await createPhongBan(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      MaPhongBan: '',
      TenPhongBan: '',
    });

    loadData();
  };

  // edit
  const handleEdit = (nv: PhongBan) => {
    setForm(nv);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deletePhongBan(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (nv) =>
      nv.MaPhongBan?.toLowerCase().includes(search.toLowerCase()) ||
      nv.TenPhongBan?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sach Phong Ban</h1>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setForm({
                MaPhongBan: '',
                TenPhongBan: '',
              });
            }}
          >
            <Plus size={18} /> Thêm Phong Ban
          </button>
        </div>

        <input
          className="search"
          placeholder="Tìm phong ban..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã Phong Ban</th>
            <th>Ten Phong Ban</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((nv) => (
            <tr key={nv.MaPhongBan}>
              <td>{nv.MaPhongBan}</td>
              <td>{nv.TenPhongBan}</td>

              <td>
                <button onClick={() => handleEdit(nv)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(nv.MaPhongBan)}>
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
            <h2>{isEdit ? 'Chỉnh sửa phong ban' : 'Thêm phong ban'}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Mã Phong Ban</label>
                <input
                  name="MaPhongBan"
                  value={form.MaPhongBan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ten Phong Ban</label>
                <input
                  name="TenPhongBan"
                  value={form.TenPhongBan}
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
