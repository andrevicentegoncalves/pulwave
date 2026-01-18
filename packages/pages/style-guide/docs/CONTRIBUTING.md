# Contributing to the Pulwave Design System Style Guide

Thank you for contributing to our design system documentation! This guide outlines how to add or update component documentation.

---

## Getting Started

1. **Clone the repository** and install dependencies
2. **Run the style guide** locally: `npm run dev`
3. **Navigate** to `http://localhost:5173/style-guide`

---

## File Structure

```
packages/experience/style-guide/
├── app/                       # Main app and routing
│   ├── registry.ts           # Section/category configuration
│   └── StyleGuideApp.tsx     # Main app component
├── content/                   # Documentation content
│   ├── components/           # Component docs and demos
│   │   └── Select/
│   │       ├── docs/        # SelectDoc.ts
│   │       └── demos/       # Demo components
│   ├── foundation/           # Foundation docs
│   └── getting-started/      # Getting started pages
└── shared/                    # Shared components
    └── components/
        ├── ComponentDocPage/  # Main doc template
        └── DemoCard/          # Demo wrapper
```

---

## Adding New Component Documentation

### 1. Create the Doc file

Create `YourComponentDoc.ts` following this schema:

```typescript
const YourComponentDoc = {
    name: 'YourComponent',
    description: 'One-line description here',
    status: 'stable' | 'beta' | 'deprecated' | 'experimental',
    version: '1.0.0',
    
    whenToUse: [
        'Use case 1',
        'Use case 2',
    ],
    
    whenNotToUse: [
        { text: 'Avoid case', alternative: 'Use Alternative instead' },
    ],
    
    overview: {
        description: 'Extended description...',
        variants: ['primary', 'secondary'],
        demos: [Demo1, Demo2],
    },
    
    props: [
        { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", required: false, description: '...' },
    ],
    
    anatomy: {
        parts: [
            { name: 'Container', description: '...' },
        ],
    },
    
    inUse: {
        dos: ['Do this'],
        donts: ['Don\'t do this'],
        examples: [{ title: 'Basic', description: '...', code: '...' }],
    },
    
    accessibility: {
        keyboard: [{ key: 'Tab', action: '...' }],
        aria: [{ attribute: 'role', usage: '...' }],
        screenReader: '...',
    },
    
    relatedComponents: [
        { name: 'OtherComponent', description: 'Use when...' },
    ],
    
    responsiveBehavior: [
        { breakpoint: 'Mobile', behavior: '...' },
    ],
};

export default YourComponentDoc;
```

### 2. Create Demo components

```tsx
import { DemoCard } from '../../shared/components';

export const BasicDemo: React.FC = () => (
    <DemoCard title="Basic Usage" description="...">
        <YourComponent />
    </DemoCard>
);
```

### 3. Register in registry.ts

Add your component to the appropriate category in `CATEGORIES`.

---

## Style Guidelines

### Writing Style
- Use **clear, concise language**
- Use **active voice**
- Target **100% first-time reader comprehension**

### Code Examples
- Show **realistic use cases**
- Include **necessary imports**
- Keep examples **focused** (one concept per example)

### Accessibility
- **Never skip** the Accessibility tab
- Test with **screen readers** if possible
- Include **keyboard interaction** documentation

---

## Deprecation Process

When deprecating a component:

1. Set `status: 'deprecated'`
2. Add migration guide in `inUse.examples`
3. Add notice in description: "Deprecated in v2.0. Use [Alternative] instead."
4. Keep documentation for **at least 2 major versions**

---

## Questions?

Contact the Design System team or open an issue in the repository.
