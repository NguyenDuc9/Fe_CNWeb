'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllThuongPhat,
  createThuongPhat,
  updateThuongPhat,
  deleteThuongPhat,
  ThuongPhat,
} from '@/service/ThuongPhat';

export default function ThuongPhatPage() {
  const [data, setData] = useState<ThuongPhat[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const emptyForm: ThuongPhat = {
    MaTP: '',
    MaNV: '',
    Thang: '',
    Nam: '',
    Loai: '',
    SoTien: '',
    LyDo: '',
  };

  const [form, setForm] = useState<ThuongPhat>(emptyForm);

  // load data
  const loadData = async () => {
    const result = await getAllThuongPhat();
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

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      console.log(form);
      await updateThuongPhat(form.MaTP, form);
    } else {
      console.log(form);
      await createThuongPhat(form);
    }

    setShowForm(false);
    setIsEdit(false);
    setForm(emptyForm);

    loadData();
  };

  // edit
  const handleEdit = (item: ThuongPhat) => {
    setForm(item);
    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteThuongPhat(id);
      loadData();
    }
  };

  // search
  const filtered = data.filter(
    (item) =>
      item.MaNV?.toLowerCase().includes(search.toLowerCase()) ||
      item.MaTP?.toString().includes(search),
  );

  return (
    <div className="table-container">
      <div className="toolbar">
        <div className="div-btn">
          <h1>Danh Sách Thưởng Phạt</h1>

          <button
            className="btn-add"
            onClick={() => {
              setForm(emptyForm);
              setIsEdit(false);
              setShowForm(true);
            }}
          >
            <Plus size={18} /> Thêm Thưởng Phạt
          </button>
        </div>

        <input
          className="search"
          placeholder="Tìm theo mã nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Mã TP</th>
            <th>Mã NV</th>
            <th>Tháng</th>
            <th>Năm</th>
            <th>Loại</th>
            <th>Số Tiền</th>
            <th>Lý Do</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.MaTP}>
              <td>{item.MaTP}</td>
              <td>{item.MaNV}</td>
              <td>{item.Thang}</td>
              <td>{item.Nam}</td>
              <td>{item.Loai}</td>
              <td>{item.SoTien}</td>
              <td>{item.LyDo}</td>

              <td>
                <button onClick={() => handleEdit(item)}>
                  <Pencil size={18} />
                </button>

                <button onClick={() => handleDelete(item.MaTP)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h2>{isEdit ? 'Chỉnh sửa Thưởng Phạt' : 'Thêm Thưởng Phạt'}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Mã Nhân Viên</label>
                <input
                  name="MaNV"
                  value={form.MaNV}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tháng</label>
                <input
                  type="number"
                  name="Thang"
                  value={form.Thang}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Năm</label>
                <input
                  type="number"
                  name="Nam"
                  value={form.Nam}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Loại</label>

                <label>
                  <input
                    type="radio"
                    name="Loai"
                    value="Thuong"
                    checked={form.Loai === 'Thuong'}
                    onChange={handleChange}
                  />
                  Thưởng
                </label>

                <label>
                  <input
                    type="radio"
                    name="Loai"
                    value="Phat"
                    checked={form.Loai === 'Phat'}
                    onChange={handleChange}
                  />
                  Phạt
                </label>
              </div>

              <div className="form-group">
                <label>Số Tiền</label>
                <input
                  type="number"
                  name="SoTien"
                  value={form.SoTien}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lý Do</label>
                <input name="LyDo" value={form.LyDo} onChange={handleChange} />
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
