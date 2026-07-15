export const STRING_LABELS = ['G', 'C', 'E', 'A'] as const;

export type DiagramBarre = {
  fret: number;
  fromString: number;
  toString: number;
};

export type DiagramChordShape = {
  id: string;
  displayName: string;
  frets: [number, number, number, number];
  fingers: [number, number, number, number];
  barres: DiagramBarre[];
  baseFret: number;
};

export type DiagramDot = {
  stringIndex: number;
  fret: number;
  finger: number;
  x: number;
  y: number;
};

export type DiagramOpenMarker = {
  stringIndex: number;
  x: number;
  y: number;
};

export type DiagramMuteMarker = {
  stringIndex: number;
  x: number;
  y: number;
};

export type DiagramBarreGeom = {
  fret: number;
  fromString: number;
  toString: number;
  x1: number;
  x2: number;
  y: number;
};

export type DiagramLayout = {
  width: number;
  height: number;
  stringLabels: readonly ['G', 'C', 'E', 'A'];
  stringXs: [number, number, number, number];
  nut: { x1: number; x2: number; y: number };
  fretLines: { x1: number; x2: number; y1: number; y2: number }[];
  stringLines: { x1: number; y1: number; x2: number; y2: number }[];
  dots: DiagramDot[];
  openMarkers: DiagramOpenMarker[];
  muteMarkers: DiagramMuteMarker[];
  barres: DiagramBarreGeom[];
  baseFretLabel: { text: string; x: number; y: number } | null;
  fretCount: number;
};

const PADDING_LEFT = 28;
const PADDING_RIGHT = 16;
const PADDING_TOP = 28;
const PADDING_BOTTOM = 20;
const STRING_GAP = 28;
const FRET_GAP = 32;
const DEFAULT_VISIBLE_FRETS = 4;

function fretCenterY(nutY: number, relativeFret: number): number {
  return nutY + (relativeFret - 0.5) * FRET_GAP;
}

export function buildDiagramLayout(shape: DiagramChordShape): DiagramLayout {
  const fretted = shape.frets.filter((f) => f > 0);
  const maxRelativeFret =
    fretted.length > 0
      ? Math.max(...fretted.map((f) => f - shape.baseFret + 1), DEFAULT_VISIBLE_FRETS)
      : DEFAULT_VISIBLE_FRETS;
  const fretCount = Math.max(DEFAULT_VISIBLE_FRETS, maxRelativeFret);

  const stringXs: [number, number, number, number] = [
    PADDING_LEFT,
    PADDING_LEFT + STRING_GAP,
    PADDING_LEFT + STRING_GAP * 2,
    PADDING_LEFT + STRING_GAP * 3,
  ];

  const nutY = PADDING_TOP;
  const gridBottom = nutY + fretCount * FRET_GAP;
  const width = stringXs[3] + PADDING_RIGHT;
  const height = gridBottom + PADDING_BOTTOM;

  const fretLines = Array.from({ length: fretCount }, (_, index) => {
    const y = nutY + (index + 1) * FRET_GAP;
    return { x1: stringXs[0], x2: stringXs[3], y1: y, y2: y };
  });

  const stringLines = stringXs.map((x) => ({
    x1: x,
    y1: nutY,
    x2: x,
    y2: gridBottom,
  }));

  const dots: DiagramDot[] = [];
  const openMarkers: DiagramOpenMarker[] = [];
  const muteMarkers: DiagramMuteMarker[] = [];

  shape.frets.forEach((fret, stringIndex) => {
    const x = stringXs[stringIndex]!;
    if (fret === 0) {
      openMarkers.push({ stringIndex, x, y: nutY - 12 });
      return;
    }
    if (fret < 0) {
      muteMarkers.push({ stringIndex, x, y: nutY - 12 });
      return;
    }

    const relativeFret = fret - shape.baseFret + 1;
    if (relativeFret < 1) {
      return;
    }

    const finger = shape.fingers[stringIndex] ?? 0;
    if (finger < 1) {
      return;
    }

    dots.push({
      stringIndex,
      fret,
      finger,
      x,
      y: fretCenterY(nutY, relativeFret),
    });
  });

  const barres: DiagramBarreGeom[] = shape.barres.map((barre) => {
    const relativeFret = barre.fret - shape.baseFret + 1;
    const from = Math.min(barre.fromString, barre.toString);
    const to = Math.max(barre.fromString, barre.toString);
    return {
      fret: barre.fret,
      fromString: from,
      toString: to,
      x1: stringXs[from]!,
      x2: stringXs[to]!,
      y: fretCenterY(nutY, relativeFret),
    };
  });

  const baseFretLabel =
    shape.baseFret > 1
      ? {
          text: `${shape.baseFret}fr`,
          x: stringXs[0]! - 18,
          y: fretCenterY(nutY, 1) + 4,
        }
      : null;

  return {
    width,
    height,
    stringLabels: STRING_LABELS,
    stringXs,
    nut: { x1: stringXs[0], x2: stringXs[3], y: nutY },
    fretLines,
    stringLines,
    dots,
    openMarkers,
    muteMarkers,
    barres,
    baseFretLabel,
    fretCount,
  };
}
