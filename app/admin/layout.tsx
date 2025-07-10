'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './admin.css';

const inter = Inter({ subsets: ['latin'] });

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      return;
    }

    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router, pathname]);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#430086" />
        <title>CMS | STD5</title>
        <meta name="description" content="STD5.net content management system, Developed by CengelStudio" />
      </head>
      <body>
        <div className={`${inter.className} admin-layout`}>
          <Toaster position="top-right" />
          {children}
        </div>
      </body>
    </html>
  );
}
