import { mountApp, pressLabel, waitFor } from '../../src/testing/mountApp';

const TAB_LABELS = ['Home', 'Chords', 'Songs', 'Tuner', 'Profile'] as const;

afterEach(() => {
  jest.useRealTimers();
});

describe('JS Tabs shell', () => {
  it('defaults to Home with five peer tabs and Home Chords shortcut to catalog', async () => {
    const { result, view } = await mountApp();

    expect(result.getPathname()).toBe('/');
    expect(view.getByLabelText('Home screen')).toBeTruthy();

    for (const label of TAB_LABELS) {
      expect(view.getByLabelText(label)).toBeTruthy();
    }

    expect(view.getByLabelText('Resume progress placeholder')).toBeTruthy();
    expect(view.getByLabelText('Open Chords shortcut')).toBeTruthy();
    expect(view.getByLabelText('Open Songs shortcut')).toBeTruthy();
    expect(view.getByLabelText('Open Tuner shortcut')).toBeTruthy();

    await pressLabel(view, 'Open Chords shortcut');

    await waitFor(() => {
      expect(view.getByLabelText('Chords screen')).toBeTruthy();
      expect(result.getPathname()).toBe('/chords');
    });

    expect(view.getByLabelText('Filter All')).toBeTruthy();
    expect(view.getByLabelText('Open C Major chord')).toBeTruthy();
  });

  it('opens Songs as an empty shell', async () => {
    const { view } = await mountApp({ initialUrl: '/songs' });
    expect(view.getByLabelText('Songs screen')).toBeTruthy();
    expect(view.queryByText(/mic|microphone|audio|record/i)).toBeNull();
  });

  it('opens Tuner as an empty shell', async () => {
    const { view } = await mountApp({ initialUrl: '/tuner' });
    expect(view.getByLabelText('Tuner screen')).toBeTruthy();
    expect(view.queryByText(/mic|microphone|audio|record/i)).toBeNull();
  });

  it('opens Chords catalog from the tab bar', async () => {
    const { view } = await mountApp();

    await pressLabel(view, 'Chords');
    expect(view.getByLabelText('Chords screen')).toBeTruthy();
    expect(view.getByLabelText('Filter All')).toBeTruthy();
    expect(view.getByLabelText('Open C Major chord')).toBeTruthy();
  });

  it('opens Profile screen', async () => {
    const { view } = await mountApp({ initialUrl: '/profile' });
    expect(view.getByLabelText('Profile screen')).toBeTruthy();
  });
});
