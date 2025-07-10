'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CatsClient from './CatsClient';

export default function CatsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  return <CatsClient />;
}
