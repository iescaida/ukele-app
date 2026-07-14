import { StyleSheet, Text, View } from 'react-native';

export function TunerScreen() {
  return (
    <View style={styles.container} accessibilityLabel="Tuner screen">
      <Text accessibilityRole="header">Tuner</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
