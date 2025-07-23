"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';

export default function Header() {
  const { t, createLocalizedPath } = useTranslation();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background effect
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide header
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isHeaderHidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Link href={createLocalizedPath('/')} className="relative">
                <Image
                  src="/std5-purple-cropped.png"
                  alt="STD5"
                  width={140}
                  height={46}
                  className="h-10 md:h-12 w-auto filter drop-shadow-lg"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const localizedPath = createLocalizedPath(item.path);
                const isActive = pathname === localizedPath;
                return (
                  <motion.div
                    key={item.path}
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={localizedPath}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                        isActive
                          ? 'text-std5-accent'
                          : 'text-white hover:text-std5-accent'
                      }`}
                    >
                      <span className="relative z-10">{t(item.name)}</span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-std5-accent/20 rounded-lg"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>
                );
              })}

              {/* Language Switcher */}
              <div className="ml-4">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-white hover:text-std5-accent transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-1">
                {NAV_ITEMS.map((item, index) => {
                  const localizedPath = createLocalizedPath(item.path);
                  const isActive = pathname === localizedPath;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={localizedPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'text-std5-accent bg-std5-accent/10'
                            : 'text-white hover:text-std5-accent hover:bg-white/5'
                        }`}
                      >
                        {t(item.name)}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Language Switcher */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_ITEMS.length * 0.1 }}
                  className="pt-4 border-t border-white/10"
                >
                  <LanguageSwitcher />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
