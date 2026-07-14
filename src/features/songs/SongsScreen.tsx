import { StyleSheet } from 'react-native';

import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

export function SongsScreen() {
  return (
    <Screen style={styles.container} accessibilityLabel="Songs screen">
      <AppText accessibilityRole="header" variant="title">
        Songs
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
