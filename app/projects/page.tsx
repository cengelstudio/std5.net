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
import LoadingSpinner from '../components/LoadingSpinner';
import { createSlug, handleImageError, debounce } from '../utils';
import { PAGINATION } from '../constants';
import { Work, WorksResponse } from '../../types';

export default function Projeler() {
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
  }, [selectedPlatform, selectedYear, fetchWorks]);

  useEffect(() => {
    fetchWorks();
  }, [searchTerm, fetchWorks]);

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'platform':
        setSelectedPlatform(value === selectedPlatform ? '' : value);
        break;
      case 'year':
        setSelectedYear(value === selectedYear ? '' : value);
        break;
    }
  };

  const clearFilters = () => {
    setSelectedPlatform('');
    setSelectedYear('');
    setSearchTerm('');
  };

  // Debounced search function for better performance
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Get active filters count and data
  const getActiveFilters = () => {
    const activeFilters = [];
    if (selectedPlatform) activeFilters.push({ type: 'platform', value: selectedPlatform, label: selectedPlatform });
    if (selectedYear) activeFilters.push({ type: 'year', value: selectedYear, label: selectedYear.toString() });
    if (searchTerm) activeFilters.push({ type: 'search', value: searchTerm, label: `"${searchTerm}"` });
    return activeFilters;
  };

  const removeFilter = (type: string) => {
    switch (type) {
      case 'platform':
        setSelectedPlatform('');
        break;
      case 'year':
        setSelectedYear('');
        break;
      case 'search':
        setSearchTerm('');
        break;
    }
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="min-h-screen bg-std5-darker">
      {/* Hero Section */}
      <section className="relative pt-24 pb-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="relative mb-8">
              <motion.h1
                className="text-[28px] md:text-[52px] font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Projeler
              </motion.h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-std5-primary to-std5-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </div>
            <p className="text-[20px] md:text-[26px] text-gray-300 max-w-2xl mx-auto">
              250'den fazla projeye imzamızı attık
            </p>
          </motion.div>

          {/* Compact Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="w-full lg:flex-1 lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Proje ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-std5-accent focus:ring-2 focus:ring-std5-accent/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Platform Filter */}
                  <div className="relative">
                    <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedPlatform}
                      onChange={(e) => handleFilterChange('platform', e.target.value)}
                      className={`pl-9 pr-4 py-3 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-std5-accent transition-all duration-300 ${
                        selectedPlatform ? 'border-std5-accent bg-std5-accent/10' : 'border-white/10'
                      }`}
                    >
                      <option value="" className="bg-std5-dark text-white">Tüm Platformlar</option>
                      {filters.platforms.map(platform => (
                        <option key={platform} value={platform} className="bg-std5-dark text-white">{platform}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedYear}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className={`pl-9 pr-4 py-3 bg-white/5 border rounded-xl text-white text-sm focus:outline-none focus:border-std5-accent transition-all duration-300 ${
                        selectedYear ? 'border-std5-accent bg-std5-accent/10' : 'border-white/10'
                      }`}
                    >
                      <option value="" className="bg-std5-dark text-white">Tüm Yıllar</option>
                      {filters.years.filter(year => Number(year) >= 2017).map(year => (
                        <option key={year} value={year} className="bg-std5-dark text-white">{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Button */}
                  {hasActiveFilters && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 text-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Temizle</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Active Filters - Compact */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/10 pt-3 mt-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeFilters.map((filter, index) => (
                      <motion.div
                        key={`${filter.type}-${filter.value}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-1.5 px-2 py-1 bg-std5-accent/20 border border-std5-accent/30 text-std5-accent rounded text-xs"
                      >
                        <span>{filter.label}</span>
                        <button
                          onClick={() => removeFilter(filter.type)}
                          className="hover:bg-std5-accent/20 p-0.5 rounded transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Content Section */}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
