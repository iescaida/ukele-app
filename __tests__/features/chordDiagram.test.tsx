import { render } from '@testing-library/react-native';

import { ChordDiagram } from '../../src/features/chords/ChordDiagram';
import {
  STRING_LABELS,
  buildDiagramLayout,
  type DiagramChordShape,
} from '../../src/features/chords/diagramLayout';

const openC: DiagramChordShape = {
  id: 'C',
  displayName: 'C Major',
  frets: [0, 0, 0, 3],
  fingers: [0, 0, 0, 3],
  barres: [],
  baseFret: 1,
};

const barreBm: DiagramChordShape = {
  id: 'Bm',
  displayName: 'B Minor',
  frets: [4, 2, 2, 2],
  fingers: [3, 1, 1, 1],
  barres: [{ fret: 2, fromString: 1, toString: 3 }],
  baseFret: 1,
};

const highBaseShape: DiagramChordShape = {
  id: 'Bb',
  displayName: 'B Flat',
  frets: [3, 5, 4, 4],
  fingers: [1, 3, 2, 2],
  barres: [{ fret: 3, fromString: 0, toString: 0 }],
  baseFret: 3,
};

describe('chord diagram orientation (threat)', () => {
  it('maps strings left-to-right as G–C–E–A with frets[0]=G and nut on top', () => {
    expect(STRING_LABELS).toEqual(['G', 'C', 'E', 'A']);

    const layout = buildDiagramLayout(openC);

    expect(layout.stringLabels).toEqual(['G', 'C', 'E', 'A']);
    expect(layout.nut.y).toBeLessThan(layout.fretLines[0].y1);

    // frets[0] is G (leftmost string)
    expect(layout.stringXs[0]).toBeLessThan(layout.stringXs[1]);
    expect(layout.stringXs[1]).toBeLessThan(layout.stringXs[2]);
    expect(layout.stringXs[2]).toBeLessThan(layout.stringXs[3]);

    const gStringDots = layout.dots.filter((d) => d.stringIndex === 0);
    expect(gStringDots).toHaveLength(0); // open G — no fretted dot

    const aStringDot = layout.dots.find((d) => d.stringIndex === 3);
    expect(aStringDot).toMatchObject({
      stringIndex: 3,
      fret: 3,
      finger: 3,
    });
    expect(aStringDot!.x).toBe(layout.stringXs[3]);
    expect(aStringDot!.y).toBeGreaterThan(layout.nut.y);
  });

  it('places finger numbers on fretted dots only', () => {
    const layout = buildDiagramLayout(openC);
    expect(layout.dots.every((d) => d.finger >= 1 && d.finger <= 4)).toBe(true);
    expect(layout.dots.map((d) => d.finger)).toEqual([3]);

    const openMarkers = layout.openMarkers;
    expect(openMarkers.map((m) => m.stringIndex).sort()).toEqual([0, 1, 2]);
  });
});

describe('ChordDiagram', () => {
  it('renders an open shape with GCEA labels and finger numbers', async () => {
    const view = await render(<ChordDiagram chord={openC} />);
    const layout = buildDiagramLayout(openC);

    expect(view.getByLabelText(/C Major/i)).toBeTruthy();
    expect(view.getByText('G')).toBeTruthy();
    expect(view.getByText('C')).toBeTruthy();
    expect(view.getByText('E')).toBeTruthy();
    expect(view.getByText('A')).toBeTruthy();
    expect(layout.dots).toEqual([
      expect.objectContaining({ stringIndex: 3, fret: 3, finger: 3 }),
    ]);
  });

  it('renders barre and baseFret > 1 without crashing', async () => {
    const barreView = await render(<ChordDiagram chord={barreBm} />);
    expect(barreView.getByLabelText(/B Minor/i)).toBeTruthy();

    const highView = await render(<ChordDiagram chord={highBaseShape} />);
    expect(highView.getByLabelText(/B Flat/i)).toBeTruthy();
    expect(highView.getByText('3fr')).toBeTruthy();
    expect(buildDiagramLayout(highBaseShape).baseFretLabel?.text).toBe('3fr');
  });

  it('exposes an accessible name that identifies the chord', async () => {
    const view = await render(<ChordDiagram chord={openC} />);
    const named = view.getByLabelText('Chord diagram for C Major');
    expect(named).toBeTruthy();
  });
});
