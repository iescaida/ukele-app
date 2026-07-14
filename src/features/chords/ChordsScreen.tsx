import { StyleSheet, Text, View } from 'react-native';

export function ChordsScreen() {
  return (
    <View style={styles.container} accessibilityLabel="Chords screen">
      <Text accessibilityRole="header">Chords</Text>
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
