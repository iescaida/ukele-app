export const tokens = {
  colors: {
    background: '#ffffff',
    text: '#111111',
    textSecondary: '#555555',
    border: '#e5e5e5',
    accent: '#2563eb',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },
} as const;

export type Tokens = typeof tokens;
