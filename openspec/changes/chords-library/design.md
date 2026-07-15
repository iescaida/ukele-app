# Design: Chords Library

**Alignment**: Matches `sdd/chords-library/spec` (chords-catalog, chord-diagram, chords-browse NEW; app-navigation DELTA) and locked product decisions.

## Technical Approach

Offline chords browse: bundled high-G GCEA JSON → pure catalog helpers → SVG `ChordDiagram` → list/detail features → thin Expo Router nested Stack under Chords. Strict TDD outside `app/`. Reuse `Screen`/`AppText`/`tokens`. Favorites/`userProgress` unchanged (stable IDs only).

## Architecture Decisions

| Decision | Tradeoff | Choice |
|----------|----------|--------|
| Catalog | JSON vs SQLite vs CMS | **Bundled typed JSON** `src/content/chords/` (~12–20) |
| Diagram | SVG vs PNG vs Skia | **`react-native-svg`** (`npx expo install`) |
| Nav | Nested Stack vs root routes vs modal | **`app/(tabs)/chords/{_layout,index,[chordId]}`** |
| Tuning | multi vs single | **`tuning: "gcea-high-g"`** only |
| Orientation | L→R vs mirror | **frets[0]=G; L→R G–C–E–A; nut top** |
| Fingers | dots vs numbered | **Finger numbers on fretted dots** |
| Browse IA | sections+chips vs A–Z vs key | **`level` sections + All/Major/Minor/7th** |
| Favorites | wire vs defer | **OUT** — no storage change |
| Routes | fat vs thin | **Thin `app/`; logic/UI in `src/`** |

## Module Boundaries

| Module | Role |
|--------|------|
| `src/content/chords/` | Schema, JSON, list/get/group/filter |
| `src/features/chords/diagramLayout.ts` | Fret→geometry (unit-tested) |
| `src/features/chords/ChordDiagram.tsx` | SVG from frets/fingers/barres/baseFret |
| `src/features/chords/ChordsListScreen.tsx` | Sections + chips → detail |
| `src/features/chords/ChordDetailScreen.tsx` | Diagram + English name/meta/tips |
| `src/features/chords/QualityFilterChips.tsx` | Optional chip row split |
| `app/(tabs)/chords/*` | Route wiring only |
| `src/storage/userProgress.ts` | **Unchanged** |

```
Home /chords → Stack.index (list) → push /chords/:id → Stack.[chordId]
                     ↕ content loaders          ↕ ChordDiagram (tokens)
```

## Data Model

```ts
type ChordQuality = 'major' | 'minor' | 'seventh';
type ChordLevel = 'beginner' | 'intermediate';
type Chord = {
  id: string; name: string; displayName: string;
  quality: ChordQuality; root: string; level: ChordLevel; tags: string[];
  frets: [number, number, number, number];   // 0=open, -1=mute; [0]=G
  fingers: [number, number, number, number]; // 0=none; 1–4
  barres: { fret: number; fromString: number; toString: number }[];
  baseFret: number; tuning: 'gcea-high-g'; tips?: string;
};
```

## Nav Structure

- Delete `chords.tsx` → `chords/_layout` (`Stack`, `initialRouteName: 'index'`), `index`, `[chordId]`.
- Tabs: `headerShown: false` for chords; Stack titles ("Chords" / `displayName`).
- Keep list `accessibilityLabel="Chords screen"` (tabs/Home smoke); detail `"Chord detail screen"`.
- Paths `/chords`, `/chords/[chordId]`; Songs/Tuner remain empty stubs.

## File Changes

| File | Action | Why |
|------|--------|-----|
| `src/content/chords/{chords.json,types.ts,catalog.ts}` | Create | Catalog + loaders |
| `src/features/chords/{diagramLayout,ChordDiagram,ChordsListScreen,ChordDetailScreen,QualityFilterChips}` | Create | UI + SVG |
| `src/features/chords/ChordsScreen.tsx` | Delete | Stub |
| `app/(tabs)/chords.tsx` | Delete | → directory |
| `app/(tabs)/chords/{_layout,index,[chordId]}.tsx` | Create | Nested stack |
| `app/(tabs)/_layout.tsx` | Modify | Nested headers |
| `package.json` / lockfile | Modify | `react-native-svg` |
| `__tests__/content/chordsCatalog.test.ts` | Create | Load/group/filter |
| `__tests__/features/{chordDiagram,chordsList,chordDetail}.test.tsx` | Create | Diagram/UI |
| `__tests__/navigation/chordsStack.test.tsx` | Create | list→detail→back |
| `__tests__/navigation/tabs.test.tsx` | Modify | Preserve `/chords` a11y |

## TDD Seams

1. RED catalog → GREEN JSON+catalog
2. RED layout+diagram (GCEA, fingers, a11y name, barre/baseFret) → GREEN SVG
3. RED list sections/chips → GREEN list
4. RED detail + unknown id → GREEN detail
5. RED `renderRouter` stack + tabs/Home → GREEN routes
6. Install SVG when diagram RED needs it. No tests in `app/`.

## Threat Matrix

Shell/VCS/PR rows: **N/A** (app nav only).

| Local risk | Mitigation | RED |
|------------|------------|-----|
| Wrong string order | frets[0]=G locked | orientation asserts |
| A11y smoke break | keep `Chords screen` on list | tabs + Home |
| Bad chordId | safe empty fallback | detail test |

## Migration / Delivery

No storage migration. Rollback: stub + remove content/diagram/stack/SVG.

**400-line budget: High** → **2 chained PRs** (tasks formalize): (1) content+diagram+tests+SVG (2) routes+list/detail+nav smoke.

## Open Questions

- [ ] Exact starter ID set (non-blocking; C/G/F/Am family + companions)
