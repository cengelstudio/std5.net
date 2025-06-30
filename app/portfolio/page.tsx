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
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const fetchWorks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
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
  }, [selectedGenre, selectedPlatform, selectedYear, currentPage]);

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
              Portfolyo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Yaratıcılığımızın ve deneyimimizin bir yansıması olan projelerimizi keşfedin.
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
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent transition-colors duration-300"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Genre Filter */}
                <select
                  value={selectedGenre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                >
                  <option value="">Tür</option>
                  {filters.genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                      ))}
                </select>

                {/* Platform Filter */}
                <select
                  value={selectedPlatform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                >
                  <option value="">Platform</option>
                  {filters.platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                      ))}
                </select>

                {/* Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-std5-accent transition-colors duration-300"
                >
                  <option value="">Yıl</option>
                  {filters.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                      ))}
                </select>

                {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                  className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-colors duration-300"
                  >
                  Temizle
                  </button>

                {/* View Mode Toggle */}
                <div className="flex bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      viewMode === 'grid' ? 'bg-std5-accent text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      viewMode === 'list' ? 'bg-std5-accent text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Works Grid/List */}
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
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                }
              >
                {works.map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={viewMode === 'grid'
                      ? "glass rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                      : "glass rounded-2xl overflow-hidden flex gap-6 p-6 hover:bg-white/5 transition-colors duration-300"
                    }
                    onClick={() => router.push(`/works/${work.id}`)}
                  >
                    <div className={viewMode === 'grid' ? "relative aspect-video" : "w-32 h-20 flex-shrink-0"}>
                      <Image
                            src={work.image}
                            alt={work.title}
                        fill
                        className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml,${encodeURIComponent(
                            `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
                              <rect width="400" height="225" fill="#430086"/>
                              <text x="200" y="112" text-anchor="middle" fill="white" font-size="16">${work.title}</text>
                                </svg>`
                              )}`;
                            }}
                          />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    <div className={viewMode === 'grid' ? "p-6" : "flex-1"}>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-std5-accent transition-colors duration-300">
                        {work.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {work.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {work.prod_year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {work.genre}
                        </span>
                        <span>{work.platform}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex justify-center items-center gap-2 mt-12"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                          currentPage === page
                          ? 'bg-std5-accent text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
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
