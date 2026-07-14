import { StyleSheet } from 'react-native';

import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

export function ChordsScreen() {
  return (
    <Screen style={styles.container} accessibilityLabel="Chords screen">
      <AppText accessibilityRole="header" variant="title">
        Chords
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.md,
  },
});
