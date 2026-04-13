'use client';
import '../../public/stylesheets/login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoginRequest } from '../../model/dto/auth.dto';
import { Login } from '../../service/auth.api';
const LoginPage = () => {
  const [form, setForm] = useState<LoginRequest>({
    TenDangNhap: '',
    MatKhau: '',
  });
  const router = useRouter();

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await Login(form);
      console.log('Login successful:', response);
      localStorage.setItem('accessToken', response.accessToken);
      // localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      const user = response.user;
      if (user.VaiTro === 'admin' || user.VaiTro === 'ADMIN') {
        router.push('/admin/taikhoan');
      } else if (user.VaiTro === 'manager') {
        router.push('/Manager/NhanVien');
      } else if (user.VaiTro === 'staff') {
        router.push('/staff/NghiPhep');
      } else {
        console.warn('Unknown user role:', user.VaiTro);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={HandleSubmit}>
        <label htmlFor="TenDangNhap">Tên Đăng Nhập:</label>
        <input
          type="text"
          id="TenDangNhap"
          value={form.TenDangNhap}
          onChange={(e) => setForm({ ...form, TenDangNhap: e.target.value })}
        />
        <label htmlFor="MatKhau">Mật Khẩu:</label>
        <input
          type="password"
          id="MatKhau"
          value={form.MatKhau}
          onChange={(e) => setForm({ ...form, MatKhau: e.target.value })}
        />
        <button type="submit">Đăng Nhập</button>
      </form>
    </div>
  );
};
export default LoginPage;
