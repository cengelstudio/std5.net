"use client";

import { motion } from "framer-motion";
import {
  Play,
  Search,
  Calendar,
  Monitor,
  RotateCcw
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createSlug, handleImageError } from '../../utils';
import { Work, WorksResponse } from '../../../types';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProjectsClient() {
  const { t, createLocalizedPath, locale } = useTranslation();
  const [works, setWorks] = useState<Work[]>([]);
  const [filters, setFilters] = useState<{ genres: string[]; platforms: string[]; years: number[] }>({ genres: [], platforms: [], years: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedPlatform) params.append('platform', selectedPlatform);
      if (selectedYear) params.append('year', selectedYear);
      const response = await fetch(`/api/works?${params}`);
      const data: WorksResponse = await response.json();
      let filteredWorks = data.works;
      if (searchTerm) {
        filteredWorks = filteredWorks.filter(work => {
          const description = typeof work.description === 'string' 
            ? work.description 
            : (work.description as { [key: string]: string })[locale] || (work.description as { [key: string]: string }).tr || (work.description as { [key: string]: string }).en || '';
          
          return work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 description.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      setWorks(filteredWorks);
      setFilters(data.filters);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPlatform, selectedYear, searchTerm, locale]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  // Type-safe debounce for string
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const clearFilters = () => {
    setSelectedPlatform('');
    setSelectedYear('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedPlatform || selectedYear || searchTerm;

  // Handle search input focus
  const handleSearchFocus = () => {
    // Scroll to specific position only on smaller screens
    if (window.innerWidth < 1030) {
      setTimeout(() => {
        window.scrollTo({
          top: 215,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleSearchBlur = () => {
    // Focus blur handler - currently no action needed
  };

  // Check if filters should be visible on mobile
  // const shouldShowFiltersOnMobile = isSearchFocused || searchTerm.length > 0 || selectedPlatform || selectedYear;

  return (
    <div className="min-h-screen bg-std5-darker">
      {/* Hero Section */}
      <section className="relative pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-std5-dark/20 to-std5-darker"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="relative mb-8">
              <motion.h1
                className="text-[28px] md:text-[52px] font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {t('projects.title')}
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>
            <p className="text-[20px] md:text-[26px] text-gray-300 max-w-5xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Search Input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-std5-accent transition-colors duration-300" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('projects.searchPlaceholder')}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="w-full pl-12 pr-4 py-4 bg-black/20 border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent hover:border-white/20 transition-all duration-300"
              />
            </div>

            {/* Filters Row - Mobile: side by side, Desktop: inline with search */}
            <div className="flex flex-row md:flex-row gap-4">
              {/* Platform Filter */}
              <div className="relative group flex-1 md:flex-none">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="appearance-none w-full md:w-48 pl-4 pr-12 py-4 bg-black/20 border-2 border-white/10 rounded-2xl text-white focus:outline-none focus:border-std5-accent hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <option value="">{t('projects.allPlatforms')}</option>
                  {filters.platforms?.map((platform) => (
                    <option key={platform} value={platform} className="bg-std5-darker text-white">
                      {platform}
                    </option>
                  ))}
                </select>
                <Monitor className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-std5-accent transition-colors duration-300 pointer-events-none" />
              </div>

              {/* Year Filter */}
              <div className="relative group flex-1 md:flex-none">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none w-full md:w-40 pl-4 pr-12 py-4 bg-black/20 border-2 border-white/10 rounded-2xl text-white focus:outline-none focus:border-std5-accent hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <option value="">{t('projects.allYears')}</option>
                  {filters.years?.map((year) => (
                    <option key={year} value={year} className="bg-std5-darker text-white">
                      {year}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-std5-accent transition-colors duration-300 pointer-events-none" />
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">{t('projects.clearFilters')}</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {works.map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={createLocalizedPath(`/work/${createSlug(work.title)}`)} className="block cursor-pointer">
                      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                          className="object-cover"
                          onError={(e) => handleImageError(e, work.title)}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-std5-accent transition-colors duration-300">
                          {work.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {typeof work.description === 'string' 
                            ? work.description 
                            : (work.description as { [key: string]: string })[locale] || (work.description as { [key: string]: string }).tr || (work.description as { [key: string]: string }).en || ''}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{work.prod_year}</span>
                          {work.platform && (
                            <>
                              <span>•</span>
                              <span>{work.platform}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
