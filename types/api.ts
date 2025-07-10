// API Response Types
export interface Work {
  id: string;
  title: string;
  description: string;
  prod_year: number;
  genre: string;
  platform: string;
  trailer_embed_url: string;
  gallery: string[];
  image: string;
  client?: string;
}

export interface WorksResponse {
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

// Studio Types
export interface Studio {
  id: string;
  name: string;
  description: string;
  images: string[];
  location?: string;
}

// Team Member Types
export interface TeamMember {
  name: string;
  position: string;
  description: string;
  image: string;
}
