'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllHDLD,
  createHDLD,
  updateHDLD,
  deleteHDLD,
} from '@/service/HDLD.api';
import HDLD from '@/service/HDLD.api';
export default function HDLDPage() {
  const [data, setData] = useState<HDLD[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<HDLD>({
    MaHD: '',
    MaNV: '',
    LuongCoBan: '',
    NgayBatDau: '',
    NgayKetThuc: '',
  });

  // load data
  const loadData = async () => {
    const result = await getAllHDLD();
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
      await updateHDLD(form.MaHD, form);
    } else {
      console.log(form);
      await createHDLD(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      MaHD: '',
      MaNV: '',
      LuongCoBan: '',
      NgayBatDau: '',
      NgayKetThuc: '',
    });

    loadData();
  };

  // edit
  const handleEdit = (nv: HDLD) => {
    setForm(nv);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteHDLD(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (nv) =>
      nv.MaHD?.toLowerCase().includes(search.toLowerCase()) ||
      nv.MaNV?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sach Hop Dong LD</h1>
          <button
            className="btn-add"
            onClick={() => {
              setIsEdit(false);
              setShowForm(true);
              setForm({
                MaHD: '',
                MaNV: '',
                LuongCoBan: '',
                NgayBatDau: '',
                NgayKetThuc: '',
              });
            }}
          >
            <Plus size={18} /> Thêm
          </button>
        </div>

        <input
          className="search"
          placeholder="Tìm HDLD..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã Hop Dong</th>
            <th>Ma NHan Vien</th>
            <th>Luong Co Ban</th>
            <th>Ngay Bat Dau</th>
            <th>Ngay Ket Thuc</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((nv) => (
            <tr key={nv.MaHD}>
              <td>{nv.MaHD}</td>
              <td>{nv.MaNV}</td>
              <td>{nv.LuongCoBan}</td>
              <td>{nv.NgayBatDau}</td>
              <td>{nv.NgayKetThuc}</td>

              <td>
                <button onClick={() => handleEdit(nv)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(nv.MaHD)}>
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
                <label>Mã Hop Dong</label>
                <input name="MaHD" value={form.MaHD} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Ma nhan vien</label>
                <input name="MaNV" value={form.MaNV} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Luong Co Ban</label>
                <input
                  type="number"
                  name="LuongCoBan"
                  value={form.LuongCoBan}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ngay Bat Dau</label>
                <input
                  type="date"
                  name="NgayBatDau"
                  value={form.NgayBatDau}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ngay ket thuc</label>
                <input
                  type="date"
                  name="NgayKetThuc"
                  value={form.NgayKetThuc}
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
