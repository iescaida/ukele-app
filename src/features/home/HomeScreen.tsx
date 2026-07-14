import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

const SHORTCUTS = [
  { href: '/chords', label: 'Chords', accessibilityLabel: 'Open Chords shortcut' },
  { href: '/songs', label: 'Songs', accessibilityLabel: 'Open Songs shortcut' },
  { href: '/tuner', label: 'Tuner', accessibilityLabel: 'Open Tuner shortcut' },
] as const;

export function HomeScreen() {
  return (
    <Screen style={styles.container} accessibilityLabel="Home screen">
      <AppText accessibilityRole="header" variant="title">
        Ukele
      </AppText>
      <AppText variant="body" style={styles.subtitle}>
        Your learning hub
      </AppText>

      <View
        accessibilityLabel="Resume progress placeholder"
        style={styles.resume}
      >
        <AppText variant="caption">Resume</AppText>
        <AppText variant="body">No active lesson yet</AppText>
      </View>

      <View style={styles.shortcuts}>
        {SHORTCUTS.map((shortcut) => (
          <Pressable
            key={shortcut.href}
            accessibilityRole="button"
            accessibilityLabel={shortcut.accessibilityLabel}
            onPress={() => router.push(shortcut.href)}
            style={styles.shortcut}
          >
            <AppText variant="body">{shortcut.label}</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
  },
  resume: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    padding: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
  shortcuts: {
    gap: tokens.spacing.sm,
  },
  shortcut: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
});
