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

// Navigation Items
export const NAV_ITEMS: readonly NavItem[] = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Hakkımızda', path: '/about' },
  { name: 'Projeler', path: '/projects' },
  { name: 'Yerleşkeler', path: '/locations' },
  { name: 'İletişim', path: '/contact' }
] as const;

// Services Data
export const SERVICES: readonly Service[] = [
  {
    title: 'Kurgu',
    description: 'Alanında uzman ekibimize projenizi teslim edebilir ya da kendi ekibiniz için kurgu odalarımızdan yararlanabilirsiniz.\nEditShare ve daha fazlası',
    color: COLORS.PRIMARY
  },
  {
    title: 'Ses Tasarımı ve Dublaj',
    description: 'Türkiye\'nin en iyi Ses Mühendisleri projenize son dokunuşu yapsın.\nDolby Atmos ve daha fazlası',
    color: COLORS.PRIMARY
  },
  {
    title: 'Renk Tasarımı',
    description: 'En iyi Coloristleri en iyi teknolojiyle buluşturuyoruz.\nHDR Color ve daha fazlası',
    color: COLORS.PRIMARY
  },
  {
    title: 'Görsel Efektler',
    description: 'Görsel efekt ve CGI ile hayal gücünüzü gerçeğe dönüştürüyoruz.',
    color: COLORS.ACCENT
  },
  {
    title: 'Özel Post Setleri',
    description: 'Dizinizi yayına yetiştirmeniz gerektiğini anlıyor ve sizi en yeni Mac Studio ile desteklediğimiz Post Prodüksiyon odalarımıza bekliyoruz.',
    color: COLORS.ACCENT
  },
  {
    title: 'Kafe',
    description: 'Ekibinizin ve ekibimizin konforu bizim için çok önemli!!!\nHocam o sahne bağlanmıyorsa gelin bir kahve ikram edelim.',
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
