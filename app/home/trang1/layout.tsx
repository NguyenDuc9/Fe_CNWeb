import Image from 'next/image';
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">Shop</h1>

          <nav className="flex gap-6">
            <a className="hover:text-blue-500">Home</a>
            <a className="hover:text-blue-500">Products</a>
            <a className="hover:text-blue-500">Blog</a>
            <a className="hover:text-blue-500">Contact</a>
          </nav>

          <div className="flex gap-4">
            <button className="border px-3 py-1 rounded">Login</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded">
              Sign up
            </button>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
