# STD5 - Post Production Studio Website

A modern, high-performance website for STD5, a leading post-production studio in Istanbul, Turkey. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Netflix-inspired hero section with dynamic mosaic background
- **Performance Optimized**: Built with Next.js 15 and optimized for speed
- **Responsive**: Fully responsive design that works on all devices
- **SEO Optimized**: Comprehensive metadata and structured data
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Animation**: Smooth animations using Framer Motion
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
- **Build Tool**: Turbopack (development)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
std5.net/
├── app/                    # Next.js App Router
│   ├── components/         # Reusable components
│   ├── constants/          # Application constants
│   ├── utils/              # Utility functions
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── data/                   # Static data (JSON files)
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
└── package.json
```

## Key Components

### MosaicBackground
A dynamic canvas-based mosaic background that displays project images in a Netflix-style grid. Features:
- Seeded random generation for consistent layouts
- Image loading with fallbacks
- Performance optimized with memoization
- Responsive design

### Header
A responsive navigation header with:
- Smooth scroll effects
- Mobile menu with animations
- Active page indicators
- Glass morphism effects

### Service Cards
Interactive service cards showcasing STD5's offerings with:
- Hover animations
- Icon integration
- Consistent styling

## Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic route-based code splitting
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Images and components loaded on demand
- **Bundle Optimization**: Tree shaking and dead code elimination

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom theme colors defined in `globals.css`:

```css
:root {
  --std5-primary: #430086;
  --std5-accent: #8b5cf6;
  --std5-dark: #0f0f23;
  --std5-darker: #0a0a1a;
}
```

## Responsive Design

The website is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Animations

Smooth animations powered by Framer Motion:
- Page transitions
- Component entrance animations
- Hover effects
- Loading states

## SEO Features

- Dynamic metadata generation
- Open Graph tags
- Twitter Card support
- Structured data
- Sitemap generation
- Robots.txt

## Admin Panel & Content Management

### Admin Login
- Accessible via /admin/login
- JWT-based session management

### Dashboard
- Content management panel at /admin/dashboard
- Full CRUD operations for Projects (works) and Crew Members (crew) tabs
- Image upload support (JPEG/PNG) for projects and crew members
- PDF CV upload support for crew members
- Uploaded images and CVs are automatically saved to the appropriate directory
- Automatic placeholder is shown if an image fails to load

### API Endpoints
- /api/admin/works: Project CRUD operations (GET, POST, PUT, DELETE)
- /api/admin/crew: Crew member CRUD operations (GET, POST, PUT, DELETE)
- /api/admin/upload: Image and file upload (POST)
- /api/auth/login: Admin login (POST)

### Usage Notes
- Admin panel access requires login
- When uploading images, you can use either a file name or a full path; the system will automatically resolve the correct path
- If an image is missing or broken, a default placeholder icon will be displayed

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)
