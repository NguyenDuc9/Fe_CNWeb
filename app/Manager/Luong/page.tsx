'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import '../../../public/stylesheets/admin.css';

import {
  getAllLuong,
  createLuong,
  updateLuong,
  deleteLuong,
  Luong,
} from '@/service/Luong.api';

export default function LuongPage() {
  const [data, setData] = useState<Luong[]>([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<Luong>({
    MaLuong: undefined, // AUTO_INCREMENT - optional
    MaNV: '',
    Thang: 0, // number
    Nam: 0, // number
    LuongCoBan: 0, // number
    TienNgayCong: 0, // number
    TongPhuCap: 0, // number
    TienTangCa: 0, // number
    TongThuong: 0, // number
    TongPhat: 0, // number
    BaoHiem: 0, // number
    LuongThucNhan: 0, // number
    NgayTinhLuong: '', // string/date
  });

  // load data
  const loadData = async () => {
    const result = await getAllLuong();
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
      await updateLuong(form.MaNV, form);
    } else {
      console.log(form);
      await createLuong(form);
    }

    setShowForm(false);
    setIsEdit(false);

    setForm({
      MaLuong: undefined, // AUTO_INCREMENT - optional
      MaNV: '',
      Thang: 0, // number
      Nam: 0, // number
      LuongCoBan: 0, // number
      TienNgayCong: 0, // number
      TongPhuCap: 0, // number
      TienTangCa: 0, // number
      TongThuong: 0, // number
      TongPhat: 0, // number
      BaoHiem: 0, // number
      LuongThucNhan: 0, // number
      NgayTinhLuong: '',
    });

    loadData();
  };

  // edit
  const handleEdit = (nv: Luong) => {
    setForm(nv);

    setIsEdit(true);
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      await deleteLuong(id);
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
                MaLuong: undefined, // AUTO_INCREMENT - optional
                MaNV: '',
                Thang: 0, // number
                Nam: 0, // number
                LuongCoBan: 0, // number
                TienNgayCong: 0, // number
                TongPhuCap: 0, // number
                TienTangCa: 0, // number
                TongThuong: 0, // number
                TongPhat: 0, // number
                BaoHiem: 0, // number
                LuongThucNhan: 0, // number
                NgayTinhLuong: '',
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
            <th>Mã lương</th>
            <th>Mã NV</th>
            <th>Tháng</th>
            <th>Năm</th>
            <th>Lương cơ bản</th>
            <th>Tiền ngày công</th>
            <th>Phụ cấp</th>
            <th>Tăng ca</th>
            <th>Thưởng</th>
            <th>Phạt</th>
            <th>Bảo hiểm</th>
            <th>Lương thực nhận</th>
            <th>Ngày tính</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((nv) => (
            <tr key={nv.MaLuong}>
              <td>{nv.MaLuong}</td>
              <td>{nv.MaNV}</td>
              <td>{nv.Thang}</td>
              <td>{nv.Nam}</td>
              <td>{nv.LuongCoBan}</td>
              <td>{nv.TienNgayCong}</td>
              <td>{nv.TongPhuCap}</td>
              <td>{nv.TienTangCa}</td>
              <td>{nv.TongThuong}</td>
              <td>{nv.TongPhat}</td>
              <td>{nv.BaoHiem}</td>
              <td>{nv.LuongThucNhan}</td>
              <td>{nv.NgayTinhLuong}</td>

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
                <label>Mã Luong</label>
                <input
                  name="MaLuong"
                  value={form.MaLuong}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Mã NV</label>
                <input name="MaNV" value={form.MaNV} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Thang</label>
                <input
                  name="Thang"
                  value={form.Thang}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input name="Nam" value={form.Nam} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Luong Co Ban</label>
                <input
                  name="LuongCoBan"
                  value={form.LuongCoBan}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tien Ngay Cong</label>
                <input
                  name="TienNgayCong"
                  value={form.TienNgayCong}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tong Phu Cap</label>
                <input
                  name="TongPhuCap"
                  value={form.TongPhuCap}
                  onChange={handleChange}
                />
              </div>
              <label>Tien Tang Ca</label>

              <div className="form-group">
                <label>Tien Tang Ca</label>
                <input
                  name="TienTangCa"
                  value={form.TienTangCa}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Tong Thuong</label>
                <input
                  name="TongThuong"
                  value={form.TongThuong}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Tong Phat</label>
                <input
                  name="TongPhat"
                  value={form.TongPhat}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Bao Hien</label>
                <input
                  name="BaoHiem"
                  value={form.BaoHiem}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Luong Thuc Nhan</label>
                <input
                  name="LuongThucNhan"
                  value={form.LuongThucNhan}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ngay Tinh Luong</label>
                <input
                  name="NgayTinhLuong"
                  value={form.NgayTinhLuong}
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
