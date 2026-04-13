'use client';
import SidebarStaff from '../staff/dashboard/page';
// import '../../public/stylesheets/admin.css';
import Link from 'next/link';
export default function LayoutStaff({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };
  return (
    <div>
      <div>
        <header className="header">
          <div className="logo">Quản lý nhân sự</div>

          <div className="right">
            <span className="welcome">Chào Nhân viên</span>
            <button className="logout" onClick={handleLogout}>
              <Link href="/">Logout</Link>
            </button>
          </div>
        </header>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <SidebarStaff />
        </div>

        {children}
      </div>
    </div>
  );
}
