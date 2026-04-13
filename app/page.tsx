import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-10 max-w-xl text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hệ Thống Quản Lý Nhân Sự
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Quản lý nhân viên, chấm công, tính lương và báo cáo một cách dễ dàng
          và hiệu quả.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
              Đăng Nhập
            </button>
          </Link>

          <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition">
            Tìm Hiểu Thêm
          </button>
        </div>

        {/* Footer nhỏ */}
        <p className="mt-6 text-sm text-gray-400">
          © 2026 HR Management System
        </p>
      </div>
    </div>
  );
}
