import { StyleSheet } from 'react-native';

import { AppText } from '../../ui/AppText';
import { Screen } from '../../ui/Screen';

export function TunerScreen() {
  return (
    <Screen style={styles.container} accessibilityLabel="Tuner screen">
      <AppText accessibilityRole="header" variant="title">
        Tuner
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
