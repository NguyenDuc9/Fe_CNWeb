import SidebarAdmin from '../Manager/dashboard/page';
import '../../public/stylesheets/admin.css';
export default function LayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <header className="header">
          <div className="logo">Quản lý nhân sự</div>

          <div className="right">
            <span className="welcome">Chào Admin</span>
            <button className="logout">Logout</button>
          </div>
        </header>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <SidebarAdmin />
        </div>

        {children}
      </div>
    </div>
  );
}
