import {
  filterChordsByQuality,
  getChordById,
  groupChordsByLevel,
  listChords,
  type Chord,
  type ChordQuality,
} from '../../src/content/chords/catalog';

const REQUIRED_FIELDS: (keyof Chord)[] = [
  'id',
  'name',
  'displayName',
  'quality',
  'root',
  'level',
  'tags',
  'frets',
  'fingers',
  'barres',
  'baseFret',
  'tuning',
];

describe('chords catalog', () => {
  it('listChords returns 12–20 high-G GCEA chords with required fields', () => {
    const chords = listChords();

    expect(chords.length).toBeGreaterThanOrEqual(12);
    expect(chords.length).toBeLessThanOrEqual(20);

    for (const chord of chords) {
      for (const field of REQUIRED_FIELDS) {
        expect(chord[field]).toBeDefined();
      }
      expect(chord.tuning).toBe('gcea-high-g');
      expect(chord.frets).toHaveLength(4);
      expect(chord.fingers).toHaveLength(4);
      expect(chord.baseFret).toBeGreaterThanOrEqual(1);
    }

    const ids = chords.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getChordById returns C and absence for unknown without crash', () => {
    const c = getChordById('C');
    expect(c).toBeDefined();
    expect(c?.id).toBe('C');
    expect(c?.name).toBe('C');
    expect(c?.displayName).toMatch(/C/);
    expect(c?.tuning).toBe('gcea-high-g');
    expect(c?.frets[0]).toBeDefined();

    expect(getChordById('does-not-exist')).toBeUndefined();
    expect(getChordById('')).toBeUndefined();
  });

  it('groups by level with only present levels in stable order', () => {
    const grouped = groupChordsByLevel(listChords());
    const levels = Object.keys(grouped);

    expect(levels.length).toBeGreaterThanOrEqual(1);
    expect(levels).toEqual([...levels].sort((a, b) => {
      const order = ['beginner', 'intermediate'];
      return order.indexOf(a) - order.indexOf(b);
    }));

    for (const level of levels) {
      expect(grouped[level as keyof typeof grouped]!.length).toBeGreaterThan(0);
      for (const chord of grouped[level as keyof typeof grouped]!) {
        expect(chord.level).toBe(level);
      }
    }

    const total = levels.reduce(
      (sum, level) => sum + (grouped[level as keyof typeof grouped]?.length ?? 0),
      0,
    );
    expect(total).toBe(listChords().length);
  });

  it('filters by quality chips All / Major / Minor / 7th', () => {
    const all = listChords();
    expect(filterChordsByQuality(all, 'all')).toEqual(all);

    const majors = filterChordsByQuality(all, 'major');
    expect(majors.length).toBeGreaterThan(0);
    expect(majors.every((c) => c.quality === 'major')).toBe(true);

    const minors = filterChordsByQuality(all, 'minor');
    expect(minors.length).toBeGreaterThan(0);
    expect(minors.every((c) => c.quality === 'minor')).toBe(true);

    const sevenths = filterChordsByQuality(all, 'seventh');
    expect(sevenths.length).toBeGreaterThan(0);
    expect(sevenths.every((c) => c.quality === 'seventh')).toBe(true);

    const qualities: ChordQuality[] = ['major', 'minor', 'seventh'];
    for (const q of qualities) {
      expect(all.some((c) => c.quality === q)).toBe(true);
    }
  });

  it('encodes frets with index 0 as the G string', () => {
    const c = getChordById('C');
    expect(c).toBeDefined();
    // Open C: G0 C0 E0 A3 — frets[0] is G string
    expect(c!.frets).toEqual([0, 0, 0, 3]);
    expect(c!.fingers).toEqual([0, 0, 0, 3]);
  });
});
