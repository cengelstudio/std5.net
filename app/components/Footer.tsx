"use client";
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Studio {
  id: number;
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
}

export default function Footer() {
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);

  useEffect(() => {
    // Fetch studios data
    fetch('/data/studios.json')
      .then(res => res.json())
      .then(data => setStudios(data))
      .catch(err => console.error('Error loading studios:', err));
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-std5-darker via-black to-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative w-32 h-12">
                <Image
                  src="/std5-white-cropped.png"
                  alt="STD5"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-gray-400 text-base leading-relaxed max-w-md">
                İstanbul'un lider post prodüksiyon stüdyosu.
                Yaratıcılık ve teknolojinin buluştuğu nokta.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 group">
                <Mail className="w-5 h-5 flex-shrink-0 group-hover:text-std5-accent transition-colors duration-300" />
                <a href="mailto:info@std5.net" className="text-sm group-hover:text-std5-accent transition-colors duration-300">
                  info@std5.net
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 group">
                <Phone className="w-5 h-5 flex-shrink-0 group-hover:text-std5-accent transition-colors duration-300" />
                <a href="tel:+902121811" className="text-sm group-hover:text-std5-accent transition-colors duration-300">
                  +90 212 18 11
                </a>
              </div>
            </div>
          </div>

          {/* Studios */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Stüdyolarımız</h3>
            <div className="space-y-6">
              {studios.map((studio) => (
                <div key={studio.id} className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-std5-accent flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1 group-hover:text-std5-accent transition-colors duration-300">
                        {studio.name}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {studio.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Keşfet</h3>
            <nav className="grid grid-cols-2 gap-4">
              {[
                { name: 'Hakkımızda', path: '/about' },
                { name: 'Portfolyo', path: '/portfolio' },
                { name: 'Stüdyolar', path: '/studios' },
                { name: 'İletişim', path: '/contact' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="text-left text-gray-400 hover:text-std5-accent hover:translate-x-1 transition-all duration-300 text-sm py-1"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} STD5. Tüm hakları saklıdır.
          </p>

          {/* Cengel Studio Logo */}
          <div className="mt-4 md:mt-0">
            <a
              href="https://cengel.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors duration-300"
            >
              <span className="text-xs">Powered by</span>
              <div className="relative w-8 h-8 overflow-hidden rounded-[13px] group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/cengelstudio-logo.png"
                  alt="Cengel Studio"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
