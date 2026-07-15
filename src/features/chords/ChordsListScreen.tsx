import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import {
  filterChordsByQuality,
  groupChordsByLevel,
  listChords,
  type ChordLevel,
  type QualityFilter,
} from '../../content/chords/catalog';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';
import { QualityFilterChips } from './QualityFilterChips';

const LEVEL_LABELS: Record<ChordLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
};

export function ChordsListScreen() {
  const [quality, setQuality] = useState<QualityFilter>('all');

  const sections = useMemo(() => {
    const filtered = filterChordsByQuality(listChords(), quality);
    return groupChordsByLevel(filtered);
  }, [quality]);

  return (
    <Screen style={styles.screen} accessibilityLabel="Chords screen">
      <QualityFilterChips selected={quality} onSelect={setQuality} />

      <ScrollView contentContainerStyle={styles.list}>
        {(Object.keys(sections) as ChordLevel[]).map((level) => {
          const chords = sections[level];
          if (!chords?.length) {
            return null;
          }

          return (
            <View key={level} style={styles.section}>
              <AppText accessibilityRole="header" variant="body" style={styles.sectionTitle}>
                {LEVEL_LABELS[level]}
              </AppText>
              {chords.map((chord) => (
                <Pressable
                  key={chord.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${chord.displayName} chord`}
                  onPress={() => router.push(`/chords/${chord.id}`)}
                  style={styles.row}
                >
                  <AppText variant="body">{chord.displayName}</AppText>
                  <AppText variant="caption">{chord.name}</AppText>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: tokens.spacing.md,
  },
  list: {
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  row: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    gap: tokens.spacing.xs,
  },
});
