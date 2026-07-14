import {
  act,
  fireEvent,
  renderRouter,
  waitFor,
} from 'expo-router/testing-library';

const LINKING_NOISE =
  /linking in multiple places|deep links should only be handled in one place/i;

let consoleErrorSpy: jest.SpyInstance | undefined;

/**
 * Silent known expo-router harness noise when multiple `renderRouter` mounts share
 * a Jest file. Real failures still go through to the console.
 *
 * Do not call RNTL `cleanup()` here — it hangs with expo-router fake timers
 * (see jest.setup dont-cleanup-after-each).
 */
export function silenceRouterLinkingNoise() {
  if (consoleErrorSpy) {
    return;
  }
  const originalError = console.error.bind(console);
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args: unknown[]) => {
      const message = args.map(String).join(' ');
      if (LINKING_NOISE.test(message)) {
        return;
      }
      originalError(...(args as Parameters<typeof console.error>));
    });
}

export function restoreRouterLinkingNoise() {
  consoleErrorSpy?.mockRestore();
  consoleErrorSpy = undefined;
}

/**
 * RNTL 14 `render` is async while expo-router `renderRouter` may enable fake timers.
 * Prefer awaiting the router promise and asserting with `waitFor`.
 */
export async function mountApp(
  options?: Parameters<typeof renderRouter>[1],
) {
  silenceRouterLinkingNoise();
  const result = renderRouter('app', options);
  const view = await result;
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
