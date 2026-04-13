import type { User } from '../user.interface';
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface LoginRequest {
  TenDangNhap: string;
  MatKhau: string;
}
