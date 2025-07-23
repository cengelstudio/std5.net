import {
  MosaicConfig,
  ThemeColors,
  PaginationConfig,
  NavItem,
  Service,
  Stat
} from '../../types';

// UI Constants
export const MOSAIC_CONFIG: MosaicConfig = {
  WIDTH: 2560,
  HEIGHT: 1440,
  POSTER_RATIO: 2 / 3,
  POSTER_HEIGHT: 216,
  ROWS: 6,
  POSTER_MARGIN: 1.5,
  PLACEHOLDER_COLOR: '#222',
  FALLBACK_TIMEOUT: 3000
} as const;

export const COLORS: ThemeColors = {
  PRIMARY: '#430086',
  ACCENT: '#8b5cf6',
  DARKER: '#111',
  PLACEHOLDER: '#222'
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 0.8,
  EXTRA_SLOW: 1.0
} as const;

// Pagination
export const PAGINATION: PaginationConfig = {
  DEFAULT_LIMIT: 9,
  DEFAULT_PAGE: 1
} as const;

// Navigation Items - These will be translated using the translation hook
export const NAV_ITEMS: readonly NavItem[] = [
  { name: 'navigation.home', path: '/' },
  { name: 'navigation.about', path: '/about' },
  { name: 'navigation.projects', path: '/projects' },
  { name: 'navigation.locations', path: '/locations' },
  { name: 'navigation.contact', path: '/contact' }
] as const;

// Services Data - These will be translated using the translation hook
export const SERVICES: readonly Service[] = [
  {
    title: 'home.services.editing.title',
    description: 'home.services.editing.description',
    color: COLORS.PRIMARY
  },
  {
    title: 'home.services.soundDesign.title',
    description: 'home.services.soundDesign.description',
    color: COLORS.PRIMARY
  },
  {
    title: 'home.services.colorGrading.title',
    description: 'home.services.colorGrading.description',
    color: COLORS.PRIMARY
  },
  {
    title: 'home.services.vfx.title',
    description: 'home.services.vfx.description',
    color: COLORS.ACCENT
  },
  {
    title: 'home.services.postProduction.title',
    description: 'home.services.postProduction.description',
    color: COLORS.ACCENT
  },
  {
    title: 'home.services.cafe.title',
    description: 'home.services.cafe.description',
    color: COLORS.ACCENT
  }
] as const;

// Stats Data - These will be translated using the translation hook
export const STATS: readonly Stat[] = [
  { number: "250+", label: 'home.stats.completedProjects' },
  { number: "45+", label: 'home.stats.studios' },
  { number: "3", label: 'home.stats.locations' },
  { number: "Dolby Atmos", label: 'home.stats.soundStudio' },
  { number: "HDR Color", label: 'home.stats.colorStudio' },
] as const;

// Image paths for mosaic
export const MOCK_IMAGES = [
  'image-1.jpg', 'image-2.png', 'image-3.jpg', 'image-4.jpg', 'image-5.jpg',
  'image-6.jpg', 'image-7.jpg', 'image-8.jpg', 'image-9.jpg', 'image-10.jpg',
  'image-11.jpg', 'image-12.webp', 'image-13.jpg', 'image-14.jpg', 'image-15.jpg',
  'image-16.jpg', 'image-17.jpg', 'image-18.jpg', 'image-19.jpg', 'image-20.jpg'
] as const;
