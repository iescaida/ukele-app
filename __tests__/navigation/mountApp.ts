import {
  act,
  fireEvent,
  renderRouter,
  waitFor,
} from 'expo-router/testing-library';

/**
 * RNTL 14 `render` is async while expo-router `renderRouter` enables fake timers.
 * Advance timers once so the render promise can settle, then switch to real timers.
 *
 * Auto-cleanup after renderRouter hangs with fake timers — disabled in jest.setup.
 * Run navigation suites in separate Jest processes when isolation is needed.
 */
export async function mountApp(
  options?: Parameters<typeof renderRouter>[1],
) {
  jest.useRealTimers();
  const result = renderRouter('app', options);
  jest.advanceTimersByTime(1);
  const view = await result;
  jest.useRealTimers();
  return { result, view };
}

export async function pressLabel(
  view: Awaited<ReturnType<typeof renderRouter>>,
  label: string,
) {
  await act(async () => {
    fireEvent.press(view.getByLabelText(label));
  });
}

export { waitFor };
