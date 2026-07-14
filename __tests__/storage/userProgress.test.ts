import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getDefaultUserProgress,
  loadUserProgress,
  saveUserProgress,
  USER_PROGRESS_KEY,
  type UserProgress,
} from '../../src/storage/userProgress';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

describe('userProgress storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns first-launch defaults with skillLevel unknown', async () => {
    const progress = await loadUserProgress();

    expect(progress).toEqual(getDefaultUserProgress());
    expect(progress.skillLevel).toBe('unknown');
    expect(progress.completedOnboarding).toBe(false);
    expect(progress.favoriteChordIds).toEqual([]);
    expect(progress.favoriteSongIds).toEqual([]);
    expect(progress.updatedAt).toBeNull();
  });

  it('round-trips saved UserProgress fields', async () => {
    const saved: UserProgress = {
      skillLevel: 'beginner',
      completedOnboarding: true,
      favoriteChordIds: ['C', 'G'],
      favoriteSongIds: ['song-1'],
      updatedAt: '2026-07-13T12:00:00.000Z',
    };

    await saveUserProgress(saved);
    const loaded = await loadUserProgress();

    expect(loaded).toEqual(saved);
  });

  it('falls back to defaults when stored JSON is corrupt', async () => {
    await AsyncStorage.setItem(USER_PROGRESS_KEY, '{not-json');

    const progress = await loadUserProgress();

    expect(progress).toEqual(getDefaultUserProgress());
    expect(progress.skillLevel).toBe('unknown');
  });

  it('falls back to defaults when stored JSON is unreadable shape', async () => {
    await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify({ skillLevel: 123 }));

    const progress = await loadUserProgress();

    expect(progress).toEqual(getDefaultUserProgress());
  });
});
