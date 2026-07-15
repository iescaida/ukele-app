# Spec: theme-ui

### Purpose
Minimal light tokens + Screen/text primitives.

### Requirement: Light theme substrate
MUST provide light tokens (colors, spacing, typography) and shared Screen/text primitives used by tab screens. MUST NOT add dark mode or full design system.

#### Scenario: Shared primitives
- GIVEN any tab renders
- WHEN layout/text draw
- THEN Screen/text + light tokens are used; no dark-mode toggle
