# Spec: testing-and-nfr

### Purpose
Strict TDD gates and foundation NFRs.

### Requirement: Strict TDD
Tests MUST live outside `app/`. Navigation smoke MUST use `expo-router/testing-library`. Storage units MUST cover defaults + round-trip. `npm test` and `tsc --noEmit` MUST stay green under Strict TDD.

#### Scenario: Gates green
- GIVEN foundation complete
- WHEN `npm test` and `tsc --noEmit` run
- THEN both pass; no tests under `app/`

#### Scenario: Router smoke
- GIVEN router harness mounts tabs
- WHEN smoke runs
- THEN pathname is Home and hub content is queryable

### Requirement: Offline, no mic, SDK 57
MUST work offline without account/sync. MUST NOT request mic/audio permissions or use `expo-audio`/pitch APIs. MUST follow Expo SDK 57 (Router entry/plugin/scheme; no direct `@react-navigation/*` app imports).

#### Scenario: No mic prompts
- GIVEN Home/shells/Profile visited
- WHEN screens mount
- THEN no mic/audio permission prompt

#### Scenario: Offline usable
- GIVEN no network
- WHEN tabs navigate and progress loads
- THEN shell and local progress still work
