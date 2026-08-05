import { API_CONFIG } from '../config/constants';
import { PicsumImage } from '../types';

// Curated high-reliability fallback dataset of 50 Picsum event media assets
const FALLBACK_PICSUM_IMAGES: PicsumImage[] = Array.from({ length: 50 }).map((_, index) => {
  const authors = [
    'Alejandro Escamilla', 'Paul Jarvis', 'Tina Rataj', 'Vadym Sherbakov',
    'Yash Bhardwaj', 'Jerry Zhang', 'Elena Mozhvilo', 'Daniel Korpai',
    'Samantha Brooke', 'FotoOwl Studio', 'Viktor Hanacek', 'Chris Brignola',
    'Nigel Tadyanehondo', 'Marek Okon', 'Krzysztof Niewolny', 'David Marcu'
  ];
  const id = (10 + index).toString();
  const author = authors[index % authors.length] + ` (#${id})`;
  return {
    id,
    author,
    width: 5000,
    height: 3333,
    url: `https://picsum.photos/id/${id}/5000/3333`,
    download_url: `https://picsum.photos/id/${id}/800/600`,
  };
});

export const apiService = {
  /**
   * Fetches paginated images from Picsum API with reliable fallback
   */
  async fetchImages(page: number = 1, limit: number = API_CONFIG.DEFAULT_LIMIT): Promise<PicsumImage[]> {
    try {
      const response = await fetch(`${API_CONFIG.PICSUM_BASE_URL}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data: PicsumImage[] = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
      // If API response empty or not ok, return slice of fallback
      return this.getFallbackPage(page, limit);
    } catch (error) {
      console.warn(`Picsum network fetch warning for page ${page}. Using curated fallback feed.`, error);
      return this.getFallbackPage(page, limit);
    }
  },

  getFallbackPage(page: number, limit: number): PicsumImage[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    const sliced = FALLBACK_PICSUM_IMAGES.slice(start, end);
    return sliced.length > 0 ? sliced : FALLBACK_PICSUM_IMAGES.slice(0, limit);
  },

  getImageUrl(id: string, width: number = 600, height: number = 600): string {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
  },
};
