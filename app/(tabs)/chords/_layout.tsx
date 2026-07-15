import { Stack } from 'expo-router';

export default function ChordsLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ title: 'Chords' }}
      />
      <Stack.Screen
        name="[chordId]"
        options={{ title: 'Chord' }}
      />
    </Stack>
  );
}
