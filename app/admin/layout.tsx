import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './admin.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CMS | STD5',
  description: 'STD5.net content management system, Developed by CengelStudio',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} admin-layout`}>
      <Toaster position="top-right" />
      {children}
    </div>
  );
}
