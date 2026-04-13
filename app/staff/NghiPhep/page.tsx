'use client';

import {
  useEffect,
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import { Plus, Pencil, X, MessageSquare } from 'lucide-react';
// Import file CSS của bạn
import '../../../public/stylesheets/admin.css';

import {
  getAllNghiPhep,
  createNghiPhep,
  updateNghiPhep,
  deleteNghiPhep,
  NghiPhep,
  getNghiPhepById,
} from '@/service/NghiPhep.api';

const TOTAL_DAYS: number = 12;

interface StatusColorConfig {
  color: string;
  fontWeight: string;
}

interface UserData {
  MaNV: string;
  [key: string]: any;
}

interface FormState extends NghiPhep {
  MaNghiPhep: number;
  MaNV: string;
  NgayBatDau: string;
  NgayKetThuc: string;
  LyDo: string;
  TrangThai: 'Dang cho duyet' | 'Da duyet' | 'Tu choi';
  NgayTao: string;
  LyDoTuChoi?: string;
}

type TrangThaiType = 'Dang cho duyet' | 'Da duyet' | 'Tu choi' | 'All';

const getStatusStyle = (status: string): StatusColorConfig => {
  switch (status) {
    case 'Dang cho duyet':
      return { color: '#eab308', fontWeight: 'bold' };
    case 'Da duyet':
      return { color: '#22c55e', fontWeight: 'bold' };
    case 'Tu choi':
      return { color: '#ef4444', fontWeight: 'bold' };
    default:
      return { color: '#1e293b', fontWeight: 'normal' };
  }
};

const calculateRemainingDays = (
  data: NghiPhep[],
  currentUserMaNV: string,
): number => {
  const approvedLeaves: NghiPhep[] = data.filter(
    (item) => item.MaNV === currentUserMaNV && item.TrangThai === 'Da duyet',
  );

  const usedDays: number = approvedLeaves.reduce(
    (total: number, leave: NghiPhep) => {
      const start: Date = new Date(leave.NgayBatDau);
      const end: Date = new Date(leave.NgayKetThuc);
      const days: number =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
        1;
      return total + days;
    },
    0,
  );

  return Math.max(0, TOTAL_DAYS - usedDays);
};

const NghiPhepPage: FC = () => {
  const [data, setData] = useState<NghiPhep[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TrangThaiType>('All');

  // State quản lý Form thêm/sửa
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // State quản lý xem lý do từ chối
  const [showReasonModal, setShowReasonModal] = useState<boolean>(false);
  const [viewReason, setViewReason] = useState<string>('');

  const [currentUserMaNV, setCurrentUserMaNV] = useState<string>('');

  const [form, setForm] = useState<FormState>({
    MaNghiPhep: 0,
    MaNV: '',
    NgayBatDau: '',
    NgayKetThuc: '',
    LyDo: '',
    TrangThai: 'Dang cho duyet',
    NgayTao: '',
  });

  // Load data
  const loadData = async (): Promise<void> => {
    const user: UserData = JSON.parse(localStorage.getItem('user') || '{}');
    const maNV: string = user.MaNV || '';
    try {
      const result: NghiPhep[] = await getNghiPhepById(maNV);
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    const user: UserData = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserMaNV(user.MaNV || '');
    loadData();
  }, []);

  // Input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!form.NgayBatDau || !form.NgayKetThuc) {
      alert('Vui lòng chọn ngày!');
      return;
    }

    if (form.NgayBatDau > form.NgayKetThuc) {
      alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!');
      return;
    }

    try {
      if (isEdit) {
        await updateNghiPhep(form.MaNghiPhep, form);
      } else {
        const user: UserData = JSON.parse(localStorage.getItem('user') || '{}');
        const maNV: string = user.MaNV || '';
        const newData: Partial<NghiPhep> = {
          ...form,
          MaNV: maNV,
        };
        await createNghiPhep(newData as NghiPhep);
      }

      setShowForm(false);
      setIsEdit(false);

      setForm({
        MaNghiPhep: 0,
        MaNV: '',
        NgayBatDau: '',
        NgayKetThuc: '',
        LyDo: '',
        TrangThai: 'Dang cho duyet',
        NgayTao: '',
      });

      await loadData();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Edit
  const handleEdit = (nv: NghiPhep): void => {
    setForm(nv as FormState);
    setIsEdit(true);
    setShowForm(true);
  };

  // Cancel leave request
  const handleCancel = async (id: number): Promise<void> => {
    if (confirm('Bạn có chắc muốn hủy yêu cầu nghỉ phép này?')) {
      try {
        await deleteNghiPhep(id);
        await loadData();
      } catch (error) {
        console.error('Error cancelling:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  };

  // Xem lý do từ chối
  const handleViewReason = (reason?: string): void => {
    setViewReason(reason || 'Không có lý do cụ thể được cung cấp.');
    setShowReasonModal(true);
  };

  // Search and filter
  const filtered: NghiPhep[] = data.filter((nv) => {
    const matchesSearch: boolean =
      nv.MaNghiPhep?.toString().includes(search) ||
      nv.MaNV?.toLowerCase().includes(search.toLowerCase()) ||
      nv.LyDo?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus: boolean =
      statusFilter === 'All' || nv.TrangThai === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const remainingDays: number = calculateRemainingDays(data, currentUserMaNV);
  const statuses: TrangThaiType[] = [
    'All',
    'Dang cho duyet',
    'Da duyet',
    'Tu choi',
  ];

  const handleOpenNewForm = (): void => {
    setIsEdit(false);
    setShowForm(true);
    setForm({
      MaNghiPhep: 0,
      MaNV: '',
      NgayBatDau: '',
      NgayKetThuc: '',
      LyDo: '',
      TrangThai: 'Dang cho duyet',
      NgayTao: '',
    });
  };

  const handleCloseModal = (): void => {
    setShowForm(false);
  };

  const handleModalOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
      setShowReasonModal(false);
    }
  };

  const getStatusLabel = (status: TrangThaiType): string => {
    switch (status) {
      case 'All':
        return 'Tất cả';
      case 'Dang cho duyet':
        return 'Đang chờ duyệt';
      case 'Da duyet':
        return 'Đã duyệt';
      case 'Tu choi':
        return 'Từ chối';
      default:
        return status;
    }
  };

  return (
    <div className="content">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Quản lý nghỉ phép</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
            Quản lý và theo dõi các yêu cầu nghỉ phép của bạn
          </p>
        </div>
        <div
          style={{
            background: '#f8fafc',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            Số phép còn lại
          </p>
          <h3 style={{ margin: 0, color: '#3b82f6' }}>
            {remainingDays}/{TOTAL_DAYS}
          </h3>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          alignItems: 'center',
        }}
      >
        <input
          className="search"
          placeholder="Tìm kiếm theo mã, nhân viên hoặc lý do..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn-add"
          onClick={handleOpenNewForm}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            margin: 0,
          }}
        >
          <Plus size={16} /> Tạo yêu cầu mới
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: statusFilter === status ? '#3b82f6' : '#f1f5f9',
              color: statusFilter === status ? 'white' : '#475569',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {getStatusLabel(status)}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã phép</th>
              <th>Nhân viên</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filtered.map((nv) => (
                <tr key={nv.MaNghiPhep}>
                  <td style={{ fontWeight: 'bold' }}>#{nv.MaNghiPhep}</td>
                  <td>{nv.MaNV}</td>
                  <td>{nv.NgayBatDau}</td>
                  <td>{nv.NgayKetThuc}</td>
                  <td
                    style={{
                      maxWidth: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={nv.LyDo}
                  >
                    {nv.LyDo}
                  </td>
                  <td style={getStatusStyle(nv.TrangThai)}>
                    {getStatusLabel(nv.TrangThai)}
                  </td>
                  <td>{nv.NgayTao}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      {/* Đang chờ duyệt -> Hiện nút Sửa và Hủy */}
                      {nv.TrangThai === 'Dang cho duyet' ? (
                        <>
                          <button
                            onClick={() => handleEdit(nv)}
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              padding: '4px 8px',
                            }}
                            title="Chỉnh sửa"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => handleCancel(nv.MaNghiPhep)}
                            className="btn-close"
                            style={{ padding: '4px 8px' }}
                            title="Hủy yêu cầu"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : nv.TrangThai === 'Tu choi' ? (
                        /* Bị từ chối -> Hiện nút Xem lý do */
                        <button
                          onClick={() =>
                            handleViewReason((nv as any).LyDoTuChoi)
                          }
                          style={{
                            background: '#64748b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                          }}
                          title="Xem lý do từ chối"
                        >
                          <MessageSquare size={14} />
                        </button>
                      ) : (
                        /* Đã duyệt -> Ẩn thao tác */
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                          -
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal (Tạo / Sửa) */}
      {showForm && (
        <div className="modal-overlay" onClick={handleModalOverlayClick}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="modal"
          >
            <h2>
              {isEdit ? 'Chỉnh sửa yêu cầu nghỉ phép' : 'Tạo yêu cầu nghỉ phép'}
            </h2>

            <div className="form-group">
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="NgayBatDau"
                value={form.NgayBatDau}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="NgayKetThuc"
                value={form.NgayKetThuc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Lý do</label>
              <input
                type="text"
                name="LyDo"
                value={form.LyDo}
                onChange={handleChange}
                placeholder="Nhập lý do nghỉ phép..."
                required
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-close"
              >
                Hủy
              </button>
              <button type="submit" className="btn-add" style={{ margin: 0 }}>
                {isEdit ? 'Cập nhật' : 'Tạo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reason Modal (Xem lý do từ chối) */}
      {showReasonModal && (
        <div className="modal-overlay" onClick={handleModalOverlayClick}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '400px' }}
          >
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Lý do từ chối</h3>
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                padding: '12px',
                borderRadius: '6px',
                color: '#991b1b',
                marginTop: '15px',
                lineHeight: '1.5',
              }}
            >
              {viewReason}
            </div>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowReasonModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NghiPhepPage;
