# Proposal: Chords Library

## Intent

Offline chords browse: ~12–20 open-position chords with diagrams. Next MVP slice after archived `app-foundation`.

## Scope

### In Scope
- Bundled JSON catalog (~12–20 chords, high-G GCEA) + typed loaders
- Nested Stack: list → detail (`/chords`, `/chords/[chordId]`)
- Sectioned by `level` + quality chips (All / Major / Minor / 7th)
- SVG diagram: frets, finger numbers, G–C–E–A L→R (nut on top)
- English names/tips; stable IDs for future `favoriteChordIds`
- Strict TDD; reuse `Screen` / `AppText` / tokens; `expo install react-native-svg`

### Out of Scope
Songs links, assessment/gating, tuner, CMS, favorites UI, lefty, low-G/alt tunings, encyclopedia, search, dark mode, i18n, Skia, SQLite

## Capabilities

### New Capabilities
- `chords-catalog`: Offline content, loaders, level/quality group+filter; stable IDs; `tuning: gcea-high-g`
- `chord-diagram`: SVG from frets/fingers/barres/baseFret; finger numbers; GCEA L→R
- `chords-browse`: Nested stack list/detail, chips, English meta/tips, a11y

### Modified Capabilities
- `app-navigation`: Chords tab → nested stack; Home `/chords` → list; tabs smoke updated as needed

## Approach

1. `src/content/chords/` JSON + `listChords` / `getChordById` / group/filter
2. Feature UI + `ChordDiagram` (`react-native-svg`, tokens)
3. Replace `chords.tsx` with `chords/_layout` + `index` + `[chordId]`; thin routes
4. Strict TDD outside `app/`. Likely 2 chained PRs (content+diagram | routes+UI+nav) vs 400-line budget.

String index 0 = G, then C, E, A.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/(tabs)/chords.tsx` → `chords/` | Remove/New | Stack layout, list, detail |
| `app/(tabs)/_layout.tsx` | Modified | Nested headers for chords |
| `src/features/chords/*` | Modified/New | List, detail, diagram |
| `src/content/chords/` | New | Catalog + loaders |
| `package.json` / lockfile | Modified | `react-native-svg` |
| `__tests__/**` | Modified/New | Catalog, diagram, UI, nav |
| `src/storage/userProgress.ts` | Unchanged | ID substratum only |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Diagram polish rework | Med | Lock frets/fingers/orientation in design |
| Tabs a11y smoke break | Med | Preserve labels; update `tabs.test.tsx` |
| >400-line PR | High | Chained PRs in tasks/apply |
| Apply before foundation merge | Med | Base on merged `app-foundation` |

## Rollback Plan

Restore `chords.tsx` stub; remove stack, `src/content/chords`, diagram files, `react-native-svg`, related tests. No storage migration.

## Dependencies

- `app-foundation` shell (tabs, theme, `UserProgress`)
- Expo 57 `react-native-svg` via `expo install`

## Success Criteria

- [x] Sectioned catalog → detail with SVG + finger numbers
- [x] High-G GCEA only; G–C–E–A L→R; English-only
- [x] `/chords` and `/chords/{id}` work; Home lands on list
- [x] Stable `id`s; favorites unused but compatible
- [x] TDD green: catalog, diagram, list/detail, nav smoke
