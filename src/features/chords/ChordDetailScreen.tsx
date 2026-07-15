import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { getChordById, type ChordQuality } from '../../content/chords/catalog';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';
import { ChordDiagram } from './ChordDiagram';

const QUALITY_LABELS: Record<ChordQuality, string> = {
  major: 'Major',
  minor: 'Minor',
  seventh: '7th',
};

function chordIdFromParams(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  return undefined;
}

export function ChordDetailScreen() {
  const params = useLocalSearchParams<{ chordId?: string | string[] }>();
  const chordId = chordIdFromParams(params.chordId);
  const chord = chordId ? getChordById(chordId) : undefined;

  if (!chord) {
    return (
      <Screen style={styles.center} accessibilityLabel="Chord detail screen">
        <AppText accessibilityRole="header" variant="title">
          Chord not found
        </AppText>
        <AppText variant="body" style={styles.meta}>
          This chord is unavailable in the offline catalog.
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to chords list"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AppText variant="body">Back to list</AppText>
        </Pressable>
      </Screen>
    );
  }

  const qualityLabel = QUALITY_LABELS[chord.quality];
  const levelLabel =
    chord.level === 'beginner' ? 'Beginner' : 'Intermediate';

  return (
    <Screen style={styles.screen} accessibilityLabel="Chord detail screen">
      <AppText accessibilityRole="header" variant="title">
        {chord.displayName}
      </AppText>
      <AppText variant="caption" style={styles.meta}>
        {qualityLabel} · {levelLabel} · High-G GCEA
      </AppText>

      <View style={styles.diagram}>
        <ChordDiagram chord={chord} />
      </View>

      {chord.tips ? (
        <View style={styles.tips}>
          <AppText variant="caption">Tip</AppText>
          <AppText variant="body">{chord.tips}</AppText>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: tokens.spacing.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
  },
  meta: {
    color: tokens.colors.textSecondary,
  },
  diagram: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
  },
  tips: {
    gap: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    padding: tokens.spacing.md,
  },
  backButton: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
  },
});
