'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Clock,
  UserCheck,
  LogOut,
  CheckCircle,
} from 'lucide-react';

import ChamCong from '@/service/ChamCong.api';
import {
  createChamCong,
  getAllChamCong,
  updateChamCong,
  deleteChamCong,
} from '@/service/ChamCong.api';
import ChamCongChiTiet from '@/service/ChiTietCC.api';
import { getChiTietByCa } from '@/service/ChiTietCC.api';
// ===================== TYPES (khớp với DB) =====================
// export interface ChamCong {
//   MaChamCong: number;
//   CaLamViec: string; // 'Ca 1' | 'Ca 2' | 'Ca 3'
//   ThoiGian: string; // 'YYYY-MM-DD'
// }

// export interface ChamCongChiTiet {
//   MaChiTiet?: number;
//   MaNV: string;
//   TenNV?: string; // join từ NhanVien
//   MaChamCong: number;
//   GioVao?: string | null; // TIME hoặc null
//   GioRa?: string | null; // TIME hoặc null
// }

// ===================== MOCK APIs (xóa & thay bằng service thực khi tích hợp BE) =====================
// const _mockChamCong: ChamCong[] = [
//   { MaChamCong: 1, CaLamViec: 'Ca 1', ThoiGian: '2026-03-21' },
//   { MaChamCong: 2, CaLamViec: 'Ca 2', ThoiGian: '2026-03-21' },
// ];

// const _mockChiTiet: ChamCongChiTiet[] = [
//   {
//     MaChiTiet: 1,
//     MaNV: 'NV01',
//     TenNV: 'Nguyễn Văn A',
//     MaChamCong: 1,
//     GioVao: '08:00',
//     GioRa: '17:00',
//   },
//   {
//     MaChiTiet: 2,
//     MaNV: 'NV02',
//     TenNV: 'Trần Thị B',
//     MaChamCong: 1,
//     GioVao: '08:15',
//     GioRa: null,
//   },
//   {
//     MaChiTiet: 3,
//     MaNV: 'NV03',
//     TenNV: 'Lê Văn C',
//     MaChamCong: 1,
//     GioVao: null,
//     GioRa: null,
//   },
//   {
//     MaChiTiet: 4,
//     MaNV: 'NV04',
//     TenNV: 'Phạm Thị D',
//     MaChamCong: 1,
//     GioVao: null,
//     GioRa: null,
//   },
//   {
//     MaChiTiet: 5,
//     MaNV: 'NV05',
//     TenNV: 'Hoàng Văn E',
//     MaChamCong: 1,
//     GioVao: null,
//     GioRa: null,
//   },
// ];

// const API = {
//   getAllChamCong: async (): Promise<ChamCong[]> =>
//     JSON.parse(JSON.stringify(_mockChamCong)),

//   createChamCong: async (payload: {
//     CaLamViec: string;
//     ThoiGian: string;
//   }): Promise<void> => {
//     _mockChamCong.push({ MaChamCong: _mockChamCong.length + 1, ...payload });
//   },

//   updateChamCong: async (
//     id: number,
//     payload: { CaLamViec: string },
//   ): Promise<void> => {
//     const row = _mockChamCong.find((c) => c.MaChamCong === id);
//     if (row) row.CaLamViec = payload.CaLamViec;
//   },

//   deleteChamCong: async (id: number): Promise<void> => {
//     const idx = _mockChamCong.findIndex((c) => c.MaChamCong === id);
//     if (idx !== -1) _mockChamCong.splice(idx, 1);
//   },

//   getChiTietByCa: async (maChamCong: number): Promise<ChamCongChiTiet[]> =>
//     JSON.parse(
//       JSON.stringify(_mockChiTiet.filter((c) => c.MaChamCong === maChamCong)),
//     ),

//   chamVao: async (maNV: string, maChamCong: number): Promise<void> => {
//     const row = _mockChiTiet.find(
//       (c) => c.MaNV === maNV && c.MaChamCong === maChamCong,
//     );
//     if (row) row.GioVao = new Date().toTimeString().slice(0, 5);
//   },

//   chamRa: async (maNV: string, maChamCong: number): Promise<void> => {
//     const row = _mockChiTiet.find(
//       (c) => c.MaNV === maNV && c.MaChamCong === maChamCong,
//     );
//     if (row) row.GioRa = new Date().toTimeString().slice(0, 5);
//   },
// };
// ===================== HẾT MOCK =====================

const CA_OPTIONS = ['Ca 1', 'Ca 2', 'Ca 3'];
const todayISO = () => new Date().toISOString().split('T')[0];

type ViewMode = 'list' | 'detail';

// ========================= COMPONENT =========================
export default function ChamCongPage() {
  // ---- State danh sách ca ----
  const [data, setData] = useState<ChamCong[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formCa, setFormCa] = useState('Ca 1');
  const [editId, setEditId] = useState<number | null>(null);

  // ---- State chi tiết ca ----
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCa, setSelectedCa] = useState<ChamCong | null>(null);
  const [chiTiet, setChiTiet] = useState<ChamCongChiTiet[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadData = async () => setData(await getAllChamCong());

  useEffect(() => {
    loadData();
  }, []);

  const loadChiTiet = async (maChamCong: number) => {
    setLoadingDetail(true);
    setChiTiet(await getChiTietByCa(maChamCong));
    setLoadingDetail(false);
  };

  // ---- Submit tạo / sửa ca ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editId !== null) {
      await updateChamCong(editId, { CaLamViec: formCa });
    } else {
      // ThoiGian tự động = ngày hiện tại
      await createChamCong({
        CaLamViec: formCa,
        ThoiGian: todayISO(),
      });
    }
    setShowForm(false);
    setIsEdit(false);
    setFormCa('Ca 1');
    setEditId(null);
    loadData();
  };

  const openCreate = () => {
    setIsEdit(false);
    setEditId(null);
    setFormCa('Ca 1');
    setShowForm(true);
  };

  const openEdit = (ca: ChamCong, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormCa(ca.CaLamViec);
    setEditId(ca.MaChamCong);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa ca này?')) {
      await deleteChamCong(id);
      loadData();
    }
  };

  const openDetail = (ca: ChamCong) => {
    setSelectedCa(ca);
    setViewMode('detail');
    loadChiTiet(ca.MaChamCong);
  };

  // ---- Chấm vào / Chấm ra ----
  const handleChamVao = async (maNV: string) => {
    if (!selectedCa) return;
    await chamVao(maNV, selectedCa.MaChamCong);
    loadChiTiet(selectedCa.MaChamCong);
  };

  const handleChamRa = async (maNV: string) => {
    if (!selectedCa) return;
    await chamRa(maNV, selectedCa.MaChamCong);
    loadChiTiet(selectedCa.MaChamCong);
  };

  const filtered = data.filter(
    (c) =>
      String(c.MaChamCong).includes(search) ||
      c.CaLamViec?.toLowerCase().includes(search.toLowerCase()),
  );

  const daCham = chiTiet.filter((nv) => nv.GioVao);
  const chuaCham = chiTiet.filter((nv) => !nv.GioVao);

  // ========================= VIEW: CHI TIẾT CA =========================
  if (viewMode === 'detail' && selectedCa) {
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setViewMode('list')}>
          <ArrowLeft size={16} /> Quay lại
        </button>

        {/* Thông tin ca */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Thông tin ca</h2>
          <div style={s.infoGrid}>
            <div>
              <div style={s.infoLabel}>Mã chấm công</div>
              <div style={s.infoValue}>{selectedCa.MaChamCong}</div>
            </div>
            <div>
              <div style={s.infoLabel}>Ca làm việc</div>
              <div style={s.infoValue}>{selectedCa.CaLamViec}</div>
            </div>
            <div>
              <div style={s.infoLabel}>Ngày</div>
              <div style={s.infoValue}>{selectedCa.ThoiGian}</div>
            </div>
          </div>
          <div style={s.statsRow}>
            <span
              style={{ ...s.chip, background: '#e8f5e9', color: '#2e7d32' }}
            >
              <CheckCircle size={13} /> {daCham.length} đã chấm
            </span>
            <span
              style={{ ...s.chip, background: '#fce4ec', color: '#c62828' }}
            >
              <Clock size={13} /> {chuaCham.length} chưa chấm
            </span>
          </div>
        </div>

        {/* Bảng nhân viên */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Danh sách nhân viên</h2>
          {loadingDetail ? (
            <div
              style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}
            >
              Đang tải...
            </div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  {[
                    'Mã NV',
                    'Tên NV',
                    'Trạng thái',
                    'Giờ vào',
                    'Giờ ra',
                    'Hành động',
                  ].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chiTiet.map((nv) => {
                  /**
                   * LOGIC từ dữ liệu BE (bảng ChamCongChiTiet):
                   *   GioVao = null              → Chưa chấm    → nút "Chấm công"  (xanh dương)
                   *   GioVao != null, GioRa=null → Đã vào chưa ra → nút "Chấm ra" (đỏ cam)
                   *   GioVao != null, GioRa!=null → Hoàn thành  → text mờ
                   */
                  const daNhanVao = !!nv.GioVao;
                  const daNhanRa = !!nv.GioRa;

                  return (
                    <tr key={`${nv.MaNV}-${nv.MaChiTiet}`} style={s.tr}>
                      <td style={s.td}>{nv.MaNV}</td>
                      {/* <td style={{ ...s.td, fontWeight: 500 }}>
                        {nv.TenNV ?? nv.MaNV}
                      </td> */}
                      <td style={s.td}>
                        {daNhanVao ? (
                          <span style={s.badgeGreen}>● Đã chấm</span>
                        ) : (
                          <span style={s.badgeRed}>● Chưa chấm</span>
                        )}
                      </td>
                      <td style={s.td}>{nv.GioVao ?? '-'}</td>
                      <td style={s.td}>{nv.GioRa ?? '-'}</td>
                      <td style={s.td}>
                        {daNhanVao && daNhanRa ? (
                          <span style={s.actionDone}>Hoàn thành</span>
                        ) : daNhanVao && !daNhanRa ? (
                          <button
                            style={s.btnChamRa}
                            onClick={() => handleChamRa(nv.MaNV)}
                          >
                            <LogOut size={14} /> Chấm ra
                          </button>
                        ) : (
                          <button
                            style={s.btnChamCong}
                            onClick={() => handleChamVao(nv.MaNV)}
                          >
                            <UserCheck size={14} /> Chấm công
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {chiTiet.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        ...s.td,
                        textAlign: 'center',
                        color: '#bbb',
                        padding: '32px',
                      }}
                    >
                      Không có nhân viên trong ca này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ========================= VIEW: DANH SÁCH CA =========================
  return (
    <div style={s.page}>
      <div style={s.toolbar}>
        <h1 style={s.pageTitle}>Tạo ca chấm công</h1>
        <button style={s.btnPrimary} onClick={openCreate}>
          <Plus size={16} /> Tạo ca mới
        </button>
      </div>

      <input
        style={s.searchInput}
        placeholder="Tìm kiếm ca chấm công..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              {['Mã CC', 'Ca làm việc', 'Thời gian', 'Hành động'].map((h) => (
                <th key={h} style={s.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ca) => (
              <tr
                key={ca.MaChamCong}
                style={{ ...s.tr, cursor: 'pointer' }}
                onClick={() => openDetail(ca)}
              >
                <td style={s.td}>{ca.MaChamCong}</td>
                <td style={{ ...s.td, fontWeight: 500 }}>{ca.CaLamViec}</td>
                <td style={{ ...s.td, color: '#888' }}>{ca.ThoiGian}</td>
                <td style={s.td} onClick={(e) => e.stopPropagation()}>
                  <button
                    style={s.iconBtn}
                    title="Chỉnh sửa"
                    onClick={(e) => openEdit(ca, e)}
                  >
                    <Pencil size={16} color="#1976d2" />
                  </button>
                  <button
                    style={s.iconBtn}
                    title="Xóa"
                    onClick={(e) => handleDelete(ca.MaChamCong, e)}
                  >
                    <Trash2 size={16} color="#d32f2f" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    ...s.td,
                    textAlign: 'center',
                    color: '#bbb',
                    padding: '32px',
                  }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============ MODAL TẠO / SỬA CA ============ */}
      {showForm && (
        <div style={s.overlay}>
          <form style={s.modal} onSubmit={handleSubmit}>
            <h2 style={s.modalTitle}>
              {isEdit ? 'Chỉnh sửa ca' : 'Tạo ca mới'}
            </h2>

            {/* Combobox chọn ca */}
            <div style={s.formGroup}>
              <label style={s.label}>Ca làm việc</label>
              <select
                style={s.select}
                value={formCa}
                onChange={(e) => setFormCa(e.target.value)}
                required
              >
                {CA_OPTIONS.map((ca) => (
                  <option key={ca} value={ca}>
                    {ca}
                  </option>
                ))}
              </select>
            </div>

            {/* Thời gian: tự động lấy ngày hiện tại, read-only */}
            <div style={s.formGroup}>
              <label style={s.label}>Thời gian</label>
              <input
                style={{
                  ...s.input,
                  background: '#f7f8fc',
                  color: '#888',
                  cursor: 'not-allowed',
                }}
                value={todayISO()}
                readOnly
              />
              <span
                style={{
                  fontSize: '11px',
                  color: '#9aa3b5',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Tự động lấy ngày hiện tại
              </span>
            </div>

            <div style={s.modalActions}>
              <button type="submit" style={s.btnPrimary}>
                {isEdit ? 'Cập nhật' : 'Tạo ca'}
              </button>
              <button
                type="button"
                style={s.btnCancel}
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

// ========================= STYLES =========================
const s: Record<string, React.CSSProperties> = {
  page: {
    padding: '28px 32px',
    background: '#f4f6fb',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  pageTitle: { fontSize: '22px', fontWeight: 700, color: '#1a2340', margin: 0 },
  searchInput: {
    display: 'block',
    width: '100%',
    maxWidth: '360px',
    padding: '9px 14px',
    borderRadius: '8px',
    border: '1px solid #dde3ee',
    fontSize: '14px',
    background: '#fff',
    marginBottom: '18px',
    outline: 'none',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#1a2340',
    marginTop: 0,
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '16px',
    marginBottom: '20px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#9aa3b5',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: { fontSize: '16px', fontWeight: 600, color: '#1a2340' },
  statsRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7f8fc' },
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: 600,
    color: '#4a5568',
    borderBottom: '1px solid #edf0f7',
  },
  tr: { borderBottom: '1px solid #f0f2f8' },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#2d3748',
    verticalAlign: 'middle',
  },
  badgeGreen: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
  },
  badgeRed: {
    background: '#fce4ec',
    color: '#c62828',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500,
  },
  actionDone: { color: '#9aa3b5', fontSize: '13px' },
  btnChamCong: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#1565c0',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnChamRa: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    marginRight: '2px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    background: '#1565c0',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#1565c0',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '20px',
    padding: 0,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    width: '400px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a2340',
    margin: '0 0 24px',
  },
  formGroup: { marginBottom: '18px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#4a5568',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dde3ee',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box' as const,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dde3ee',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  btnCancel: {
    background: '#f0f2f8',
    color: '#4a5568',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
