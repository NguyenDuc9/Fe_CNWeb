'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllPhuCap,
  createPhuCap,
  updatePhuCap,
  deletePhuCap,
} from '@/service/PhuCap.api';
import PhuCap from '@/service/PhuCap.api';
export default function PhuCapPage() {
  const [data, setData] = useState<PhuCap[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<PhuCap>({
    MaPhuCap: '',
    MaNV: '',
    TenPhuCap: '',
    SoTien: '',
  });

  // load data
  const loadData = async () => {
    const result = await getAllPhuCap();
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
      await updatePhuCap(form.MaPhuCap, form);
    } else {
      console.log(form);
      await createPhuCap(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      MaPhuCap: '',
      MaNV: '',
      TenPhuCap: '',
      SoTien: '',
    });

    loadData();
  };

  // edit
  const handleEdit = (nv: PhuCap) => {
    setForm(nv);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deletePhuCap(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (nv) =>
      nv.MaPhuCap?.toLowerCase().includes(search.toLowerCase()) ||
      nv.TenPhuCap?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sach Phu Cap</h1>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setForm({
                MaPhuCap: '',
                MaNV: '',
                TenPhuCap: '',
                SoTien: '',
              });
            }}
          >
            <Plus size={18} /> Thêm
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
            <th>Mã Phu Cap</th>
            <th>Ma NHan Vien</th>
            <th>Ten Phu Cap</th>
            <th>So Tien</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((nv) => (
            <tr key={nv.MaPhuCap}>
              <td>{nv.MaPhuCap}</td>
              <td>{nv.MaNV}</td>
              <td>{nv.TenPhuCap}</td>
              <td>{nv.SoTien}</td>

              <td>
                <button onClick={() => handleEdit(nv)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(nv.MaPhuCap)}>
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
            <h2>{isEdit ? 'Chỉnh sửa phu cap' : 'Thêm phu cap'}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Mã Phu cap</label>
                <input
                  name="MaPhuCap"
                  value={form.MaPhuCap}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ma nhan vien</label>
                <input name="MaNV" value={form.MaNV} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Ten Phu Cap</label>
                <input
                  name="TenPhuCap"
                  value={form.TenPhuCap}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>So Tien</label>
                <input
                  type="number"
                  name="SoTien"
                  value={form.SoTien}
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
