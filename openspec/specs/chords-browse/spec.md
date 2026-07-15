# Spec: chords-browse

### Purpose
Nested-stack list/detail with sections, chips, English copy, a11y.

### Requirement: List with sections and chips
List MUST section by `level` and offer All/Major/Minor/7th chips. English-only. MUST NOT show favorites, search, or songs links.

#### Scenario: Browse sections
- GIVEN catalog loaded
- WHEN list opens
- THEN level sections and quality chips visible

#### Scenario: Chip narrows list
- GIVEN All selected
- WHEN Minor activated
- THEN only minor chords remain

### Requirement: Detail screen
`/chords/[chordId]` MUST show large diagram, English name/meta, tips if any; reuse Screen/AppText/tokens. Unknown id SHOULD fail safely.

#### Scenario: Open detail
- GIVEN row C
- WHEN activated
- THEN detail shows diagram + finger numbers + English name/meta

#### Scenario: Unknown chord id
- GIVEN bad `chordId`
- WHEN detail renders
- THEN no crash; user can return to list

### Requirement: Browse accessibility
Rows, chips, detail MUST have accessible labels; diagram in a11y tree.

#### Scenario: List row label
- GIVEN list rendered
- WHEN queried
- THEN each row has accessible chord name
