import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header({ showBackButton = true }: { showBackButton?: boolean }) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Image
              src="/std5-white-cropped.png"
              alt="STD5"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </motion.div>

          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push('/')}
                className="text-white hover:text-std5-accent transition-colors duration-300"
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => router.push('/about')}
                className="text-white hover:text-std5-accent transition-colors duration-300"
              >
                Hakkımızda
              </button>
              <button
                onClick={() => router.push('/portfolio')}
                className="text-white hover:text-std5-accent transition-colors duration-300"
              >
                Portfolyo
              </button>
              <button
                onClick={() => router.push('/studios')}
                className="text-white hover:text-std5-accent transition-colors duration-300"
              >
                Stüdyolar
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="text-white hover:text-std5-accent transition-colors duration-300"
              >
                İletişim
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white hover:text-std5-accent transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
