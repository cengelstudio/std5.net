import { ImageErrorEvent } from '../../types';

// String utilities
export const createSlug = (title: string): string => {
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

// Image utilities
export const generatePlaceholderSVG = (
  width: number,
  height: number,
  text: string,
  bgColor: string = '#430086'
): string => {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="white" font-size="${Math.min(width, height) / 15}">${text}</text>
    </svg>`
  )}`;
};

export const handleImageError = (
  e: ImageErrorEvent,
  fallbackText: string,
  width: number = 300,
  height: number = 450
) => {
  const target = e.target;
  target.src = generatePlaceholderSVG(width, height, fallbackText);
};

// Animation utilities
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8 }
};

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};


