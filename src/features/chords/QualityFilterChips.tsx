import { Pressable, StyleSheet, View } from 'react-native';

import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import type { QualityFilter } from '../../content/chords/types';

const CHIPS: { filter: QualityFilter; label: string }[] = [
  { filter: 'all', label: 'All' },
  { filter: 'major', label: 'Major' },
  { filter: 'minor', label: 'Minor' },
  { filter: 'seventh', label: '7th' },
];

type QualityFilterChipsProps = {
  selected: QualityFilter;
  onSelect: (filter: QualityFilter) => void;
};

export function QualityFilterChips({
  selected,
  onSelect,
}: QualityFilterChipsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {CHIPS.map((chip) => {
        const active = selected === chip.filter;
        return (
          <Pressable
            key={chip.filter}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter ${chip.label}`}
            onPress={() => onSelect(chip.filter)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <AppText
              variant="caption"
              style={active ? styles.chipTextActive : undefined}
            >
              {chip.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
  },
  chipActive: {
    borderColor: tokens.colors.accent,
    backgroundColor: tokens.colors.accent,
  },
  chipTextActive: {
    color: tokens.colors.background,
  },
});
