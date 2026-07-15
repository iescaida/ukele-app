import chordsData from './chords.json';
import type { Chord, ChordLevel, ChordQuality, QualityFilter } from './types';

export type { Chord, ChordBarre, ChordLevel, ChordQuality, QualityFilter } from './types';

const LEVEL_ORDER: ChordLevel[] = ['beginner', 'intermediate'];

const chords: Chord[] = chordsData as Chord[];

export function listChords(): Chord[] {
  return [...chords];
}

export function getChordById(id: string): Chord | undefined {
  return chords.find((chord) => chord.id === id);
}

export function groupChordsByLevel(
  input: Chord[] = listChords(),
): Partial<Record<ChordLevel, Chord[]>> {
  const grouped: Partial<Record<ChordLevel, Chord[]>> = {};

  for (const level of LEVEL_ORDER) {
    const matching = input.filter((chord) => chord.level === level);
    if (matching.length > 0) {
      grouped[level] = matching;
    }
  }

  return grouped;
}

export function filterChordsByQuality(
  input: Chord[],
  quality: QualityFilter,
): Chord[] {
  if (quality === 'all') {
    return [...input];
  }
  return input.filter((chord) => chord.quality === quality);
}

export function isChordQuality(value: string): value is ChordQuality {
  return value === 'major' || value === 'minor' || value === 'seventh';
}
