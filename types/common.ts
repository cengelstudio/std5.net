// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

// Animation Types
export interface AnimationVariant {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition?: Record<string, any>;
  viewport?: Record<string, any>;
}

// Filter Types
export type FilterType = 'genre' | 'platform' | 'year';

export interface FilterState {
  selectedGenre: string;
  selectedPlatform: string;
  selectedYear: string;
  searchTerm: string;
}

// Utility Types
export type IconComponent = React.ComponentType<{ className?: string }>;

export interface ServiceIcon {
  [key: string]: IconComponent;
}

// Theme Types
export interface ThemeColors {
  PRIMARY: string;
  ACCENT: string;
  DARKER: string;
  PLACEHOLDER: string;
}

// Configuration Types
export interface MosaicConfig {
  WIDTH: number;
  HEIGHT: number;
  POSTER_RATIO: number;
  POSTER_HEIGHT: number;
  ROWS: number;
  POSTER_MARGIN: number;
  PLACEHOLDER_COLOR: string;
  FALLBACK_TIMEOUT: number;
}

export interface PaginationConfig {
  DEFAULT_LIMIT: number;
  DEFAULT_PAGE: number;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, any>;
}

// Image Types
export interface ImageErrorEvent extends React.SyntheticEvent<HTMLImageElement> {
  target: HTMLImageElement;
}

// Service Types
export interface Service {
  title: string;
  description: string;
  color: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface NavItem {
  name: string;
  path: string;
}
