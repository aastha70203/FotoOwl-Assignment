import { create } from 'zustand';
import { PicsumImage, FilterCategory, SortOrder } from '../types';
import { apiService } from '../services/apiService';
import { storageService } from '../services/storageService';

const INITIAL_FALLBACK = apiService.getFallbackPage(1, 30);

interface GalleryState {
  images: PicsumImage[];
  favorites: string[]; // Set of Image IDs
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;

  // Search & Filter state
  searchQuery: string;
  categoryFilter: FilterCategory;
  sortOrder: SortOrder;

  // Actions
  initializeGallery: () => Promise<void>;
  fetchInitialImages: () => Promise<void>;
  fetchMoreImages: () => Promise<void>;
  refreshGallery: () => Promise<void>;
  uploadPhoto: (photo: PicsumImage) => Promise<boolean>;
  toggleFavorite: (imageId: string | number) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: FilterCategory) => void;
  setSortOrder: (order: SortOrder) => void;
  getFilteredImages: () => PicsumImage[];
  getFavoriteImages: () => PicsumImage[];
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: INITIAL_FALLBACK,
  favorites: [],
  page: 1,
  isLoading: false, // Set false for 0ms instant display of local curated fallback feed
  isRefreshing: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,

  searchQuery: '',
  categoryFilter: 'ALL',
  sortOrder: 'ID_ASC',

  initializeGallery: async () => {
    try {
      // 1. Read favorites & uploaded photos asynchronously
      const storedFavs = await storageService.getFavorites();
      const favSet = new Set(storedFavs.map(id => String(id)));
      const communityPhotos = await storageService.getUploadedPhotos();

      const combined = [...communityPhotos, ...get().images];
      const deduplicated = Array.from(new Set(combined.map(i => String(i.id))))
        .map(id => combined.find(i => String(i.id) === id)!);

      const updatedImages = deduplicated.map(img => ({
        ...img,
        isFavorite: favSet.has(String(img.id)),
      }));

      // Instant state hydration
      set({ favorites: storedFavs.map(id => String(id)), images: updatedImages, isLoading: false });

      // Non-blocking background network refresh
      get().fetchInitialImages().catch(() => {});
    } catch (e) {
      console.warn('Error in initializeGallery:', e);
      set({ isLoading: false });
    }
  },

  fetchInitialImages: async () => {
    set({ error: null });
    try {
      const data = await apiService.fetchImages(1, 30);
      const favSet = new Set(get().favorites.map(id => String(id)));
      const communityPhotos = await storageService.getUploadedPhotos();

      const fetched = data && data.length > 0 ? data : INITIAL_FALLBACK;
      const combined = [...communityPhotos, ...fetched];
      const deduplicated = Array.from(new Set(combined.map(i => String(i.id))))
        .map(id => combined.find(i => String(i.id) === id)!);

      const formatted = deduplicated.map(img => ({
        ...img,
        isFavorite: favSet.has(String(img.id)),
      }));

      set({
        images: formatted,
        page: 1,
        isLoading: false,
        hasMore: true,
      });
    } catch (err: any) {
      const favSet = new Set(get().favorites.map(id => String(id)));
      const communityPhotos = await storageService.getUploadedPhotos();
      const combined = [...communityPhotos, ...INITIAL_FALLBACK];

      const formatted = combined.map(img => ({
        ...img,
        isFavorite: favSet.has(String(img.id)),
      }));

      set({
        images: formatted,
        page: 1,
        isLoading: false,
        hasMore: true,
      });
    }
  },

  uploadPhoto: async (newPhoto: PicsumImage) => {
    try {
      await storageService.saveUploadedPhoto(newPhoto);

      const { images, favorites } = get();
      const favSet = new Set(favorites.map(id => String(id)));
      const updatedPhoto = {
        ...newPhoto,
        isFavorite: favSet.has(String(newPhoto.id)),
      };

      set({ images: [updatedPhoto, ...images] });
      return true;
    } catch (error) {
      console.error('Failed to upload photo:', error);
      return false;
    }
  },

  fetchMoreImages: async () => {
    const { isLoading, isLoadingMore, hasMore, page, images, favorites } = get();
    if (isLoading || isLoadingMore || !hasMore) return;

    set({ isLoadingMore: true });
    const nextPage = page + 1;

    try {
      const data = await apiService.fetchImages(nextPage, 20);
      if (!data || data.length === 0) {
        set({ hasMore: false, isLoadingMore: false });
        return;
      }

      const favSet = new Set(favorites.map(id => String(id)));
      const existingIds = new Set(images.map(i => String(i.id)));
      const newImages = data
        .filter(img => !existingIds.has(String(img.id)))
        .map(img => ({
          ...img,
          isFavorite: favSet.has(String(img.id)),
        }));

      set({
        images: [...images, ...newImages],
        page: nextPage,
        isLoadingMore: false,
        hasMore: true,
      });
    } catch (err) {
      set({ isLoadingMore: false });
    }
  },

  refreshGallery: async () => {
    set({ isRefreshing: true, error: null });
    try {
      const data = await apiService.fetchImages(1, 30);
      const favSet = new Set(get().favorites.map(id => String(id)));
      const communityPhotos = await storageService.getUploadedPhotos();
      const combined = [...communityPhotos, ...(data && data.length > 0 ? data : INITIAL_FALLBACK)];

      const formatted = combined.map(img => ({
        ...img,
        isFavorite: favSet.has(String(img.id)),
      }));

      set({
        images: formatted,
        page: 1,
        isRefreshing: false,
        hasMore: true,
      });
    } catch (err: any) {
      set({
        isRefreshing: false,
      });
    }
  },

  toggleFavorite: (imageId: string | number) => {
    const idStr = String(imageId);
    const { favorites, images } = get();
    const isFav = favorites.some(id => String(id) === idStr);
    const newFavs = isFav
      ? favorites.filter(id => String(id) !== idStr)
      : [...favorites, idStr];

    const favSet = new Set(newFavs.map(id => String(id)));
    const updatedImages = images.map(img => ({
      ...img,
      isFavorite: favSet.has(String(img.id)),
    }));

    set({ favorites: newFavs, images: updatedImages });
    storageService.saveFavorites(newFavs).catch(err => {
      console.error('Failed to save favorites:', err);
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setCategoryFilter: (category: FilterCategory) => {
    set({ categoryFilter: category });
  },

  setSortOrder: (order: SortOrder) => {
    set({ sortOrder: order });
  },

  getFilteredImages: () => {
    const { images, searchQuery, categoryFilter, sortOrder, favorites } = get();
    const favSet = new Set(favorites.map(id => String(id)));

    let result = Array.isArray(images)
      ? images.map(img => ({
          ...img,
          isFavorite: favSet.has(String(img.id)),
        }))
      : [];

    // 1. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(img => {
        if (!img) return false;
        const authorMatch = img.author && img.author.toLowerCase().includes(q);
        const tagMatch = img.eventTag && img.eventTag.toLowerCase().includes(q);
        return authorMatch || tagMatch;
      });
    }

    // 2. Category Filter
    if (categoryFilter === 'COMMUNITY_UPLOADS') {
      result = result.filter(img => img && img.isCommunityUpload);
    } else if (categoryFilter === 'AUTHOR_A_M') {
      result = result.filter(img => {
        if (!img || !img.author) return false;
        const firstLetter = img.author.trim().charAt(0).toUpperCase();
        return firstLetter >= 'A' && firstLetter <= 'M';
      });
    } else if (categoryFilter === 'AUTHOR_N_Z') {
      result = result.filter(img => {
        if (!img || !img.author) return false;
        const firstLetter = img.author.trim().charAt(0).toUpperCase();
        return firstLetter >= 'N' && firstLetter <= 'Z';
      });
    } else if (categoryFilter === 'FAVORITES_ONLY') {
      result = result.filter(img => img && favSet.has(String(img.id)));
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (!a || !b) return 0;
      if (sortOrder === 'ID_ASC') return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
      if (sortOrder === 'ID_DESC') return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
      if (sortOrder === 'AUTHOR_ASC') return a.author.localeCompare(b.author);
      if (sortOrder === 'AUTHOR_DESC') return b.author.localeCompare(a.author);
      return 0;
    });

    return result;
  },

  getFavoriteImages: () => {
    const { images, favorites } = get();
    const favSet = new Set(favorites.map(id => String(id)));
    return images
      .filter(img => favSet.has(String(img.id)))
      .map(img => ({ ...img, isFavorite: true }));
  },
}));
