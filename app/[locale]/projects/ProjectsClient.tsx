"use client";

import { motion } from "framer-motion";
import {
  Play,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar,
  Tag,
  Monitor,
  RotateCcw
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createSlug, handleImageError, debounce } from '../../utils';
import { PAGINATION } from '../../constants';
import { Work, WorksResponse } from '../../../types';
import { useTranslation } from '../../hooks/useTranslation';

export default function ProjectsClient() {
  const { t, createLocalizedPath } = useTranslation();
  const [works, setWorks] = useState<Work[]>([]);
  const [filters, setFilters] = useState<{ genres: string[]; platforms: string[]; years: number[] }>({ genres: [], platforms: [], years: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
        filteredWorks = filteredWorks.filter(work =>
          work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setWorks(filteredWorks);
      setFilters(data.filters);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPlatform, selectedYear, searchTerm]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const debouncedSearch = useCallback(
    debounce((term: unknown) => {
      setSearchTerm(term as string);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const clearFilters = () => {
    setSelectedPlatform('');
    setSelectedYear('');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedPlatform || selectedYear || searchTerm;

  return (
    <div className="min-h-screen bg-std5-darker">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('projects.title')}
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t('projects.subtitle')}
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('projects.searchPlaceholder')}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                />
              </div>

              {/* Platform Filter */}
              <div className="relative">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300 cursor-pointer"
                >
                  <option value="">{t('projects.allPlatforms')}</option>
                  {filters.platforms?.map((platform) => (
                    <option key={platform} value={platform} className="bg-std5-darker text-white">
                      {platform}
                    </option>
                  ))}
                </select>
                <Monitor className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300 cursor-pointer"
                >
                  <option value="">{t('projects.allYears')}</option>
                  {filters.years?.map((year) => (
                    <option key={year} value={year} className="bg-std5-darker text-white">
                      {year}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-std5-accent hover:bg-std5-accent/90 text-white rounded-xl transition-colors duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('projects.clearFilters')}</span>
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
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                          onError={(e) => handleImageError(e as any, work.title)}
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
                          {work.description}
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
