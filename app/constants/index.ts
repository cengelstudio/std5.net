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
  WIDTH: 1920,
  HEIGHT: 1080,
  POSTER_RATIO: 2 / 3,
  POSTER_HEIGHT: 216,
  ROWS: 5,
  POSTER_MARGIN: 3,
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

// Navigation Items
export const NAV_ITEMS: readonly NavItem[] = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hakkımızda', path: '/about' },
  { name: 'Portfolyo', path: '/portfolio' },
  { name: 'Stüdyolar', path: '/studios' },
  { name: 'İletişim', path: '/contact' }
] as const;

// Services Data
export const SERVICES: readonly Service[] = [
  {
    title: 'Kurgu & Montaj',
    description: 'Yaratıcı kurgu ve montaj hizmetleriyle hikayenizi en iyi şekilde anlatın.',
    color: COLORS.PRIMARY
  },
  {
    title: 'Ses Tasarımı',
    description: 'Duyguyu güçlendiren profesyonel ses tasarımı ve miksaj.',
    color: COLORS.PRIMARY
  },
  {
    title: 'Renk Düzenleme',
    description: 'Profesyonel color grading ile projelerinize sinematik bir dokunuş katıyoruz.',
    color: COLORS.PRIMARY
  },
  {
    title: 'Görsel Efektler',
    description: 'Görsel efekt ve CGI ile hayal gücünüzü gerçeğe dönüştürüyoruz.',
    color: COLORS.ACCENT
  },
  {
    title: 'Düblaj',
    description: 'Profesyonel dublaj ve seslendirme hizmetleriyle içeriklerinizi uyarlıyoruz.',
    color: COLORS.ACCENT
  },
  {
    title: 'Video Mapping',
    description: 'Etkinlikleriniz için etkileyici video mapping çözümleri.',
    color: COLORS.ACCENT
  },
  {
    title: 'Title Sequence',
    description: 'Dikkat çekici açılış ve jenerik tasarımları.',
    color: COLORS.PRIMARY
  },
  {
    title: 'İnfografik',
    description: 'Bilgiyi görselleştiren yaratıcı infografik animasyonlar.',
    color: COLORS.ACCENT
  }
] as const;

// Stats Data
export const STATS: readonly Stat[] = [
  { number: "250+", label: 'Tamamlanan Proje' },
  { number: "3+", label: 'Yerleşke' },
  { number: "45+", label: 'Stüdyo' },
  { number: "8+", label: 'Yıllık Deneyim' },
] as const;

// Image paths for mosaic
export const MOCK_IMAGES = [
  'image-1.jpg', 'image-2.png', 'image-3.jpg', 'image-4.jpg', 'image-5.jpg',
  'image-6.jpg', 'image-7.jpg', 'image-8.jpg', 'image-9.jpg', 'image-10.jpg',
  'image-11.jpg', 'image-12.webp', 'image-13.jpg', 'image-14.jpg', 'image-15.jpg',
  'image-16.jpg', 'image-17.jpg', 'image-18.jpg', 'image-19.jpg', 'image-20.jpg'
] as const;
