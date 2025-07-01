import { Work } from './api';

// Loading Spinner Props
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Mosaic Background Props
export interface MosaicBackgroundProps {
  seed?: number;
  className?: string;
}

// Service Card Props
export interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    color: string;
  };
  index: number;
}

// Work Card Props
export interface WorkCardProps {
  work: Work;
  index: number;
  createSlug: (title: string) => string;
}

// Navigation Item Props
export interface NavItemProps {
  name: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Filter Props
export interface FilterProps {
  selectedGenre: string;
  selectedPlatform: string;
  selectedYear: string;
  onFilterChange: (type: string, value: string) => void;
  onClearFilters: () => void;
  filters: {
    genres: string[];
    platforms: string[];
    years: number[];
  };
}

// Pagination Props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

// Header Props
export interface HeaderProps {
  transparent?: boolean;
}
