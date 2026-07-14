import { StyleSheet } from 'react-native';

import { tokens } from '../../theme/tokens';
import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

export function HomeScreen() {
  return (
    <Screen style={styles.container} accessibilityLabel="Home screen">
      <AppText accessibilityRole="header" variant="title">
        Home
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
