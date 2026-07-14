import { render, screen } from '@testing-library/react-native';

import App from '../App';

describe('App', () => {
  it('renders the app title and subtitle', async () => {
    await render(<App />);

    expect(screen.getByText('ukele-app')).toBeTruthy();
    expect(screen.getByText('Expo + TypeScript')).toBeTruthy();
  });
});
