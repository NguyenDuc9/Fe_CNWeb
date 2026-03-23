import '../../../public/stylesheets/admin.css';
export default function SidebarAdmin() {
  return (
    <div className="sidebar ">
      <h2>Sidebar Manager</h2>
      <ul>
        <li>
          <a href="/manager/taikhoan">Tài khoản</a>
        </li>
        <li>
          <a href="/Manager/NhanVien">Nhân viên</a>
        </li>
        <li>
          <a href="/Manager/phongban">Phòng ban</a>
        </li>
        <li>
          <a href="/Manager/chucvu">Chức vụ</a>
        </li>
      </ul>
    </div>
  );
}
