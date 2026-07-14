# Spec: chords-catalog (NEW)

### Purpose
Bundled offline chords with typed loaders, level grouping, quality filter.

### Requirement: Bundled starter catalog
System MUST ship ~12–15 open-position chords with stable `id`, `name`, `displayName`, `quality`, `root`, `level`, `tags`, `frets`, `fingers`, `barres`, `baseFret`, `tuning: "gcea-high-g"`. High-G GCEA only. IDs MUST stay stable for future `favoriteChordIds`. MUST NOT use network/CMS.

#### Scenario: Catalog loads offline
- GIVEN app offline
- WHEN `listChords` runs
- THEN ~12–15 chords with required fields and `tuning: "gcea-high-g"`

#### Scenario: Lookup by id
- GIVEN id `C` exists
- WHEN `getChordById("C")` / unknown id
- THEN chord returns / absence without crash

### Requirement: Group and filter
MUST group by `level` and filter by quality chips All/Major/Minor/7th. MUST NOT search or offer alt tunings.

#### Scenario: Section by level
- GIVEN mixed levels
- WHEN grouped
- THEN only present levels; stable order

#### Scenario: Quality filter
- GIVEN full catalog
- WHEN Major (or Minor/7th); WHEN All
- THEN matching subset; All = full set
