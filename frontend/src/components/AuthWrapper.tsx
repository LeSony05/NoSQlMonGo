'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else if (pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  if (!isClient) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!user) {
    return <div className="p-4 text-center">Đang chuyển hướng...</div>;
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold text-ink cursor-pointer" onClick={() => router.push('/')}>
            HRM MongoDB
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex gap-2">
              <span className="rounded px-3 py-2 cursor-pointer hover:bg-mist" onClick={() => router.push('/employees')}>
                Nhân viên
              </span>
              <span className="rounded px-3 py-2 cursor-pointer hover:bg-mist" onClick={() => router.push('/dashboard')}>
                Dashboard
              </span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-600">{user.fullName} ({user.role})</span>
              <button onClick={handleLogout} className="rounded bg-red-500 px-3 py-1.5 text-white hover:bg-red-600">
                Đăng xuất
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </>
  );
}
