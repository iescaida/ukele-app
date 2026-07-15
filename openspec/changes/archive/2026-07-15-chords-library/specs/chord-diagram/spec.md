# Spec: chord-diagram (NEW)

### Purpose
Data-driven SVG fret diagram from shape fields.

### Requirement: SVG from chord data
MUST render from `frets`/`fingers`/`barres`/`baseFret`. Strings L→R G–C–E–A (index 0 = G); nut on top. Finger numbers MUST show on fretted dots. MUST NOT lefty-flip or support non–high-G.

#### Scenario: Open chord diagram
- GIVEN open shape data
- WHEN diagram renders
- THEN GCEA L→R; dots show finger numbers; open/mute match data

#### Scenario: Barre and base fret
- GIVEN barres and/or `baseFret` > 1
- WHEN rendered
- THEN markers match data; no crash

#### Scenario: Accessible name
- GIVEN named chord
- WHEN diagram mounts
- THEN accessible name identifies the chord
