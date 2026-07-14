import { StyleSheet, Text, View } from 'react-native';

export function SongsScreen() {
  return (
    <View style={styles.container} accessibilityLabel="Songs screen">
      <Text accessibilityRole="header">Songs</Text>
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
