import { useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { getChordById } from '../../../src/content/chords/catalog';
import { ChordDetailScreen } from '../../../src/features/chords/ChordDetailScreen';

export default function ChordDetailRoute() {
  const navigation = useNavigation();
  const { chordId } = useLocalSearchParams<{ chordId: string }>();
  const chord = typeof chordId === 'string' ? getChordById(chordId) : undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: chord?.displayName ?? 'Chord',
    });
  }, [navigation, chord?.displayName]);

  return <ChordDetailScreen />;
}
