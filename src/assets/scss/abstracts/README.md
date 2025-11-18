Design System Hierarchy
Variables (Private) → Foundation → Design Tokens (Public) → Components
     ↓                    ↓              ↓                      ↓
  Technical         Semantic        CSS Custom           Implementation
  Primitives        Scales          Properties           Layer

┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: PRIVATE VARIABLES (abstracts/variables/)               │
│ Purpose: Technical primitives, not exposed to components        │
│ Example: $base-unit: 8px                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ @use
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2: FOUNDATION SCALES (abstracts/variables/foundation/)    │
│ Purpose: Semantic scales derived from primitives                │
│ Example: $spacing-scale: (4: 1rem, 8: 2rem)                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │ @use
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 3: FUNCTIONS (abstracts/functions/)                       │
│ Purpose: Getters and converters for foundation values           │
│ Example: spacing(4) → 1rem                                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Used by
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: DESIGN TOKENS (abstracts/tokens/)                      │
│ Purpose: CSS custom properties for public API                   │
│ Example: --space-4: 1rem                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Used by
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 5: MIXINS (abstracts/mixins/)                             │
│ Purpose: Generate utility classes from tokens                   │
│ Example: .m-4 { margin: var(--space-4); }                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Applied to
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 6: COMPONENTS                                             │
│ Purpose: Component implementations using tokens                 │
│ Example: .btn { padding: var(--space-4); }                      │
└─────────────────────────────────────────────────────────────────┘