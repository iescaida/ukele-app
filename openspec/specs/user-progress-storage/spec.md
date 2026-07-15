# Spec: user-progress-storage

### Purpose
Local AsyncStorage UserProgress placeholder API.

### Requirement: UserProgress API
MUST support load/save of `skillLevel`, `completedOnboarding`, `favoriteChordIds`, `favoriteSongIds`, `updatedAt`. First launch MUST default `skillLevel: unknown`. Corrupt storage MUST return defaults. MUST NOT require account/sync.

#### Scenario: First-launch defaults
- GIVEN no stored progress
- WHEN load runs
- THEN defaults with `skillLevel: unknown`

#### Scenario: Round-trip
- GIVEN valid progress saved
- WHEN load runs
- THEN fields match saved values

#### Scenario: Corrupt recovery
- GIVEN corrupt/unreadable storage
- WHEN load runs
- THEN defaults return without crash
