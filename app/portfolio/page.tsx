"use client";

import { motion } from "framer-motion";
import {
  Play,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import Image from 'next/image';

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
  const [works, setWorks] = useState<Work[]>([]);
  const [filters, setFilters] = useState<{ genres: string[]; platforms: string[]; years: number[] }>({ genres: [], platforms: [], years: [] });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWorks = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
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
  }, [selectedGenre, selectedPlatform, selectedYear, searchTerm]);

  useEffect(() => {
    fetchWorks(currentPage);
  }, [selectedGenre, selectedPlatform, selectedYear, currentPage, fetchWorks]);

  useEffect(() => {
    fetchWorks(1);
    setCurrentPage(1);
  }, [searchTerm, fetchWorks]);

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

  // Create slug from title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="min-h-screen bg-std5-darker">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Portfolyo
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Yaratıcılığımızın ve deneyimimizin bir yansıması olan projelerimizi keşfedin.
            </p>
          </motion.div>

          {/* Clean Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="glass rounded-2xl p-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="w-full lg:flex-1 lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Proje ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  <select
                    value={selectedGenre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                  >
                    <option value="" className="bg-std5-dark text-white">Tüm Türler</option>
                    {filters.genres.map(genre => (
                      <option key={genre} value={genre} className="bg-std5-dark text-white">{genre}</option>
                    ))}
                  </select>

                  <select
                    value={selectedPlatform}
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                  >
                    <option value="" className="bg-std5-dark text-white">Tüm Platformlar</option>
                    {filters.platforms.map(platform => (
                      <option key={platform} value={platform} className="bg-std5-dark text-white">{platform}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                  >
                    <option value="" className="bg-std5-dark text-white">Tüm Yıllar</option>
                    {filters.years.map(year => (
                      <option key={year} value={year} className="bg-std5-dark text-white">{year}</option>
                    ))}
                  </select>

                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors duration-300"
                  >
                    Temizle
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-std5-accent border-t-transparent rounded-full animate-spin"></div>
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
                    <Link href={`/work/${createSlug(work.title)}`} className="block cursor-pointer">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,${encodeURIComponent(
                              `<svg viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
                                <rect width="300" height="450" fill="#430086"/>
                                <text x="150" y="225" text-anchor="middle" fill="white" font-size="14">${work.title}</text>
                              </svg>`
                            )}`;
                          }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-80" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white font-semibold text-lg mb-2">
                              {work.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                              <span>{work.prod_year}</span>
                              <span>•</span>
                              <span>{work.genre}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Clean Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex justify-center items-center gap-2 mt-16"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-3 glass rounded-xl text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-3 rounded-xl transition-colors duration-300 ${
                        currentPage === page
                          ? 'bg-std5-accent text-white'
                          : 'glass text-white hover:bg-white/10'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="p-3 glass rounded-xl text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
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
