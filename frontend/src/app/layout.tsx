import type { Metadata } from 'next';
import type React from 'react';
import { AuthWrapper } from '../components/AuthWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'HRM MongoDB',
  description: 'Quan ly nhan su va du an bang MongoDB'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
