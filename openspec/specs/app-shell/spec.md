# Spec: app-shell

### Purpose
Expo Router JS Tabs shell: Home hub, feature tabs, Profile stub.

### Requirement: Five peer tabs
App MUST expose Tabs Home, Chords, Songs, Tuner, Profile. Cold start/deep-link default MUST be Home. MUST NOT use Native Tabs here.

#### Scenario: Default Home
- GIVEN fresh launch
- WHEN UI mounts
- THEN Home is active and five tabs are reachable

#### Scenario: Peer tab switch
- GIVEN user on Home
- WHEN selecting Chords/Songs/Tuner/Profile
- THEN matching screen shows; return to Home does not crash

### Requirement: Home learning hub
Home MUST be a learning hub (not marketing). MUST show identity, resume/progress placeholder, and shortcuts to Chords, Songs, Tuner.

#### Scenario: Hub content
- GIVEN Home opens
- WHEN hub renders
- THEN resume placeholder and three feature shortcuts are actionable

#### Scenario: Shortcut navigates
- GIVEN Home shortcuts visible
- WHEN user activates Chords shortcut
- THEN Chords screen is shown

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

### Requirement: Profile stub
Profile MUST exist (MAY be incomplete). SHOULD show default skill level from local progress when available. MUST NOT require account/sign-in.

#### Scenario: Profile renders offline
- GIVEN Profile opens
- WHEN screen renders
- THEN stub UI is visible without auth
