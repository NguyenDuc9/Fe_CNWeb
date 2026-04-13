'use client';

import { useState, FC, useEffect } from 'react';
import { Eye, Check, X, MessageSquare } from 'lucide-react';
import {
  Leave,
  getAllNghiPhep,
  updateNghiPhep,
  getNghiPhepById,
} from '@/service/NghiPhep.api';
import '../../../public/stylesheets/admin.css';
import '../../../public/stylesheets/header.css';

type FilterStatus = 'All' | 'Dang cho duyet' | 'Da duyet' | 'Tu choi';

interface StatusStyle {
  color: string;
  fontWeight: string;
}

const NGHIPHEP_MACDINH = 12;

const ApprovalManager: FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  // State quản lý Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  // State lưu số ngày đã nghỉ của nhân viên đang xem
  const [soNgayDaNghi, setSoNgayDaNghi] = useState<number>(0);

  // Fetch dữ liệu khi load component
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getAllNghiPhep();
      setLeaves(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nghỉ phép:', error);
    }
  };

  const getStatusStyle = (status: string): StatusStyle => {
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

  const getStatusLabel = (status: FilterStatus | string): string => {
    const labels: Record<string, string> = {
      All: 'Tất cả',
      'Dang cho duyet': 'Đang chờ duyệt',
      'Da duyet': 'Đã duyệt',
      'Tu choi': 'Từ chối',
    };
    return labels[status] || status;
  };

  const filtered: Leave[] = leaves.filter((leave: Leave) => {
    return statusFilter === 'All' || leave.TrangThai === statusFilter;
  });

  const handleViewDetail = async (leave: Leave) => {
    setSelectedLeave(leave);
    setShowDetailModal(true);
    setSoNgayDaNghi(0); // Reset state khi mở modal mới

    try {
      // Gọi API lấy lịch sử nghỉ phép của nhân viên này (giả sử dùng MaNV)
      const leaveHistory = await getNghiPhepById(leave.MaNV);

      // Giả định API trả về 1 mảng các record nghỉ phép của nhân viên đó.
      // Ta đếm tổng số ngày của các đơn có trạng thái 'Da duyet'
      let totalDuyet = 0;
      if (Array.isArray(leaveHistory)) {
        totalDuyet = leaveHistory.reduce((acc, curr) => {
          return curr.TrangThai === 'Da duyet' ? acc + curr.SoNgay : acc;
        }, 0);
      } else {
        // Nếu API trả về object tổng sẵn (vd: { totalApproved: 5 }) thì gán thẳng vào đây
        // totalDuyet = leaveHistory.totalApproved;
      }

      setSoNgayDaNghi(totalDuyet);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết nghỉ phép nhân viên:', error);
    }
  };

  const handleApprove = async (leaveId: number) => {
    if (confirm('Bạn có chắc muốn duyệt yêu cầu này?')) {
      try {
        await updateNghiPhep(leaveId, { TrangThai: 'Da duyet' });

        // Cập nhật state local để UI react ngay lập tức
        setLeaves((prev: Leave[]) =>
          prev.map((item: Leave) =>
            item.MaNghiPhep === leaveId
              ? { ...item, TrangThai: 'Da duyet' as const }
              : item,
          ),
        );
        setShowDetailModal(false);
      } catch (error) {
        alert('Có lỗi xảy ra khi duyệt yêu cầu!');
        console.error(error);
      }
    }
  };

  const handleRejectClick = (leave: Leave): void => {
    setSelectedLeave(leave);
    setRejectReason('');
    setShowRejectModal(true);
    setShowDetailModal(false);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (selectedLeave) {
      try {
        await updateNghiPhep(selectedLeave.MaNghiPhep, {
          TrangThai: 'Tu choi',
          LyDoTuChoi: rejectReason,
        });

        // Cập nhật state local
        setLeaves((prev: Leave[]) =>
          prev.map((item: Leave) =>
            item.MaNghiPhep === selectedLeave.MaNghiPhep
              ? {
                  ...item,
                  TrangThai: 'Tu choi' as const,
                  LyDoTuChoi: rejectReason,
                }
              : item,
          ),
        );
        setShowRejectModal(false);
        setSelectedLeave(null);
      } catch (error) {
        alert('Có lỗi xảy ra khi từ chối yêu cầu!');
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="content">
        <div className="header-section">
          <div>
            <h2>Quản lý duyệt nghỉ phép</h2>
            <p>Xem xét và duyệt/từ chối các yêu cầu nghỉ phép từ nhân viên</p>
          </div>
        </div>

        <div className="filter-buttons">
          {(
            ['All', 'Dang cho duyet', 'Da duyet', 'Tu choi'] as FilterStatus[]
          ).map((status: FilterStatus) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>

        <div className="table-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>Không có yêu cầu nào</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã phép</th>
                  <th>Nhân viên</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Số ngày</th>
                  <th>Lý do</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((leave: Leave) => (
                  <tr key={leave.MaNghiPhep}>
                    <td style={{ fontWeight: 'bold' }}>#{leave.MaNghiPhep}</td>
                    <td>
                      <div>{leave.HoTen}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {leave.MaNV}
                      </div>
                    </td>
                    <td>{leave.NgayBatDau}</td>
                    <td>{leave.NgayKetThuc}</td>
                    <td>{leave.SoNgay} ngày</td>
                    <td
                      style={{
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={leave.LyDo}
                    >
                      {leave.LyDo}
                    </td>
                    <td style={getStatusStyle(leave.TrangThai)}>
                      {getStatusLabel(leave.TrangThai)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {leave.TrangThai === 'Dang cho duyet' && (
                          <button
                            className="action-btn btn-view"
                            onClick={() => handleViewDetail(leave)}
                            title="Xem chi tiết"
                          >
                            <Eye size={14} /> Xem
                          </button>
                        )}
                        {leave.TrangThai === 'Da duyet' && (
                          <button
                            className="action-btn btn-view"
                            onClick={() => handleViewDetail(leave)}
                            title="Xem chi tiết"
                          >
                            <Eye size={14} /> Xem
                          </button>
                        )}
                        {leave.TrangThai === 'Tu choi' && (
                          <button
                            className="action-btn btn-view"
                            onClick={() => handleViewDetail(leave)}
                            title="Xem lý do từ chối"
                          >
                            <MessageSquare size={14} /> Lý do
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* DETAIL MODAL */}
        {showDetailModal && selectedLeave && (
          <div
            className="modal-overlay"
            onClick={() => setShowDetailModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>
                {selectedLeave.TrangThai === 'Tu choi'
                  ? 'Chi tiết yêu cầu (Từ chối)'
                  : 'Chi tiết yêu cầu nghỉ phép'}
              </h2>

              <div className="modal-content">
                <div className="info-row">
                  <span className="info-label">Mã yêu cầu:</span>
                  <span className="info-value">
                    #{selectedLeave.MaNghiPhep}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nhân viên:</span>
                  <span className="info-value">
                    {selectedLeave.HoTen} ({selectedLeave.MaNV})
                  </span>
                </div>

                {/* Dòng mới thêm: Hiển thị số phép đã dùng */}
                <div
                  className="info-row"
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: '6px',
                    margin: '8px 0',
                  }}
                >
                  <span className="info-label" style={{ color: '#0f172a' }}>
                    Tình trạng quỹ phép:
                  </span>
                  <span className="info-value">
                    <strong
                      style={{
                        color:
                          soNgayDaNghi + selectedLeave.SoNgay > NGHIPHEP_MACDINH
                            ? '#ef4444'
                            : '#22c55e',
                      }}
                    >
                      Đã duyệt {soNgayDaNghi} / {NGHIPHEP_MACDINH} ngày
                    </strong>
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Ngày bắt đầu:</span>
                  <span className="info-value">{selectedLeave.NgayBatDau}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày kết thúc:</span>
                  <span className="info-value">
                    {selectedLeave.NgayKetThuc}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số ngày:</span>
                  <span className="info-value">
                    {selectedLeave.SoNgay} ngày
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lý do:</span>
                  <span className="info-value">{selectedLeave.LyDo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày tạo:</span>
                  <span className="info-value">{selectedLeave.NgayTao}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Trạng thái:</span>
                  <span
                    className="info-value"
                    style={getStatusStyle(selectedLeave.TrangThai)}
                  >
                    {getStatusLabel(selectedLeave.TrangThai)}
                  </span>
                </div>

                {selectedLeave.TrangThai === 'Tu choi' &&
                  selectedLeave.LyDoTuChoi && (
                    <div className="info-row">
                      <span className="info-label">Lý do từ chối:</span>
                      <span
                        className="info-value"
                        style={{ color: '#ef4444', fontWeight: '500' }}
                      >
                        {selectedLeave.LyDoTuChoi}
                      </span>
                    </div>
                  )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
                {selectedLeave.TrangThai === 'Dang cho duyet' && (
                  <>
                    <button
                      className="action-btn btn-approve"
                      onClick={() => handleApprove(selectedLeave.MaNghiPhep)}
                    >
                      <Check size={14} /> Duyệt
                    </button>
                    <button
                      className="action-btn btn-reject"
                      onClick={() => handleRejectClick(selectedLeave)}
                    >
                      <X size={14} /> Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REJECT MODAL */}
        {showRejectModal && selectedLeave && (
          <div
            className="modal-overlay"
            onClick={() => setShowRejectModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Từ chối yêu cầu nghỉ phép</h2>

              <div className="modal-content">
                <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
                  Bạn đang từ chối yêu cầu của{' '}
                  <strong>{selectedLeave.HoTen}</strong> vào ngày{' '}
                  <strong>{selectedLeave.NgayBatDau}</strong>
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginTop: '8px',
                  }}
                >
                  Quỹ phép hiện tại: {soNgayDaNghi}/{NGHIPHEP_MACDINH} ngày.
                </p>
              </div>

              <div className="form-group">
                <label>Lý do từ chối</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối yêu cầu này..."
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowRejectModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn-submit"
                  style={{ background: '#ef4444' }}
                  onClick={handleConfirmReject}
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApprovalManager;
