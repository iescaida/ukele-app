# Spec: app-navigation

### Purpose
Chords nested browse inside the tab shell; Songs/Tuner remain empty shells; peer tabs preserved.

### Requirement: Empty feature shells
Songs/Tuner MUST stay empty shells with titles; no catalog/quiz/mic. Chords MUST host nested browse (not empty stub).

#### Scenario: Songs/Tuner empty
- GIVEN Songs or Tuner opens
- WHEN rendered
- THEN titled empty shell; no catalog/quiz/mic

#### Scenario: Chords is catalog
- GIVEN Chords opens
- WHEN rendered
- THEN chord list shown (not stub)

### Requirement: Chords nested stack
Chords MUST nest Stack: `/chords` list, `/chords/[chordId]` detail. Five peer tabs MUST remain. Home `/chords` MUST land on list. Default tab MUST stay Home.

#### Scenario: List is stack root
- GIVEN Chords tab or Home Chords shortcut
- WHEN nav completes
- THEN list shows inside Chords tab

#### Scenario: Detail and back
- GIVEN detail in Chords
- WHEN back
- THEN list; tab bar still available

#### Scenario: Peer tabs preserved
- GIVEN Chords list/detail
- WHEN other tab selected
- THEN that tab shows; no crash
