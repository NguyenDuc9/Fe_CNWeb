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
  History,
  Search,
  List,
  CalendarDays,
} from 'lucide-react';

import ChamCong from '@/service/ChamCong.api';
import {
  createChamCong,
  getAllChamCong,
  updateChamCong,
  deleteChamCong,
  getChamCongHomNay,
} from '@/service/ChamCong.api';
import ChamCongChiTiet from '@/service/ChiTietCC.api';
import {
  getChiTietByCa,
  chamRa,
  chamVao,
  getLichSu,
} from '@/service/ChiTietCC.api';
import { error } from 'console';

const CA_OPTIONS = ['Ca 1', 'Ca 2', 'Ca 3'];
const todayISO = () => new Date().toISOString().split('T')[0];

// So sánh ngày ca với ngày máy tính hiện tại
const isToday = (thoiGian: string) => {
  if (!thoiGian) return false;
  const caDate = thoiGian.split('T')[0].slice(0, 10);
  return caDate === todayISO();
};

type PanelMode = 'chamVao' | 'chamRa' | 'lichSu' | null;
type ViewMode = 'list' | 'detail';
type ListMode = 'today' | 'all';

// ========================= COMPONENT =========================
export default function ChamCongPage() {
  // ---- State danh sách ca ----
  const [data, setData] = useState<ChamCong[]>([]);
  const [listMode, setListMode] = useState<ListMode>('today');
  const [loadingList, setLoadingList] = useState(false);
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

  // ---- State panel inline ----
  const [panelCa, setPanelCa] = useState<ChamCong | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [panelData, setPanelData] = useState<ChamCongChiTiet[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelSearch, setPanelSearch] = useState('');

  const loadData = async (mode: ListMode = listMode) => {
    setLoadingList(true);
    if (mode === 'today') {
      setData(await getChamCongHomNay());
    } else {
      setData(await getAllChamCong());
    }
    setLoadingList(false);
  };

  useEffect(() => {
    loadData('today');
  }, []);

  const switchListMode = (mode: ListMode) => {
    setListMode(mode);
    setPanelCa(null);
    setPanelMode(null);
    setPanelSearch('');
    loadData(mode);
  };

  const loadChiTiet = async (maChamCong: number) => {
    setLoadingDetail(true);
    setChiTiet(await getChiTietByCa(maChamCong));
    setLoadingDetail(false);
  };

  const loadPanelData = async (maChamCong: number, mode: PanelMode) => {
    setPanelLoading(true);
    if (mode === 'lichSu') {
      setPanelData(await getLichSu(maChamCong));
    } else {
      setPanelData(await getChiTietByCa(maChamCong));
    }
    setPanelLoading(false);
  };

  const openPanel = (ca: ChamCong, mode: PanelMode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (panelCa?.MaChamCong === ca.MaChamCong && panelMode === mode) {
      setPanelCa(null);
      setPanelMode(null);
      setPanelSearch('');
      return;
    }
    setPanelCa(ca);
    setPanelMode(mode);
    setPanelSearch('');
    loadPanelData(ca.MaChamCong, mode);
  };
  const [formError, setFormError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editId !== null) {
      await updateChamCong(editId, { CaLamViec: formCa });
    } else {
      await createChamCong({ CaLamViec: formCa, ThoiGian: todayISO() });
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
      if (panelCa?.MaChamCong === id) {
        setPanelCa(null);
        setPanelMode(null);
      }
      loadData();
    }
  };

  const openDetail = (ca: ChamCong) => {
    setSelectedCa(ca);
    setViewMode('detail');
    loadChiTiet(ca.MaChamCong);
  };

  const handleChamVao = async (maNV: string) => {
    const gioVao = new Date().toTimeString().split(' ')[0];
    if (!selectedCa) return;
    await chamVao({ maNV, maChamCong: selectedCa.MaChamCong, gioVao });
    loadChiTiet(selectedCa.MaChamCong);
  };

  const handleChamRa = async (MaChiTiet: string) => {
    const gioRa = new Date().toTimeString().split(' ')[0];
    if (!selectedCa) return;
    await chamRa({ MaChiTiet, gioRa });
    loadChiTiet(selectedCa.MaChamCong);
  };

  const handlePanelChamVao = async (maNV: string) => {
    if (!panelCa) return;
    const gioVao = new Date().toTimeString().split(' ')[0];
    await chamVao({ maNV, maChamCong: panelCa.MaChamCong, gioVao });
    loadPanelData(panelCa.MaChamCong, 'chamVao');
  };

  const handlePanelChamRa = async (MaChiTiet: string) => {
    if (!panelCa) return;
    const gioRa = new Date().toTimeString().split(' ')[0];
    await chamRa({ MaChiTiet, gioRa });
    loadPanelData(panelCa.MaChamCong, 'chamRa');
  };

  const filtered = data.filter(
    (c) =>
      String(c.MaChamCong).includes(search) ||
      c.CaLamViec?.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredPanel = panelData.filter((nv) => {
    const q = panelSearch.toLowerCase();
    return (
      nv.MaNV?.toLowerCase().includes(q) ||
      (nv.HoTen ?? '').toLowerCase().includes(q)
    );
  });

  const panelFiltered =
    panelMode === 'chamVao'
      ? filteredPanel.filter((nv) => !nv.GioVao)
      : panelMode === 'chamRa'
        ? filteredPanel.filter((nv) => nv.GioVao && !nv.GioRa)
        : filteredPanel;

  const daCham = chiTiet.filter((nv) => nv.GioVao);
  const chuaCham = chiTiet.filter((nv) => !nv.GioVao);

  const panelTitle =
    panelMode === 'chamVao'
      ? 'Chấm vào'
      : panelMode === 'chamRa'
        ? 'Chấm ra'
        : 'Lịch sử chấm công';

  const panelAccent =
    panelMode === 'chamVao'
      ? '#1565c0'
      : panelMode === 'chamRa'
        ? '#e53935'
        : '#6d4c41';

  // ========================= VIEW: CHI TIẾT CA =========================
  if (viewMode === 'detail' && selectedCa) {
    const caIsToday = isToday(selectedCa.ThoiGian);

    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setViewMode('list')}>
          <ArrowLeft size={16} /> Quay lại
        </button>

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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                }}
              >
                <div style={s.infoValue}>{selectedCa.ThoiGian}</div>
                {caIsToday ? (
                  <span
                    style={{
                      ...s.chip,
                      background: '#e3f2fd',
                      color: '#1565c0',
                      fontSize: '12px',
                      padding: '2px 10px',
                    }}
                  >
                    Hôm nay
                  </span>
                ) : (
                  <span
                    style={{
                      ...s.chip,
                      background: '#f5f5f5',
                      color: '#9e9e9e',
                      fontSize: '12px',
                      padding: '2px 10px',
                    }}
                  >
                    Chỉ xem lịch sử
                  </span>
                )}
              </div>
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

        <div style={s.card}>
          <h2 style={s.cardTitle}>Danh sách nhân viên</h2>
          {!caIsToday && (
            <div style={s.readonlyNotice}>
              <History size={14} /> Ca này không phải hôm nay — chỉ hiển thị
              lịch sử, không thể chấm công.
            </div>
          )}
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
                    'Mã CT',
                    'Mã NV',
                    'Tên NV',
                    'Trạng thái',
                    'Giờ vào',
                    'Giờ ra',
                    ...(caIsToday ? ['Hành động'] : []),
                  ].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chiTiet.map((nv) => {
                  const daNhanVao = !!nv.GioVao;
                  const daNhanRa = !!nv.GioRa;
                  return (
                    <tr key={`${nv.MaNV}-${nv.MaChiTiet}`} style={s.tr}>
                      <td
                        style={{ ...s.td, color: '#9aa3b5', fontSize: '13px' }}
                      >
                        {nv.MaChiTiet ?? '-'}
                      </td>
                      <td style={s.td}>{nv.MaNV}</td>
                      <td style={{ ...s.td, fontWeight: 500 }}>
                        {nv.HoTen ?? nv.MaNV}
                      </td>
                      <td style={s.td}>
                        {daNhanVao ? (
                          <span style={s.badgeGreen}>● Đã chấm</span>
                        ) : (
                          <span style={s.badgeRed}>● Chưa chấm</span>
                        )}
                      </td>
                      <td style={s.td}>{nv.GioVao ?? '-'}</td>
                      <td style={s.td}>{nv.GioRa ?? '-'}</td>
                      {caIsToday && (
                        <td style={s.td}>
                          {daNhanVao && daNhanRa ? (
                            <span style={s.actionDone}>Hoàn thành</span>
                          ) : daNhanVao && !daNhanRa ? (
                            <button
                              style={s.btnChamRa}
                              onClick={() => handleChamRa(String(nv.MaChiTiet))}
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
                      )}
                    </tr>
                  );
                })}
                {chiTiet.length === 0 && (
                  <tr>
                    <td
                      colSpan={caIsToday ? 7 : 6}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap' as const,
          }}
        >
          <h1 style={s.pageTitle}>
            {listMode === 'today'
              ? 'Ca chấm công hôm nay'
              : 'Tất cả ca chấm công'}
          </h1>
          {listMode === 'today' && (
            <span
              style={{
                ...s.chip,
                background: '#e3f2fd',
                color: '#1565c0',
                fontSize: '12px',
              }}
            >
              <CalendarDays size={12} /> {todayISO()}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap' as const,
          }}
        >
          <button
            style={{
              ...s.btnToggle,
              background: listMode === 'today' ? '#1565c0' : '#fff',
              color: listMode === 'today' ? '#fff' : '#1565c0',
              border: '1.5px solid #1565c0',
            }}
            onClick={() => switchListMode('today')}
          >
            <CalendarDays size={14} /> Hôm nay
          </button>
          <button
            style={{
              ...s.btnToggle,
              background: listMode === 'all' ? '#1565c0' : '#fff',
              color: listMode === 'all' ? '#fff' : '#1565c0',
              border: '1.5px solid #1565c0',
            }}
            onClick={() => switchListMode('all')}
          >
            <List size={14} /> Tất cả
          </button>
          <button style={s.btnPrimary} onClick={openCreate}>
            <Plus size={16} /> Tạo ca mới
          </button>
        </div>
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
              {[
                'Mã CC',
                'Ca làm việc',
                'Thời gian',
                'Chấm công',
                'Hành động',
              ].map((h) => (
                <th key={h} style={s.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    ...s.td,
                    textAlign: 'center',
                    color: '#aaa',
                    padding: '40px',
                  }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : (
              <>
                {filtered.map((ca) => {
                  const caIsToday = isToday(ca.ThoiGian);
                  return (
                    <>
                      <tr
                        key={ca.MaChamCong}
                        style={{
                          ...s.tr,
                          cursor: 'pointer',
                          background:
                            panelCa?.MaChamCong === ca.MaChamCong
                              ? '#f0f4ff'
                              : undefined,
                        }}
                        onClick={() => openDetail(ca)}
                      >
                        <td style={s.td}>{ca.MaChamCong}</td>
                        <td style={{ ...s.td, fontWeight: 500 }}>
                          {ca.CaLamViec}
                        </td>
                        <td style={s.td}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                            }}
                          >
                            <span style={{ color: '#888' }}>{ca.ThoiGian}</span>
                            {caIsToday ? (
                              <span style={s.badgeToday}>Hôm nay</span>
                            ) : (
                              <span style={s.badgePast}>Quá khứ</span>
                            )}
                          </div>
                        </td>

                        {/* Cột chấm công — chỉ hiện Chấm vào/Chấm ra nếu là hôm nay */}
                        <td style={s.td} onClick={(e) => e.stopPropagation()}>
                          <div style={s.actionBtns}>
                            {caIsToday && (
                              <>
                                <button
                                  style={{
                                    ...s.chamBtn,
                                    background:
                                      panelCa?.MaChamCong === ca.MaChamCong &&
                                      panelMode === 'chamVao'
                                        ? '#1565c0'
                                        : '#e3edf9',
                                    color:
                                      panelCa?.MaChamCong === ca.MaChamCong &&
                                      panelMode === 'chamVao'
                                        ? '#fff'
                                        : '#1565c0',
                                  }}
                                  onClick={(e) => openPanel(ca, 'chamVao', e)}
                                >
                                  <UserCheck size={14} /> Chấm vào
                                </button>
                                <button
                                  style={{
                                    ...s.chamBtn,
                                    background:
                                      panelCa?.MaChamCong === ca.MaChamCong &&
                                      panelMode === 'chamRa'
                                        ? '#e53935'
                                        : '#fdecea',
                                    color:
                                      panelCa?.MaChamCong === ca.MaChamCong &&
                                      panelMode === 'chamRa'
                                        ? '#fff'
                                        : '#e53935',
                                  }}
                                  onClick={(e) => openPanel(ca, 'chamRa', e)}
                                >
                                  <LogOut size={14} /> Chấm ra
                                </button>
                              </>
                            )}
                            {/* Lịch sử luôn hiển thị */}
                            <button
                              style={{
                                ...s.chamBtn,
                                background:
                                  panelCa?.MaChamCong === ca.MaChamCong &&
                                  panelMode === 'lichSu'
                                    ? '#5d4037'
                                    : '#f3ece8',
                                color:
                                  panelCa?.MaChamCong === ca.MaChamCong &&
                                  panelMode === 'lichSu'
                                    ? '#fff'
                                    : '#6d4c41',
                              }}
                              onClick={(e) => openPanel(ca, 'lichSu', e)}
                            >
                              <History size={14} /> Lịch sử
                            </button>
                          </div>
                        </td>

                        <td style={s.td} onClick={(e) => e.stopPropagation()}>
                          <button
                            style={s.iconBtn}
                            onClick={(e) => openEdit(ca, e)}
                          >
                            <Pencil size={16} color="#1976d2" />
                          </button>
                          <button
                            style={s.iconBtn}
                            onClick={(e) => handleDelete(ca.MaChamCong, e)}
                          >
                            <Trash2 size={16} color="#d32f2f" />
                          </button>
                        </td>
                      </tr>

                      {/* Panel inline */}
                      {panelCa?.MaChamCong === ca.MaChamCong && panelMode && (
                        <tr key={`panel-${ca.MaChamCong}`}>
                          <td
                            colSpan={5}
                            style={{ padding: 0, background: '#f8faff' }}
                          >
                            <div
                              style={{
                                ...s.panel,
                                borderTop: `3px solid ${panelAccent}`,
                              }}
                            >
                              <div style={s.panelHeader}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    flexWrap: 'wrap' as const,
                                  }}
                                >
                                  <span
                                    style={{
                                      ...s.panelTitle,
                                      color: panelAccent,
                                    }}
                                  >
                                    {panelTitle}
                                  </span>
                                  <span style={s.panelSubtitle}>
                                    — {ca.CaLamViec} · {ca.ThoiGian}
                                  </span>
                                  {!caIsToday && panelMode !== 'lichSu' && (
                                    <span style={s.badgePast}>Chỉ xem</span>
                                  )}
                                </div>
                                <button
                                  style={s.closePanel}
                                  onClick={() => {
                                    setPanelCa(null);
                                    setPanelMode(null);
                                    setPanelSearch('');
                                  }}
                                >
                                  ✕
                                </button>
                              </div>

                              <div style={s.panelSearchWrap}>
                                <Search
                                  size={14}
                                  color="#9aa3b5"
                                  style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                  }}
                                />
                                <input
                                  style={s.panelSearchInput}
                                  placeholder="Tìm theo mã hoặc tên nhân viên..."
                                  value={panelSearch}
                                  onChange={(e) =>
                                    setPanelSearch(e.target.value)
                                  }
                                />
                              </div>

                              <div style={s.panelScrollArea}>
                                {panelLoading ? (
                                  <div
                                    style={{
                                      padding: '24px',
                                      textAlign: 'center',
                                      color: '#aaa',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Đang tải dữ liệu...
                                  </div>
                                ) : (
                                  <table
                                    style={{ ...s.table, marginTop: '12px' }}
                                  >
                                    <thead>
                                      <tr style={s.thead}>
                                        {panelMode === 'lichSu'
                                          ? [
                                              'Mã CT',
                                              'Mã NV',
                                              'Tên NV',
                                              'Trạng thái',
                                              'Giờ vào',
                                              'Giờ ra',
                                            ].map((h) => (
                                              <th key={h} style={s.th}>
                                                {h}
                                              </th>
                                            ))
                                          : [
                                              'Mã CT',
                                              'Mã NV',
                                              'Tên NV',
                                              'Giờ vào',
                                              'Giờ ra',
                                              'Thao tác',
                                            ].map((h) => (
                                              <th key={h} style={s.th}>
                                                {h}
                                              </th>
                                            ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {panelFiltered.map((nv) => (
                                        <tr
                                          key={`panel-nv-${nv.MaNV}-${nv.MaChiTiet}`}
                                          style={s.tr}
                                        >
                                          <td
                                            style={{
                                              ...s.td,
                                              color: '#9aa3b5',
                                              fontSize: '13px',
                                            }}
                                          >
                                            {nv.MaChiTiet ?? '-'}
                                          </td>
                                          <td style={s.td}>{nv.MaNV}</td>
                                          <td
                                            style={{ ...s.td, fontWeight: 500 }}
                                          >
                                            {nv.HoTen ?? nv.MaNV}
                                          </td>
                                          {panelMode === 'lichSu' ? (
                                            <>
                                              <td style={s.td}>
                                                {nv.GioVao && nv.GioRa ? (
                                                  <span style={s.badgeGreen}>
                                                    ● Hoàn thành
                                                  </span>
                                                ) : nv.GioVao ? (
                                                  <span
                                                    style={{
                                                      ...s.badgeGreen,
                                                      background: '#fff8e1',
                                                      color: '#f57f17',
                                                    }}
                                                  >
                                                    ● Đang làm
                                                  </span>
                                                ) : (
                                                  <span style={s.badgeRed}>
                                                    ● Vắng
                                                  </span>
                                                )}
                                              </td>
                                              <td style={s.td}>
                                                {nv.GioVao ?? '-'}
                                              </td>
                                              <td style={s.td}>
                                                {nv.GioRa ?? '-'}
                                              </td>
                                            </>
                                          ) : panelMode === 'chamVao' ? (
                                            <>
                                              <td style={s.td}>
                                                {nv.GioVao ?? '-'}
                                              </td>
                                              <td style={s.td}>
                                                {nv.GioRa ?? '-'}
                                              </td>
                                              <td style={s.td}>
                                                <button
                                                  style={s.btnChamCong}
                                                  onClick={() =>
                                                    handlePanelChamVao(nv.MaNV)
                                                  }
                                                >
                                                  <UserCheck size={13} /> Chấm
                                                  vào
                                                </button>
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              <td style={s.td}>
                                                {nv.GioVao ?? '-'}
                                              </td>
                                              <td style={s.td}>
                                                {nv.GioRa ?? '-'}
                                              </td>
                                              <td style={s.td}>
                                                <button
                                                  style={s.btnChamRa}
                                                  onClick={() =>
                                                    handlePanelChamRa(
                                                      String(nv.MaChiTiet),
                                                    )
                                                  }
                                                >
                                                  <LogOut size={13} /> Chấm ra
                                                </button>
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      ))}
                                      {panelFiltered.length === 0 && (
                                        <tr>
                                          <td
                                            colSpan={6}
                                            style={{
                                              ...s.td,
                                              textAlign: 'center',
                                              color: '#bbb',
                                              padding: '24px',
                                            }}
                                          >
                                            {panelSearch
                                              ? 'Không tìm thấy nhân viên phù hợp'
                                              : panelMode === 'chamVao'
                                                ? 'Tất cả nhân viên đã chấm vào'
                                                : panelMode === 'chamRa'
                                                  ? 'Không có nhân viên cần chấm ra'
                                                  : 'Không có dữ liệu'}
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
                {filtered.length === 0 && !loadingList && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        ...s.td,
                        textAlign: 'center',
                        color: '#bbb',
                        padding: '40px',
                      }}
                    >
                      {listMode === 'today'
                        ? 'Không có ca chấm công nào hôm nay'
                        : 'Không có dữ liệu'}
                    </td>
                  </tr>
                )}
              </>
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
    flexWrap: 'wrap' as const,
    gap: '10px',
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
    marginBottom: '16px',
  },
  readonlyNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: '#fff8e1',
    color: '#f57f17',
    border: '1px solid #ffe082',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: '16px',
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
  badgeToday: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  badgePast: {
    background: '#f5f5f5',
    color: '#9e9e9e',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
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
  btnToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
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
  actionBtns: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  chamBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  },
  panel: {
    padding: '20px 24px 0',
    background: '#f8faff',
    borderRadius: '0 0 10px 10px',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
  },
  panelScrollArea: {
    maxHeight: '320px',
    overflowY: 'auto' as const,
    paddingBottom: '16px',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  panelTitle: { fontSize: '15px', fontWeight: 700 },
  panelSubtitle: { fontSize: '13px', color: '#9aa3b5' },
  closePanel: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#9aa3b5',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  panelSearchWrap: {
    position: 'relative' as const,
    maxWidth: '340px',
    marginBottom: '4px',
  },
  panelSearchInput: {
    width: '100%',
    padding: '8px 12px 8px 32px',
    borderRadius: '8px',
    border: '1px solid #dde3ee',
    fontSize: '13px',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
};
