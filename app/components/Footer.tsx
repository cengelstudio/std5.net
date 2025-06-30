import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-std5-darker/50 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">STD5</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              İstanbul merkezli yerel ve küresel eğlence endüstrisine hizmet veren tam kapasiteli bir post prodüksiyon şirketi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/about')}
                  className="text-gray-400 hover:text-std5-accent transition-colors duration-300"
                >
                  Hakkımızda
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/portfolio')}
                  className="text-gray-400 hover:text-std5-accent transition-colors duration-300"
                >
                  Portfolyo
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/studios')}
                  className="text-gray-400 hover:text-std5-accent transition-colors duration-300"
                >
                  Stüdyolar
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/contact')}
                  className="text-gray-400 hover:text-std5-accent transition-colors duration-300"
                >
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@std5.net" className="hover:text-std5-accent transition-colors duration-300">
                  info@std5.net
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <a href="tel:+902122222222" className="hover:text-std5-accent transition-colors duration-300">
                  +90 212 222 22 22
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Adres</h3>
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p>Esentepe Mahallesi Dergiler Sokak No:5</p>
                <p>Şişli/İstanbul</p>
                <div className="w-12 h-0.5 bg-std5-accent/30 my-2" />
                <p>Levent Mahallesi Fulyalı Sokak No:28</p>
                <p>Beşiktaş/İstanbul</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} STD5. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
