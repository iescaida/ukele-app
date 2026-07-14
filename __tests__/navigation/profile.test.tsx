import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, renderRouter, waitFor } from 'expo-router/testing-library';

import { saveUserProgress } from '../../src/storage/userProgress';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

async function openProfile() {
  const result = renderRouter('app');
  const view = await result;

  await act(async () => {
    fireEvent.press(view.getByLabelText('Profile'));
    jest.advanceTimersByTime(0);
  });

  return { result, view };
}

describe('Profile progress stub', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('shows default skillLevel from local progress without auth', async () => {
    const { view } = await openProfile();

    expect(view.getByLabelText('Profile screen')).toBeTruthy();
    expect(view.getByLabelText('Skill level')).toHaveTextContent('unknown');
    expect(view.queryByText(/sign in|log in|account/i)).toBeNull();
  });

  it('shows saved skillLevel from local progress offline', async () => {
    await saveUserProgress({
      skillLevel: 'intermediate',
      completedOnboarding: true,
      favoriteChordIds: [],
      favoriteSongIds: [],
      updatedAt: '2026-07-13T12:00:00.000Z',
    });

    const { view } = await openProfile();

    await waitFor(() => {
      expect(view.getByLabelText('Skill level')).toHaveTextContent('intermediate');
    });
    expect(view.queryByText(/sign in|log in|account/i)).toBeNull();
  });

  it('keeps Chords shell empty of catalog quiz and mic UI', async () => {
    const result = renderRouter('app');
    const view = await result;

    await act(async () => {
      fireEvent.press(view.getByLabelText('Chords'));
      jest.advanceTimersByTime(0);
    });

    expect(view.getByLabelText('Chords screen')).toBeTruthy();
    expect(view.getByRole('header')).toHaveTextContent('Chords');
    expect(view.queryByText(/catalog|quiz|coming soon|mic|microphone/i)).toBeNull();
    expect(result.getPathname()).toBe('/chords');
  });
});
