import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  getDefaultUserProgress,
  loadUserProgress,
  type SkillLevel,
} from '../../storage/userProgress';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

export function ProfileScreen() {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(
    getDefaultUserProgress().skillLevel,
  );

  useEffect(() => {
    let cancelled = false;

    void loadUserProgress().then((progress) => {
      if (!cancelled) {
        setSkillLevel(progress.skillLevel);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen style={styles.container} accessibilityLabel="Profile screen">
      <AppText accessibilityRole="header" variant="title">
        Profile
      </AppText>
      <View style={styles.row}>
        <AppText variant="caption">Skill level</AppText>
        <AppText accessibilityLabel="Skill level" variant="body">
          {skillLevel}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
  row: {
    gap: tokens.spacing.xs,
  },
});
