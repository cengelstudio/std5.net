'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        const error = await response.json();
        setError(error.message || 'Giriş başarısız');
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Logo */}
          <div className="bg-white px-8 py-8 text-center border-b border-gray-100">
            {/* Logo */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/std5-purple-cropped.png"
                  alt="STD5 Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">Yönetim Paneli</h1>
              <p className="text-gray-500 text-sm">Devam etmek için giriş yapınız</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Kullanıcı Adı
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Kullanıcı adınızı girin"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Şifrenizi girin"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center mb-2">
            <Image
              src="/cengelstudio-logo.png"
              alt="Cengel Studio"
              width={80}
              height={16}
              className="opacity-50 hover:opacity-70 transition-opacity rounded-md"
            />
          </div>
          <p className="text-xs text-gray-400">
            © 2024 STD5. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
