import { router } from 'expo-router';
import { act } from 'expo-router/testing-library';

import {
  mountApp,
  pressLabel,
  restoreRouterLinkingNoise,
  waitFor,
} from '../../src/testing/mountApp';

afterEach(() => {
  jest.useRealTimers();
});

afterAll(() => {
  restoreRouterLinkingNoise();
});

describe('Chords nested stack', () => {
  it('opens list from Chords tab, pushes detail, and returns on back with tab bar', async () => {
    const { result, view } = await mountApp();

    await pressLabel(view, 'Chords');

    await waitFor(() => {
      expect(view.getByLabelText('Chords screen')).toBeTruthy();
      expect(result.getPathname()).toBe('/chords');
    });

    expect(view.getByLabelText('Open C Major chord')).toBeTruthy();

    await pressLabel(view, 'Open C Major chord');

    await waitFor(() => {
      expect(view.getByLabelText('Chord detail screen')).toBeTruthy();
      expect(view.getByLabelText('Chord diagram for C Major')).toBeTruthy();
      expect(result.getPathname()).toBe('/chords/C');
    });

    expect(view.getByLabelText('Home')).toBeTruthy();
    expect(view.getByLabelText('Songs')).toBeTruthy();
    expect(view.getByLabelText('Tuner')).toBeTruthy();

    await act(async () => {
      router.back();
    });

    await waitFor(() => {
      expect(view.getByLabelText('Chords screen')).toBeTruthy();
      expect(result.getPathname()).toBe('/chords');
    });
  });
});
