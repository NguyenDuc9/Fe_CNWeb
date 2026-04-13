'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  X,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Loader,
} from 'lucide-react';
import { getAllNhanVien } from '@/service/NhanVien.api';
// ============= TYPES & INTERFACES =============
import { TinhLuong, ThemLuong } from '@/service/Luong.api';
interface Employee {
  MaNV: string;
  HoTen: string;
  NgaySinh?: string;
  GioiTinh?: string;
}

interface SalaryDetail {
  MaNV: string;
  HoTen: string;
  Thang: number;
  Nam: number;
  LuongCoBan: number;
  TienNgayCong: number;
  TongPhuCap: number;
  TienTangCa: number;
  TongThuong: number;
  TongPhat: number;
  BaoHiem: number;
  LuongThucNhan: number;
  SoNgayLam: number;
}

interface SalaryResponse {
  success: boolean;
  data: SalaryDetail[];
  message?: string;
}

interface AttendanceRecord {
  MaNV: string;
  Thang: number;
  Nam: number;
  SoNgayHopPhan: number;
  SoNgayNghi: number;
  SoGioTangCa: number;
}

// ============= MOCK API SERVICE =============

const mockAttendanceData: Record<string, Record<number, AttendanceRecord>> = {
  NV001: {
    3: {
      MaNV: 'NV001',
      Thang: 3,
      Nam: 2026,
      SoNgayHopPhan: 21,
      SoNgayNghi: 1,
      SoGioTangCa: 8,
    },
    4: {
      MaNV: 'NV001',
      Thang: 4,
      Nam: 2026,
      SoNgayHopPhan: 22,
      SoNgayNghi: 0,
      SoGioTangCa: 10,
    },
  },
  NV002: {
    3: {
      MaNV: 'NV002',
      Thang: 3,
      Nam: 2026,
      SoNgayHopPhan: 21,
      SoNgayNghi: 0,
      SoGioTangCa: 10,
    },
    4: {
      MaNV: 'NV002',
      Thang: 4,
      Nam: 2026,
      SoNgayHopPhan: 22,
      SoNgayNghi: 1,
      SoGioTangCa: 12,
    },
  },
};

const mockSalaryData: Record<string, Record<number, SalaryDetail>> = {
  NV001: {
    3: {
      MaNV: 'NV001',
      HoTen: 'Nguyễn Văn An',
      Thang: 3,
      Nam: 2026,
      LuongCoBan: 15000000,
      TienNgayCong: 0,
      TongPhuCap: 2333572,
      TienTangCa: 1414098,
      TongThuong: 1312894,
      TongPhat: 0,
      BaoHiem: -1350000,
      LuongThucNhan: 15825949,
      SoNgayHopPhan: 21,
    },
    4: {
      MaNV: 'NV001',
      HoTen: 'Nguyễn Văn An',
      Thang: 4,
      Nam: 2026,
      LuongCoBan: 15000000,
      TienNgayCong: 375000,
      TongPhuCap: 2100000,
      TienTangCa: 800000,
      TongThuong: 1500000,
      TongPhat: -500000,
      BaoHiem: -1350000,
      LuongThucNhan: 16925000,
      SoNgayHopPhan: 22,
    },
  },
  NV002: {
    3: {
      MaNV: 'NV002',
      HoTen: 'Trần Thị Bình',
      Thang: 3,
      Nam: 2026,
      LuongCoBan: 18000000,
      TienNgayCong: 0,
      TongPhuCap: 2800000,
      TienTangCa: 1600000,
      TongThuong: 1200000,
      TongPhat: 0,
      BaoHiem: -1620000,
      LuongThucNhan: 21980000,
      SoNgayHopPhan: 21,
    },
    4: {
      MaNV: 'NV002',
      HoTen: 'Trần Thị Bình',
      Thang: 4,
      Nam: 2026,
      LuongCoBan: 18000000,
      TienNgayCong: 450000,
      TongPhuCap: 2600000,
      TienTangCa: 900000,
      TongThuong: 1800000,
      TongPhat: -300000,
      BaoHiem: -1620000,
      LuongThucNhan: 21830000,
      SoNgayHopPhan: 22,
    },
  },
  NV003: {
    3: {
      MaNV: 'NV003',
      HoTen: 'Lê Hoàng Cường',
      Thang: 3,
      Nam: 2026,
      LuongCoBan: 22000000,
      TienNgayCong: 0,
      TongPhuCap: 3500000,
      TienTangCa: 2000000,
      TongThuong: 1500000,
      TongPhat: 0,
      BaoHiem: -1980000,
      LuongThucNhan: 27020000,
      SoNgayHopPhan: 21,
    },
    4: {
      MaNV: 'NV003',
      HoTen: 'Lê Hoàng Cường',
      Thang: 4,
      Nam: 2026,
      LuongCoBan: 22000000,
      TienNgayCong: 550000,
      TongPhuCap: 3300000,
      TienTangCa: 1100000,
      TongThuong: 2000000,
      TongPhat: -600000,
      BaoHiem: -1980000,
      LuongThucNhan: 26370000,
      SoNgayHopPhan: 22,
    },
  },
  NV004: {
    3: {
      MaNV: 'NV004',
      HoTen: 'Phạm Thị Dung',
      Thang: 3,
      Nam: 2026,
      LuongCoBan: 13000000,
      TienNgayCong: 0,
      TongPhuCap: 1900000,
      TienTangCa: 1000000,
      TongThuong: 900000,
      TongPhat: 0,
      BaoHiem: -1170000,
      LuongThucNhan: 15630000,
      SoNgayHopPhan: 21,
    },
    4: {
      MaNV: 'NV004',
      HoTen: 'Phạm Thị Dung',
      Thang: 4,
      Nam: 2026,
      LuongCoBan: 13000000,
      TienNgayCong: 325000,
      TongPhuCap: 1800000,
      TienTangCa: 700000,
      TongThuong: 1200000,
      TongPhat: -400000,
      BaoHiem: -1170000,
      LuongThucNhan: 15455000,
      SoNgayHopPhan: 22,
    },
  },
  NV005: {
    3: {
      MaNV: 'NV005',
      HoTen: 'Hoàng Minh Em',
      Thang: 3,
      Nam: 2026,
      LuongCoBan: 20000000,
      TienNgayCong: 0,
      TongPhuCap: 3000000,
      TienTangCa: 1800000,
      TongThuong: 1400000,
      TongPhat: 0,
      BaoHiem: -1800000,
      LuongThucNhan: 24400000,
      SoNgayHopPhan: 21,
    },
    4: {
      MaNV: 'NV005',
      HoTen: 'Hoàng Minh Em',
      Thang: 4,
      Nam: 2026,
      LuongCoBan: 20000000,
      TienNgayCong: 500000,
      TongPhuCap: 2900000,
      TienTangCa: 1050000,
      TongThuong: 1700000,
      TongPhat: -350000,
      BaoHiem: -1800000,
      LuongThucNhan: 24000000,
      SoNgayHopPhan: 22,
    },
  },
};

// Mock API Service
class PayrollAPIService {
  // Simulate network delay
  private delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async getEmployeeList(): Promise<Employee[]> {
    await this.delay(500);
    return [
      { id: 'NV001', name: 'Nguyễn Văn An', dob: '15/03/1990', gender: 'Nam' },
      { id: 'NV002', name: 'Trần Thị Bình', dob: '22/07/1992', gender: 'Nữ' },
      { id: 'NV003', name: 'Lê Hoàng Cường', dob: '10/11/1988', gender: 'Nam' },
      { id: 'NV004', name: 'Phạm Thị Dung', dob: '05/05/1995', gender: 'Nữ' },
      { id: 'NV005', name: 'Hoàng Minh Em', dob: '28/09/1991', gender: 'Nam' },
    ];
  }

  async getSalaryDetail(
    employeeId: string,
    month: number,
    year: number,
  ): Promise<SalaryDetail | null> {
    await this.delay(300);
    return mockSalaryData[employeeId]?.[month] || null;
  }

  async getAllSalaries(month: number, year: number): Promise<SalaryDetail[]> {
    await this.delay(600);
    const result: SalaryDetail[] = [];
    for (const empId in mockSalaryData) {
      const salary = mockSalaryData[empId]?.[month];
      if (salary) {
        result.push(salary);
      }
    }
    return result;
  }

  async calculateAllSalaries(
    month: number,
    year: number,
  ): Promise<SalaryResponse> {
    await this.delay(1000);
    const salaries = await this.getAllSalaries(month, year);
    return {
      success: true,
      data: salaries,
      message: `Đã tính lương cho ${salaries.length} nhân viên tháng ${month}/${year}`,
    };
  }

  async addToDatabase(
    salary: SalaryDetail,
  ): Promise<{ success: boolean; message: string }> {
    await this.delay(500);
    return {
      success: true,
      message: `Đã thêm bảng lương cho ${salary.HoTen} tháng ${salary.Thang}/${salary.Nam} vào CSDL`,
    };
  }

  async getAttendance(
    employeeId: string,
    month: number,
  ): Promise<AttendanceRecord | null> {
    await this.delay(300);
    return mockAttendanceData[employeeId]?.[month] || null;
  }
}

const apiService = new PayrollAPIService();

// ============= COMPONENT =============

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'salary'>(
    'employees',
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(3);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryList, setSalaryList] = useState<Array<SalaryDetail & Employee>>(
    [],
  );
  const [currentSalary, setCurrentSalary] = useState<SalaryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Load employees on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Load salary list when month/year changes
  useEffect(() => {
    loadSalaryList();
  }, [selectedMonth, selectedYear]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllNhanVien();
      setEmployees(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách nhân viên:', error);
      alert('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const loadSalaryList = async () => {
    try {
      setLoading(true);
      const salaries = await apiService.getAllSalaries(
        selectedMonth,
        selectedYear,
      );
      const combined = salaries
        .map((salary) => {
          const emp = employees.find((e) => e.id === salary.MaNV);
          return emp ? { ...emp, ...salary } : null;
        })
        .filter((item): item is SalaryDetail & Employee => item !== null);
      setSalaryList(combined);
    } catch (error) {
      console.error('Lỗi khi tải bảng lương:', error);
      alert('Không thể tải bảng lương');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSalary = async (employee: Employee) => {
    try {
      setLoadingDetail(true);
      setSelectedEmployee(employee);
      const salary = await TinhLuong(
        employee.MaNV,
        selectedMonth,
        selectedYear,
      );

      setCurrentSalary(salary);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết lương:', error);
      alert('Không thể tải chi tiết lương');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAddToDatabase = async () => {
    if (!currentSalary) return;
    try {
      setLoadingDetail(true);
      const response = await ThemLuong(currentSalary);
      if (response.success) {
        alert(response.message);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào CSDL:', error);
      alert('Không thể thêm vào CSDL');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCalculateAll = async () => {
    try {
      setLoading(true);
      const response = await apiService.calculateAllSalaries(
        selectedMonth,
        selectedYear,
      );
      if (response.success) {
        alert(response.message);
        await loadSalaryList();
      }
    } catch (error) {
      console.error('Lỗi khi tính lương:', error);
      alert('Không thể tính lương');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '20px 30px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1
            style={{
              margin: '0 0 20px 0',
              fontSize: '28px',
              fontWeight: '600',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <DollarSign size={32} color="#6366f1" />
            Hệ thống chấm công & tính lương
          </h1>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '2px solid #e0e0e0',
              marginTop: '20px',
            }}
          >
            <button
              onClick={() => setActiveTab('employees')}
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor:
                  activeTab === 'employees' ? '#6366f1' : 'transparent',
                color: activeTab === 'employees' ? '#fff' : '#666',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === 'employees' ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <Users size={18} /> Danh sách nhân viên
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor:
                  activeTab === 'salary' ? '#6366f1' : 'transparent',
                color: activeTab === 'salary' ? '#fff' : '#666',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === 'salary' ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <FileText size={18} /> Danh sách bảng lương
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        {/* Filter Section */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#6366f1" />
              <label
                style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}
              >
                Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  minWidth: '120px',
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label
                style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}
              >
                Năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  minWidth: '120px',
                }}
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCalculateAll}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                !loading && (e.currentTarget.style.backgroundColor = '#059669')
              }
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                !loading && (e.currentTarget.style.backgroundColor = '#10b981')
              }
            >
              {loading ? <Loader size={16} className="animate-spin" /> : '📊'}{' '}
              Tính lương toàn bộ
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.backgroundColor = '#4f46e5')
              }
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.backgroundColor = '#6366f1')
              }
            >
              📋 Xem bảng lương
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'employees' ? (
          // Employees Table
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                backgroundColor: '#6366f1',
                padding: '16px 24px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              Danh sách nhân viên
            </div>
            {loading ? (
              <div
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                <Loader
                  size={32}
                  className="animate-spin"
                  style={{ margin: '0 auto 16px' }}
                />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Mã nhân viên
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Họ tên
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Ngày sinh
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Giới tính
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp) => (
                    <tr
                      key={emp.MaNV}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f5f7fa')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6366f1',
                          fontWeight: '600',
                        }}
                      >
                        {emp.MaNV}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500',
                        }}
                      >
                        {emp.HoTen}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {emp.NgaySinh}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {emp.GioiTinh}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleViewSalary(emp)}
                          disabled={loadingDetail}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: loadingDetail ? '#ccc' : '#6366f1',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loadingDetail ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            opacity: loadingDetail ? 0.7 : 1,
                          }}
                          onMouseOver={(
                            e: React.MouseEvent<HTMLButtonElement>,
                          ) =>
                            !loadingDetail &&
                            (e.currentTarget.style.backgroundColor = '#4f46e5')
                          }
                          onMouseOut={(
                            e: React.MouseEvent<HTMLButtonElement>,
                          ) =>
                            !loadingDetail &&
                            (e.currentTarget.style.backgroundColor = '#6366f1')
                          }
                        >
                          📊 Tính lương
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          // Salary List
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                backgroundColor: '#6366f1',
                padding: '16px 24px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              Bảng chi tiết lương
            </div>
            {loading ? (
              <div
                style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                <Loader
                  size={32}
                  className="animate-spin"
                  style={{ margin: '0 auto 16px' }}
                />
                <p>Đang tải bảng lương...</p>
              </div>
            ) : salaryList.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f9fafb',
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Mã NV
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Tên nhân viên
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Lương cơ bản
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Tổng phụ cấp
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Tiền tăng ca
                    </th>
                    <th
                      style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Lương thực nhận
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryList.map((salary) => (
                    <tr
                      key={salary.id}
                      style={{ borderBottom: '1px solid #e5e7eb' }}
                    >
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6366f1',
                          fontWeight: '600',
                        }}
                      >
                        {salary.MaNV}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500',
                        }}
                      >
                        {salary.HoTen}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {formatCurrency(salary.LuongCoBan)}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {formatCurrency(salary.TongPhuCap)}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontSize: '14px',
                          color: '#6b7280',
                        }}
                      >
                        {formatCurrency(salary.TienTangCa)}
                      </td>
                      <td
                        style={{
                          padding: '16px 24px',
                          textAlign: 'right',
                          fontSize: '14px',
                          color: '#10b981',
                          fontWeight: '600',
                        }}
                      >
                        {formatCurrency(salary.LuongThucNhan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  padding: '60px 24px',
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                <FileText
                  size={48}
                  style={{ margin: '0 auto 16px', opacity: 0.5 }}
                />
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                  Không có dữ liệu bảng lương
                </p>
                <p style={{ fontSize: '14px' }}>
                  Vui lòng tính lương cho nhân viên trước
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && currentSalary && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 1000,
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '450px',
              height: '100vh',
              backgroundColor: '#fff',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
              animation: 'slideIn 0.3s ease',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#6366f1',
                padding: '24px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                  Chi tiết lương nhân viên
                </h2>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '13px',
                    opacity: 0.9,
                  }}
                >
                  Tháng {selectedMonth}/{selectedYear}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            {loadingDetail ? (
              <div
                style={{
                  padding: '60px 24px',
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                <Loader
                  size={32}
                  className="animate-spin"
                  style={{ margin: '0 auto 16px' }}
                />
                <p>Đang tải chi tiết lương...</p>
              </div>
            ) : (
              <div style={{ padding: '24px' }}>
                {/* Employee Info */}
                <div
                  style={{
                    marginBottom: '24px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Thông tin nhân viên
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginBottom: '4px',
                        }}
                      >
                        Mã nhân viên
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#6366f1',
                        }}
                      >
                        {currentSalary.MaNV}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginBottom: '4px',
                        }}
                      >
                        Họ tên
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1f2937',
                        }}
                      >
                        {currentSalary.HoTen}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Salary Details */}
                <div>
                  <h3
                    style={{
                      margin: '0 0 16px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Chi tiết lương
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    {[
                      {
                        label: 'Lương cơ bản',
                        value: currentSalary.LuongCoBan,
                        prefix: '',
                      },
                      {
                        label: 'Số ngày công',
                        value: currentSalary.SoNgayLam,
                        prefix: '',
                        suffix: ' ngày',
                      },
                      {
                        label: 'Tổng phụ cấp',
                        value: currentSalary.TongPhuCap,
                        prefix: '+ ',
                        color: '#10b981',
                      },
                      {
                        label: 'Tiền tăng ca',
                        value: currentSalary.TienTangCa,
                        prefix: '+ ',
                        color: '#10b981',
                      },
                      {
                        label: 'Tổng thưởng',
                        value: currentSalary.TongThuong,
                        prefix: '+ ',
                        color: '#10b981',
                      },
                      {
                        label: 'Tổng phạt',
                        value: currentSalary.TongPhat,
                        prefix: '',
                        color: '#ef4444',
                      },
                      {
                        label: 'Bảo hiểm (9%)',
                        value: currentSalary.BaoHiem,
                        prefix: '',
                        color: '#ef4444',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '16px',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '6px',
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize:
                              item.label === 'Số ngày công' ? '16px' : '14px',
                            fontWeight:
                              item.label === 'Số ngày công' ? '700' : '600',
                            color: item.color || '#1f2937',
                          }}
                        >
                          {item.prefix}
                          {typeof item.value === 'number' &&
                          item.label !== 'Số ngày công'
                            ? formatCurrency(item.value)
                            : item.value}
                          {item.suffix || ''}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#d1fae5',
                      borderLeft: '4px solid #10b981',
                      borderRadius: '6px',
                      marginBottom: '24px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#047857',
                        marginBottom: '6px',
                      }}
                    >
                      Lương thực nhận
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#10b981',
                      }}
                    >
                      {formatCurrency(currentSalary.LuongThucNhan)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px',
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#fff',
                boxShadow: '0 -1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <button
                onClick={() => setShowDetailModal(false)}
                disabled={loadingDetail}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: loadingDetail ? '#ccc' : '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingDetail ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  opacity: loadingDetail ? 0.7 : 1,
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                  !loadingDetail &&
                  (e.currentTarget.style.backgroundColor = '#d1d5db')
                }
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                  !loadingDetail &&
                  (e.currentTarget.style.backgroundColor = '#e5e7eb')
                }
              >
                ✕ Đóng
              </button>
              <button
                onClick={handleAddToDatabase}
                disabled={loadingDetail}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: loadingDetail ? '#ccc' : '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingDetail ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  opacity: loadingDetail ? 0.7 : 1,
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                  !loadingDetail &&
                  (e.currentTarget.style.backgroundColor = '#059669')
                }
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                  !loadingDetail &&
                  (e.currentTarget.style.backgroundColor = '#10b981')
                }
              >
                💾 Thêm vào CSDL
              </button>
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;
