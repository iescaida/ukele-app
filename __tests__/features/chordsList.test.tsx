import { act, fireEvent, render } from '@testing-library/react-native';

import { listChords } from '../../src/content/chords/catalog';
import { ChordsListScreen } from '../../src/features/chords/ChordsListScreen';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    push: (...args: unknown[]) => mockPush(...args),
  },
}));

describe('ChordsListScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('shows level sections and quality chips when list opens', async () => {
    const view = await render(<ChordsListScreen />);

    expect(view.getByLabelText('Chords screen')).toBeTruthy();
    expect(view.getByText('Beginner')).toBeTruthy();
    expect(view.getByText('Intermediate')).toBeTruthy();

    expect(view.getByLabelText('Filter All')).toBeTruthy();
    expect(view.getByLabelText('Filter Major')).toBeTruthy();
    expect(view.getByLabelText('Filter Minor')).toBeTruthy();
    expect(view.getByLabelText('Filter 7th')).toBeTruthy();
  });

  it('narrows to minor chords when Minor chip is activated', async () => {
    const view = await render(<ChordsListScreen />);
    const minors = listChords().filter((c) => c.quality === 'minor');
    const majors = listChords().filter((c) => c.quality === 'major');

    expect(minors.length).toBeGreaterThan(0);
    expect(majors.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.press(view.getByLabelText('Filter Minor'));
    });

    for (const chord of minors) {
      expect(view.getByLabelText(`Open ${chord.displayName} chord`)).toBeTruthy();
    }
    for (const chord of majors) {
      expect(view.queryByLabelText(`Open ${chord.displayName} chord`)).toBeNull();
    }
  });

  it('gives each row an accessible chord name and navigates by id', async () => {
    const view = await render(<ChordsListScreen />);
    const chords = listChords();

    expect(chords.length).toBeGreaterThan(0);

    for (const chord of chords) {
      expect(view.getByLabelText(`Open ${chord.displayName} chord`)).toBeTruthy();
    }

    fireEvent.press(view.getByLabelText('Open C Major chord'));
    expect(mockPush).toHaveBeenCalledWith('/chords/C');
  });

  it('does not show favorites or search UI', async () => {
    const view = await render(<ChordsListScreen />);

    expect(view.queryByText(/favorite/i)).toBeNull();
    expect(view.queryByLabelText(/favorite/i)).toBeNull();
    expect(view.queryByText(/search/i)).toBeNull();
    expect(view.queryByLabelText(/search/i)).toBeNull();
    expect(view.queryByPlaceholderText(/search/i)).toBeNull();
  });
});
