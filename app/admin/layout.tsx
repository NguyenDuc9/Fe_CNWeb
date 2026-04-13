'use client';
import SidebarAdmin from '../admin/dashboard/page';
import '../../public/stylesheets/admin.css';
import Link from 'next/link';
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
            <button
              className="logout"
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
              }}
            >
              <Link href="/">Logout</Link>
            </button>
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
