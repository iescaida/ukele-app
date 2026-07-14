import {
  act,
  fireEvent,
  renderRouter,
  waitFor,
} from 'expo-router/testing-library';

/**
 * RNTL 14 `render` is async while expo-router `renderRouter` may enable fake timers.
 * Prefer awaiting the router promise and asserting with `waitFor` — avoid nested
 * `advanceTimersByTime` inside `act`, which triggers React act warnings.
 */
export async function mountApp(
  options?: Parameters<typeof renderRouter>[1],
) {
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
