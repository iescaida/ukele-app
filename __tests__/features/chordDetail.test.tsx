import { act, fireEvent, render } from '@testing-library/react-native';

import { getChordById } from '../../src/content/chords/catalog';
import { ChordDetailScreen } from '../../src/features/chords/ChordDetailScreen';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: (...args: unknown[]) => mockBack(...args),
  },
}));

const { useLocalSearchParams } = jest.requireMock('expo-router') as {
  useLocalSearchParams: jest.Mock;
};

describe('ChordDetailScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    useLocalSearchParams.mockReset();
  });

  it('shows diagram, English name/meta, and tips for a known chord', async () => {
    useLocalSearchParams.mockReturnValue({ chordId: 'C' });
    const chord = getChordById('C');
    expect(chord).toBeDefined();

    const view = await render(<ChordDetailScreen />);

    expect(view.getByLabelText('Chord detail screen')).toBeTruthy();
    expect(view.getByText(chord!.displayName)).toBeTruthy();
    expect(view.getByLabelText(`Chord diagram for ${chord!.displayName}`)).toBeTruthy();
    expect(view.getByText(/Major · Beginner/i)).toBeTruthy();
    if (chord!.tips) {
      expect(view.getByText(chord!.tips)).toBeTruthy();
    }
  });

  it('fails safely for unknown chord id and offers return to list', async () => {
    useLocalSearchParams.mockReturnValue({ chordId: 'not-a-real-chord' });

    const view = await render(<ChordDetailScreen />);

    expect(view.getByLabelText('Chord detail screen')).toBeTruthy();
    expect(view.queryByLabelText(/Chord diagram for/i)).toBeNull();
    expect(view.getByText('Chord not found')).toBeTruthy();
    expect(view.getByText(/unavailable/i)).toBeTruthy();

    const backControl = view.getByLabelText(/back to chords|return to list/i);
    expect(backControl).toBeTruthy();

    await act(async () => {
      fireEvent.press(backControl);
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders a seventh chord with English quality meta', async () => {
    useLocalSearchParams.mockReturnValue({ chordId: 'G7' });
    const chord = getChordById('G7');
    expect(chord).toBeDefined();

    const view = await render(<ChordDetailScreen />);

    expect(view.getByText(chord!.displayName)).toBeTruthy();
    expect(view.getByLabelText(`Chord diagram for ${chord!.displayName}`)).toBeTruthy();
    expect(view.getByText(/7th · Beginner/i)).toBeTruthy();
  });
});
