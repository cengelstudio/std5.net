"use client";

import { motion } from "framer-motion";
import {
  Play,
  Filter,
  Search,
  Calendar,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import tr from '../../locales/tr.json';
import en from '../../locales/en.json';
import Image from 'next/image';
import { Translations } from '../../types/translations';

const locales = { tr, en } as { [key: string]: Translations };

interface Work {
  id: string;
  title: string;
  description: string;
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
}

interface WorksResponse {
  works: Work[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    genres: string[];
    platforms: string[];
    years: number[];
  };
}

export default function Portfolio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState('tr');
  const [translations, setTranslations] = useState<Translations>(tr);
  const [works, setWorks] = useState<Work[]>([]);
  const [filters, setFilters] = useState<{ genres: string[]; platforms: string[]; years: number[] }>({ genres: [], platforms: [], years: [] });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const validLang = langParam === 'en' ? 'en' : 'tr';
    setLocale(validLang);
    setTranslations(locales[validLang as keyof typeof locales]);
  }, [searchParams]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const fetchWorks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        lang: locale
      });

      if (selectedGenre) params.append('genre', selectedGenre);
      if (selectedPlatform) params.append('platform', selectedPlatform);
      if (selectedYear) params.append('year', selectedYear);

      const response = await fetch(`/api/works?${params}`);
      const data: WorksResponse = await response.json();

      let filteredWorks = data.works;

      // Client-side search filtering
      if (searchTerm) {
        filteredWorks = filteredWorks.filter(work =>
          work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          work.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setWorks(filteredWorks);
      setFilters(data.filters);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks(currentPage);
  }, [locale, selectedGenre, selectedPlatform, selectedYear, currentPage]);

  useEffect(() => {
    fetchWorks(1);
    setCurrentPage(1);
  }, [searchTerm]);

  const handleFilterChange = (type: string, value: string) => {
    setCurrentPage(1);
    switch (type) {
      case 'genre':
        setSelectedGenre(value === selectedGenre ? '' : value);
        break;
      case 'platform':
        setSelectedPlatform(value === selectedPlatform ? '' : value);
        break;
      case 'year':
        setSelectedYear(value === selectedYear ? '' : value);
        break;
    }
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedYear('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const switchLanguage = (newLocale: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('lang', newLocale);
    router.push(currentUrl.pathname + currentUrl.search);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-std5-darker via-std5-dark to-std5-darker">
      {/* Content */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {t('portfolio.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('portfolio.subtitle')}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={locale === 'tr' ? 'Proje ara...' : 'Search projects...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Genre Filter */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-300">
                    <Tag className="w-4 h-4" />
                    {selectedGenre || (locale === 'tr' ? 'Tür' : 'Genre')}
                  </button>
                  <div className="absolute top-full left-0 mt-2 glass-strong rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[150px]">
                    <div className="py-1">
                      {filters.genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => handleFilterChange('genre', genre)}
                          className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                            selectedGenre === genre ? 'text-std5-accent' : 'text-white'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platform Filter */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-300">
                    <Filter className="w-4 h-4" />
                    {selectedPlatform || 'Platform'}
                  </button>
                  <div className="absolute top-full left-0 mt-2 glass-strong rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[150px]">
                    <div className="py-1">
                      {filters.platforms.map((platform) => (
                        <button
                          key={platform}
                          onClick={() => handleFilterChange('platform', platform)}
                          className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                            selectedPlatform === platform ? 'text-std5-accent' : 'text-white'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-300">
                    <Calendar className="w-4 h-4" />
                    {selectedYear || (locale === 'tr' ? 'Yıl' : 'Year')}
                  </button>
                  <div className="absolute top-full left-0 mt-2 glass-strong rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[100px]">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {filters.years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleFilterChange('year', year.toString())}
                          className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                            selectedYear === year.toString() ? 'text-std5-accent' : 'text-white'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedGenre || selectedPlatform || selectedYear || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-std5-accent hover:text-white transition-colors duration-300"
                  >
                    {locale === 'tr' ? 'Temizle' : 'Clear'}
                  </button>
                )}

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      viewMode === 'grid' ? 'bg-std5-primary text-white' : 'glass text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      viewMode === 'list' ? 'bg-std5-primary text-white' : 'glass text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                {locale === 'tr' ? 'Hiç proje bulunamadı.' : 'No projects found.'}
              </p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {works.map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`glass rounded-2xl overflow-hidden card-hover group ${
                      viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : 'aspect-video'}`}>
                      <div className="w-full h-full bg-gradient-to-br from-std5-primary/30 to-std5-accent/30 relative">
                        {work.image ? (
                          <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml,${encodeURIComponent(
                                `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="400" height="300" fill="#430086"/>
                                  <text x="200" y="150" text-anchor="middle" fill="white" font-size="20">${work.title}</text>
                                </svg>`
                              )}`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-lg">{work.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex gap-3">
                            <button className="w-12 h-12 bg-std5-primary/80 rounded-full flex items-center justify-center text-white hover:bg-std5-primary transition-colors duration-300">
                              <Play className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300">
                              <ExternalLink className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-std5-primary/20 text-std5-accent border border-std5-primary/30">
                          {work.genre}
                        </span>
                        <span className="text-xs text-gray-400">
                          {work.prod_year}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-std5-accent transition-colors duration-300">
                        {work.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {work.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {work.platform}
                        </span>

                        <button className="text-std5-accent hover:text-white transition-colors duration-300 text-sm font-medium">
                          {t('portfolio.viewProject')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex justify-center items-center gap-4 mt-12"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors duration-300 ${
                          currentPage === page
                            ? 'bg-std5-primary text-white'
                            : 'glass text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 glass rounded-lg text-white hover:bg-white/10 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
