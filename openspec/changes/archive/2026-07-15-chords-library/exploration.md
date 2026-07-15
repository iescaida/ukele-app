## Exploration: chords-library

**Topic key:** `sdd/chords-library/explore`
**Project:** ukele-app
**Date:** 2026-07-14
**Mode:** named change explore (engram only)
**Docs constraint:** https://docs.expo.dev/versions/v57.0.0/
**Branch inspected:** `feature/app-foundation-pr2-theme-storage-hub` (PR2 foundation; merge to `main` before/with apply)
**Prior context loaded (full via sqlite/obervation IDs):** `sdd-init/ukele-app` (#1), `sdd/ukele-app/testing-capabilities` (#3), `sdd/explore/ukele-mvp-product` (#4), `sdd/app-foundation/design` (#8), `sdd/app-foundation/archive-report` (#13)

### Current State

`app-foundation` is **archived** and shipped as an empty learning shell. Chords is a titled stub only.

| Area | Today | Gap for this change |
|------|-------|---------------------|
| Route | `app/(tabs)/chords.tsx` → `ChordsScreen` | Flat tab file; no list→detail stack |
| Feature | `src/features/chords/ChordsScreen.tsx` — centered title | Catalog UI, diagram, detail |
| Content | None (`src/content/` absent) | Bundled chord JSON + typed loaders |
| Diagram | No `react-native-svg` | Data-driven fret renderer |
| Theme/UI | Light `tokens`, `Screen`, `AppText` | Reuse; may add list/row primitives sparingly |
| Progress | `UserProgress.favoriteChordIds: string[]` | Schema ready; **favorites UI optional / defer** |
| Nav shell | Root `Stack` → JS `Tabs` (5 peers) | Nest **Stack inside Chords tab** |
| Tests | `__tests__/navigation/tabs.test.tsx` asserts “Chords screen”; storage/theme tests | Chord catalog, diagram, list→detail nav under Strict TDD |
| Deps | Expo 57 / RN 0.86 / Router 57; no SVG | `npx expo install react-native-svg` (Expo SDK SVG path) |

Home already shortcuts to `/chords`. Profile reads `skillLevel` only. Songs/Tuner remain empty shells (out of scope).

---

### Affected Areas

- `app/(tabs)/chords.tsx` — Replace with `app/(tabs)/chords/` stack directory (`_layout`, `index`, `[chordId]`)
- `app/(tabs)/_layout.tsx` — Tab still named `chords`; may set `headerShown: false` for Chords so nested Stack owns headers (Expo nested-stack pattern)
- `src/features/chords/*` — Split list/detail screens; extract `ChordDiagram`
- `src/content/chords/` (new) — JSON catalog + typed loaders (`listChords`, `getChordById`, group helpers)
- `src/theme/tokens.ts` / `src/ui/*` — Reuse; optional tiny row/separator only if needed for a11y/layout
- `src/storage/userProgress.ts` — **Do not change** unless favorites lands; IDs in catalog must match future `favoriteChordIds`
- `__tests__/navigation/tabs.test.tsx` — Update if accessibility label or route shape changes
- `__tests__/content|chords|features/**` (new) — Catalog, diagram pure logic, RNTL list/detail, `renderRouter` stack smoke
- `package.json` / lockfile — Add `react-native-svg` via `expo install`
- Home shortcut `/chords` — Should land on catalog list (stack `initialRouteName: 'index'`)

---

### Approaches

#### A) Chord diagram rendering

1. **Data-driven SVG (`react-native-svg`) — recommended**
   - Pros: One renderer; themeable from tokens; tiny JSON (`frets`/`fingers`/`barres`); unit-testable geometry; aligns with MVP explore #4; Expo docs: `npx expo install react-native-svg`
   - Cons: Initial polish for nut/fret labels/barre; lefty flip is extra work
   - Effort: Medium

2. **Static PNG/WebP per chord**
   - Pros: Designer-perfect assets quickly
   - Cons: Asset bloat; hard to theme; variants explode; weaker unit tests
   - Effort: Medium (content-heavy)

3. **Skia / Canvas drawing**
   - Pros: High fidelity / animation
   - Cons: Heavier dep; overkill for MVP diagrams
   - Effort: High

#### B) Catalog bundling

1. **Bundled typed JSON under `src/content/chords/` — recommended**
   - Pros: Offline-first; versioned with app; Strict TDD fixtures; matches MVP + foundation NON-GOAL (no CMS)
   - Cons: Content updates need release
   - Effort: Low–Medium

2. **SQLite catalog now**
   - Pros: Query power
   - Cons: Migrations early; premature for ~15–30 chords
   - Effort: Medium–High

3. **Remote CMS**
   - Pros: Editorial speed
   - Cons: Offline/auth wrong for this slice
   - Effort: High — **OUT**

**Starter subset (v1):** ~12–20 **open-position GCEA** chords covering beginner song glue: majors `C G F Am` family plus common companions (`D`, `Dm`, `Em`, `A`, `E7`, `G7`, `C7`, `Bb` or equivalent). Enough for browse IA without authoring a full encyclopedia.

Suggested chord shape (extends MVP explore):

```json
{
  "id": "C",
  "name": "C Major",
  "displayName": "C",
  "quality": "major",
  "root": "C",
  "level": "beginner",
  "tags": ["open", "common"],
  "frets": [0, 0, 0, 3],
  "fingers": [0, 0, 0, 3],
  "barres": [],
  "baseFret": 1,
  "tuning": "gcea-high-g"
}
```

String order convention (document in design): index 0 = G (4th), then C, E, A — standard ukulele diagram left→right or right→left **must be locked in design**. Prefer one fixed orientation for v1.

#### C) Navigation within Chords tab

1. **Nested Stack inside Chords tab — recommended**
   - Convert `chords.tsx` → `chords/_layout.tsx` (`Stack`), `chords/index.tsx` (list), `chords/[chordId].tsx` (detail)
   - Expo pattern: “Stacks inside tabs”; `unstable_settings.initialRouteName = 'index'` for deep links
   - Pros: Tab bar stays; URLs `/chords`, `/chords/C`; matches MVP nested-stack note; Home shortcut still `/chords`
   - Cons: Tab layout may need `headerShown: false` for chords so stack headers work cleanly
   - Effort: Low–Medium

2. **Root-level Stack screens above tabs** (`app/chord/[id].tsx`)
   - Pros: Modal-over-tabs possible
   - Cons: Leaves Chords tab “flat”; worse IA for browse; fights foundation folder model
   - Effort: Medium

3. **In-place expand / single screen with modal**
   - Pros: Fewer routes
   - Cons: Poor deep links; harder TDD of navigation; weak learning UX
   - Effort: Low (poor fit)

#### D) Grouping / filtering IA

1. **Sectioned list by difficulty (`level`) + quality chips — recommended for v1**
   - Sections: Beginner / Intermediate (only levels present in starter subset)
   - Optional filter chips: All | Major | Minor | 7th (client-side filter on bundled data)
   - Pros: Pedagogy-first; small catalog stays scannable; tests easy
   - Cons: Key-circle browsing deferred
   - Effort: Low–Medium

2. **Browse by musical key only**
   - Pros: Theory-forward
   - Cons: Harder for absolute beginners; empty keys with tiny catalog
   - Effort: Medium

3. **Flat A–Z list only**
   - Pros: Simplest
   - Cons: Weak learning structure; contradicts “sections” intent
   - Effort: Low

Search: **defer** unless catalog grows; v1 section headers + chips suffice.

#### E) Theme / storage / favorites

- **Reuse** `Screen`, `AppText`, light tokens for chrome; diagram strokes/fills from `tokens.colors`.
- **Favorites:** `favoriteChordIds` already exists. **Recommend OUT for this change** (or tiny stretch after core browse ships) to protect ~400-line PR budget. When added later: toggle on detail → `loadUserProgress`/`saveUserProgress`; catalog `id` stability is the substratum needed now (document ID conventions).
- **No** new storage module; **no** onboarding/level gating in this slice (assessment is later change).

#### F) Test strategy (Strict TDD)

| Layer | Focus | Tool |
|-------|-------|------|
| Unit | Catalog loaders, grouping/filter pure fns, fret→SVG layout helpers | Jest |
| Component | `ChordDiagram` accessible name; list rows; detail composition with `Screen`/`AppText` | RNTL `await render` |
| Integration | Tab → list → detail → back; Home shortcut still reaches list | `expo-router/testing-library` `renderRouter` |
| Outside `app/` | Keep routes thin; tests import features/content | Foundation convention |

TDD order suggestion: RED catalog schema/loaders → GREEN JSON; RED diagram data→shapes → GREEN SVG component; RED list UI → GREEN; RED stack nav → GREEN route folder; update tabs smoke labels if needed.

Mock `react-native-svg` only if jest-expo fails; prefer real SVG in component tests when possible.

---

### Recommendation

Ship **offline chords learning browse** as:

1. **Bundled JSON catalog** (`src/content/chords`) with typed loaders and stable string `id`s  
2. **Data-driven SVG diagrams** via Expo-aligned **`react-native-svg`**  
3. **Nested Stack under Chords tab**: list (sectioned by level + quality filter) → detail (large diagram + name/meta)  
4. **Reuse** theme/ui; **defer favorites / lefty / i18n / CMS / songs links**  
5. **Strict TDD** outside `app/`; update existing nav smoke as needed  

Assume **high-G GCEA** fingerings for starter open chords; resolve remaining product questions in propose (non-blocking for explore).

### IN / OUT (for proposal)

**IN**
- Chord content module + starter subset (~12–20)
- `ChordDiagram` SVG renderer + shared fret model
- Chords tab nested stack: list + detail
- Sectioned browse by difficulty; simple quality filter
- Theme/ui reuse; a11y labels for list/detail/diagram
- Tests: content, diagram, feature UI, router stack smoke
- `react-native-svg` install via `npx expo install`

**OUT**
- Songs collection / “related songs”
- Level assessment quiz / gating by `skillLevel`
- Tuner / mic
- Remote CMS / sync / accounts
- Favorites UI (storage field already exists — wire later)
- Left-handed diagrams, alternate tunings, low-G alternate fingerings
- Full chord encyclopedia / search
- Dark mode, i18n, Skia, SQLite

**Tiny substratum OK:** stable `id` naming; `tuning: "gcea-high-g"` field even if single-valued; optional `tips` string empty/minimal.

### Effort / PR budget

| Slice | Effort | Notes |
|-------|--------|-------|
| Content + loaders | Low | Author curated JSON |
| SVG diagram | Medium | Highest product polish risk |
| List/detail + nested stack | Low–Med | Expo Router folder migrate |
| Filters/sections | Low | Pure functions |
| Tests | Medium | Strict TDD across layers |
| **Overall** | **Medium** | Likely **Medium–High** vs 400-line budget → consider 2 chained PRs: (1) content+diagram+unit (2) routes+UI+nav tests |

### Risks

- Diagram polish perceived as “app quality”; under-specced fret conventions cause rework
- Nested stack + existing tabs tests (`getByLabelText('Chords screen')`) need careful a11y continuity
- Lockfile + SVG + many fixtures may pressure **400-line review budget** — chain PRs
- PR2 foundation still on feature branch — apply should target merged foundation base
- High-G vs low-G / lefty / language unanswered → document defaults to avoid scope thrash
- Engram CLI migration write issues in sandbox environments (ops) — does not affect code

### Open Product Questions

1. **Tuning:** Confirm high-G GCEA only for v1 diagrams? (Recommend: yes)
2. **String diagram orientation:** GCEA left→right vs mirror — pick one for all diagrams
3. **Left-handed:** Defer — confirm OUT for this change?
4. **Language:** English-only chord names/tips for v1?
5. **Favorites in this change or next?** (Recommend: next)
6. **Starter set size:** ~12 vs ~24 — prefer smaller for review budget?
7. **Detail extras:** Finger numbers on dots? Base-fret marker for movable shapes (may be N/A if open-only)?

### Ready for Proposal

**Yes** — ready for `sdd-propose` on `chords-library`. Defaults above can be locked in proposal; open questions can be asked once interactively without blocking explore.
