import { Text, type TextProps, StyleSheet } from 'react-native';

import { tokens } from '../theme/tokens';

type AppTextProps = TextProps & {
  variant?: 'title' | 'body' | 'caption';
};

export function AppText({
  variant = 'body',
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text style={[styles.base, styles[variant], style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: tokens.colors.text,
  },
  title: tokens.typography.title,
  body: tokens.typography.body,
  caption: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary,
  },
});
