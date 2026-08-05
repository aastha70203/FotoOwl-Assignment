import { describe, it, expect, beforeEach } from '@jest/globals';
import { useGalleryStore } from '../src/store/useGalleryStore';
import { useThemeStore } from '../src/store/useThemeStore';

describe('Zustand Gallery & Theme Stores', () => {
  beforeEach(() => {
    useGalleryStore.setState({
      images: [
        { id: '1', author: 'Alejandro Escamilla', width: 5000, height: 3333, url: 'https://', download_url: 'https://', isFavorite: false },
        { id: '2', author: 'Nancy Miller', width: 5000, height: 3333, url: 'https://', download_url: 'https://', isFavorite: false },
        { id: '3', author: 'Zack Snyder', width: 5000, height: 3333, url: 'https://', download_url: 'https://', isFavorite: false },
      ],
      favorites: [],
      searchQuery: '',
      categoryFilter: 'ALL',
      sortOrder: 'ID_ASC',
    });
  });

  it('filters images by author search query', () => {
    const store = useGalleryStore.getState();
    store.setSearchQuery('nancy');
    const filtered = useGalleryStore.getState().getFilteredImages();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].author).toBe('Nancy Miller');
  });

  it('filters images by Author A-M category', () => {
    const store = useGalleryStore.getState();
    store.setCategoryFilter('AUTHOR_A_M');
    const filtered = useGalleryStore.getState().getFilteredImages();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].author).toBe('Alejandro Escamilla');
  });

  it('toggles theme store mode between light and dark', () => {
    const themeStore = useThemeStore.getState();
    const initialIsDark = themeStore.isDark;
    themeStore.toggleTheme();
    expect(useThemeStore.getState().isDark).toBe(!initialIsDark);
  });
});
