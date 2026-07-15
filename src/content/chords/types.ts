export type ChordQuality = 'major' | 'minor' | 'seventh';

export type ChordLevel = 'beginner' | 'intermediate';

export type ChordBarre = {
  fret: number;
  fromString: number;
  toString: number;
};

export type Chord = {
  id: string;
  name: string;
  displayName: string;
  quality: ChordQuality;
  root: string;
  level: ChordLevel;
  tags: string[];
  /** Frets L→R G–C–E–A; 0 = open, -1 = mute; index 0 is G */
  frets: [number, number, number, number];
  /** Finger numbers L→R; 0 = none; 1–4 on fretted dots */
  fingers: [number, number, number, number];
  barres: ChordBarre[];
  baseFret: number;
  tuning: 'gcea-high-g';
  tips?: string;
};

export type QualityFilter = 'all' | ChordQuality;
