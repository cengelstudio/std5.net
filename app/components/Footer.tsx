"use client";
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

const STUDIOS = [
  {
    id: 1,
    name: "Esentepe",
    address: "Esentepe, Dergiler Sk. No: 5 Şişli / İstanbul"
  },
  {
    id: 2,
    name: "Fulyalı",
    address: "Levent, Fulyalı Sk. No: 28 Beşiktaş / İstanbul"
  },
  {
    id: 3,
    name: "Figen 2",
    address: "Levent, Figen Sk. No: 2 Beşiktaş / İstanbul"
  }
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-std5-darker via-black to-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src="/std5-white-cropped.png"
                alt="STD5"
                width={120}
                height={40}
                className="h-10 w-auto filter drop-shadow-lg"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              İstanbul merkezli yerel ve küresel eğlence endüstrisine hizmet veren tam kapasiteli post prodüksiyon şirketi.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-std5-accent flex-shrink-0" />
                <span>+90 (212) 267 80 94</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-std5-accent flex-shrink-0" />
                <span>info@std5.net</span>
              </div>
            </div>
          </div>

          {/* Studios */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Stüdyolarımız</h3>
            <div className="space-y-6">
              {STUDIOS.map((studio) => (
                <div key={studio.id} className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 text-std5-accent flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1 group-hover:text-std5-accent transition-colors duration-300">
                        STD5 {studio.name}
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
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-left text-gray-400 hover:text-std5-accent hover:translate-x-1 transition-all duration-300 text-sm py-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 STD5. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="text-gray-500 hover:text-std5-accent transition-colors duration-300 text-sm">
                Gizlilik Politikası
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-std5-accent transition-colors duration-300 text-sm">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
