import { render } from '@testing-library/react-native';

import { AppText } from '../../src/ui/AppText';
import { Screen } from '../../src/ui/Screen';
import { tokens } from '../../src/theme/tokens';
import { ChordsListScreen } from '../../src/features/chords/ChordsListScreen';
import { SongsScreen } from '../../src/features/songs/SongsScreen';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('theme/ui primitives', () => {
  it('exports light-only color tokens without a dark palette', () => {
    expect(tokens.colors.background).toBe('#ffffff');
    expect(tokens.colors.text).toBeTruthy();
    expect(tokens.spacing.md).toBeGreaterThan(0);
    expect(tokens.typography.body.fontSize).toBeGreaterThan(0);
    expect(tokens).not.toHaveProperty('dark');
    expect(tokens.colors).not.toHaveProperty('darkBackground');
  });

  it('Screen and AppText render light content and reject dark-mode toggles', async () => {
    const view = await render(
      <Screen testID="screen">
        <AppText accessibilityRole="header">Light title</AppText>
      </Screen>,
    );

    expect(view.getByTestId('screen')).toBeTruthy();
    expect(view.getByText('Light title')).toBeTruthy();
    expect(view.queryByLabelText(/dark mode/i)).toBeNull();
    expect(view.queryByText(/dark mode/i)).toBeNull();
  });

  it('feature screens compose Screen/AppText instead of raw Views', async () => {
    const chords = await render(<ChordsListScreen />);
    expect(chords.getByLabelText('Chords screen')).toBeTruthy();
    expect(chords.queryByLabelText(/dark mode/i)).toBeNull();

    const songs = await render(<SongsScreen />);
    expect(songs.getByLabelText('Songs screen')).toBeTruthy();
    expect(songs.getByRole('header').props.children).toBe('Songs');
  });
});
