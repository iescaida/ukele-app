import { act, fireEvent, renderRouter, waitFor } from 'expo-router/testing-library';

const TAB_LABELS = ['Home', 'Chords', 'Songs', 'Tuner', 'Profile'] as const;

const TAB_SCREENS = [
  ['Chords', 'Chords screen'],
  ['Songs', 'Songs screen'],
  ['Tuner', 'Tuner screen'],
  ['Profile', 'Profile screen'],
  ['Home', 'Home screen'],
] as const;

async function pressTab(
  view: Awaited<ReturnType<typeof renderRouter>>,
  label: string,
) {
  await act(async () => {
    fireEvent.press(view.getByLabelText(label));
  });
}

describe('JS Tabs shell', () => {
  it('defaults to Home at pathname / and exposes five peer tabs', async () => {
    const result = renderRouter('app');
    const view = await result;

    expect(result.getPathname()).toBe('/');
    expect(view.getByLabelText('Home screen')).toBeTruthy();

    for (const label of TAB_LABELS) {
      expect(view.getByLabelText(label)).toBeTruthy();
    }
  });

  it('reaches each peer tab screen by title without mic or audio UI', async () => {
    const result = renderRouter('app');
    const view = await result;

    for (const [tabLabel, screenLabel] of TAB_SCREENS) {
      await pressTab(view, tabLabel);

      expect(view.getByLabelText(screenLabel)).toBeTruthy();
      expect(view.queryByText(/mic|microphone|audio|record/i)).toBeNull();
      expect(view.queryByLabelText(/dark mode/i)).toBeNull();
      expect(view.queryByText(/dark mode/i)).toBeNull();
    }

    expect(result.getPathname()).toBe('/');
  });
});

describe('Home learning hub', () => {
  it('shows resume placeholder and feature shortcuts on Home', async () => {
    const result = renderRouter('app');
    const view = await result;

    expect(view.getByLabelText('Home screen')).toBeTruthy();
    expect(view.getByLabelText('Resume progress placeholder')).toBeTruthy();
    expect(view.getByLabelText('Open Chords shortcut')).toBeTruthy();
    expect(view.getByLabelText('Open Songs shortcut')).toBeTruthy();
    expect(view.getByLabelText('Open Tuner shortcut')).toBeTruthy();
  });

  it('navigates to Chords when the Chords shortcut is pressed', async () => {
    const result = renderRouter('app');
    const view = await result;

    jest.useFakeTimers();
    await act(async () => {
      fireEvent.press(view.getByLabelText('Open Chords shortcut'));
    });
    jest.useRealTimers();

    await waitFor(() => {
      expect(view.getByLabelText('Chords screen')).toBeTruthy();
      expect(result.getPathname()).toBe('/chords');
    });
  });
});
