import '../../../public/stylesheets/admin.css';
export default function SidebarManager() {
  return (
    <div className="sidebar ">
      <h2>Sidebar Manager</h2>
      <ul>
        <li>
          <a href="/Manager/Luong">Luong11</a>
        </li>
        <li>
          <a href="/Manager/NhanVien">Nhân viên</a>
        </li>
        <li>
          <a href="/Manager/PhongBan">Phòng ban</a>
        </li>
        <li>
          <a href="/Manager/HDLD">Hop Dong Lao Dong</a>
        </li>
        <li>
          <a href="/Manager/PhuCap">Phụ cấp</a>
        </li>
        <li>
          <a href="/Manager/ThuongPhat">Thưởng - Phạt</a>
        </li>
        <li>
          <a href="/Manager/BangLuong">Tinh lương</a>
        </li>
        <li>
          <a href="/Manager/ChamCong">Chấm công</a>
        </li>
      </ul>
    </div>
  );
}
