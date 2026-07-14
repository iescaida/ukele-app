import { render } from '@testing-library/react-native';

import { AppText } from '../../src/ui/AppText';
import { Screen } from '../../src/ui/Screen';
import { tokens } from '../../src/theme/tokens';
import { ChordsScreen } from '../../src/features/chords/ChordsScreen';

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

  it('feature stubs compose Screen/AppText instead of raw Views', async () => {
    const view = await render(<ChordsScreen />);

    expect(view.getByLabelText('Chords screen')).toBeTruthy();
    expect(view.getByRole('header').props.children).toBe('Chords');
    expect(view.queryByLabelText(/dark mode/i)).toBeNull();
  });
});
