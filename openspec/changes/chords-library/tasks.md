# Tasks: Chords Library

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~550–750 authored |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 content+diagram+SVG → PR2 routes+list/detail+nav |
| Delivery strategy | feature-branch-chain (confirmed) |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Catalog + diagram SVG + unit tests | PR1 (base: `feature/chords-library`) | `npm test -- --testPathPattern='chordsCatalog\|chordDiagram'` | N/A — no routes yet; diagram unit-only | Remove `src/content/chords/`, `src/features/chords/{diagramLayout,ChordDiagram}*`, SVG dep, matching tests |
| 2 | Nested stack + list/detail + nav smoke | PR2 (base: PR1 branch) | `npm test -- --testPathPattern='chordsList\|chordDetail\|chordsStack\|tabs'` | Manual: Chords tab + Home→list→detail→back | Restore `chords.tsx` stub; remove `chords/` stack, list/detail screens, nav tests |

## Phase 1: Catalog foundation (PR1)

- [x] 1.1 RED `__tests__/content/chordsCatalog.test.ts`: `listChords` ~12–15 high-G GCEA; `getChordById("C")` / unknown; group by `level`; filter All/Major/Minor/7th
- [x] 1.2 GREEN `src/content/chords/{types.ts,chords.json,catalog.ts}`: typed Chord; frets[0]=G; `tuning: "gcea-high-g"`; stable ids; group/filter helpers
- [x] 1.3 REFACTOR catalog exports; keep pure (no RN)

## Phase 2: Diagram + SVG (PR1)

- [x] 2.1 RED threat — orientation: layout/diagram asserts L→R G–C–E–A, frets[0]=G, nut top; finger numbers on fretted dots
- [x] 2.2 RED `__tests__/features/chordDiagram.test.tsx`: open shape; barre/`baseFret`>1 no crash; accessible name identifies chord
- [x] 2.3 GREEN: `npx expo install react-native-svg`; `diagramLayout.ts` + `ChordDiagram.tsx` (tokens)
- [x] 2.4 REFACTOR diagram pure layout vs SVG presentational

## Phase 3: Browse UI (PR2)

- [x] 3.1 RED `__tests__/features/chordsList.test.tsx`: level sections + chips; Minor narrows; row a11y names; no favorites/search
- [x] 3.2 GREEN `ChordsListScreen.tsx` (+ optional `QualityFilterChips.tsx`); navigate by id
- [x] 3.3 RED threat — unknown id: `__tests__/features/chordDetail.test.tsx` safe fallback + return path; happy path diagram+English meta/tips
- [x] 3.4 GREEN `ChordDetailScreen.tsx`; a11y `"Chord detail screen"`; delete stub `ChordsScreen.tsx`

## Phase 4: Nested routes + nav smoke (PR2)

- [x] 4.1 RED `__tests__/navigation/chordsStack.test.tsx`: list→detail→back; tab bar available; Songs/Tuner empty
- [x] 4.2 RED threat — a11y smoke: update `__tests__/navigation/tabs.test.tsx` + Home `/chords` keep list `accessibilityLabel="Chords screen"`
- [x] 4.3 GREEN: delete `app/(tabs)/chords.tsx`; add `chords/{_layout,index,[chordId]}.tsx`; thin wiring; tweak `(tabs)/_layout.tsx` headers
- [x] 4.4 Verify `userProgress.ts` untouched; `npx tsc --noEmit` + focused nav/UI tests green
