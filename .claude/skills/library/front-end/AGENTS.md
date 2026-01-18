# Front-End Skills - Category Guide

**Version 2.0.0**
Pulwave Engineering
2026-01-18

> **Note:**
> This is the front-end category compilation for AI agents and LLMs working on the Pulwave codebase.
> This document aggregates all 18 front-end skills with links to detailed implementation guides.

## Abstract

Comprehensive front-end development guide for Pulwave's React 19 + Vite application. Contains 18 skills covering performance optimization, React patterns, component design, accessibility, forms, styling, data visualization, animations, routing, canvas design, theme generation, and UX patterns. Each skill includes quick reference (SKILL.md) and detailed implementation guide (AGENTS.md where available).

**Front-End Tech Stack:**
- React 19 + TypeScript
- Vite 7 (bundler)
- TanStack Query 5 (server state)
- React Router (routing)
- SCSS + BEM + CSS Custom Properties (styling)
- Chart.js (data visualization)
- Radix UI (accessible primitives)

---

## Table of Contents

1. [Performance](#1-performance) (CRITICAL) - ✅ AGENTS.md available
2. [Frameworks](#2-frameworks) (CRITICAL) - React patterns
3. [Component Design](#3-component-design) (HIGH) - CVA, compound components
4. [Accessibility](#4-accessibility) (HIGH) - WCAG 2.1 AA compliance
5. [Styling](#5-styling) (HIGH) - SCSS, BEM, theming
6. [Forms](#6-forms) (HIGH) - Form state, validation
7. [Data Visualization](#7-data-visualization) (MEDIUM) - Charts, graphs
8. [Layout](#8-layout) (MEDIUM) - Flexbox, Grid, responsive
9. [Routing](#9-routing) (MEDIUM) - React Router patterns
10. [UX Patterns](#10-ux-patterns) (MEDIUM) - Loading, error, empty states
11. [Animations](#11-animations) (MEDIUM) - CSS animations, transitions
12. [SEO (Frontend)](#12-seo-frontend) (MEDIUM) - Meta tags, structured data
13. [Testing (Frontend)](#13-testing-frontend) (HIGH) - Component tests
14. [PWA](#14-pwa) (LOW) - Progressive Web App features
15. [Canvas Design](#15-canvas-design) (LOW) - Interactive canvas-based design
16. [Theme Factory](#16-theme-factory) (LOW) - Design theme generation
17. [Frontend Design](#17-frontend-design) (LOW) - Frontend design utilities
18. [React Patterns](#18-react-patterns) (MEDIUM) - Vercel React best practices (47 rules)

---

## 1. Performance

**Location**: [performance/](performance/)
**Quick Ref**: [SKILL.md](performance/SKILL.md)
**Full Guide**: ✅ [AGENTS.md](performance/AGENTS.md)

**Impact**: CRITICAL

30+ rules for optimizing React applications. Covers waterfalls elimination, bundle size reduction, re-render optimization, rendering performance, JavaScript optimization, client-side data fetching, and advanced patterns.

### Key Categories

1. **Eliminating Waterfalls** (CRITICAL) - 67% faster load times
   - Use `Promise.all()` for parallel fetching
   - Defer `await` until needed
   - TanStack Query automatic deduplication
   - Start promises early

2. **Bundle Size Optimization** (CRITICAL) - Reduces bundle by 50-500KB
   - Avoid barrel imports
   - Dynamic imports for heavy components
   - Defer third-party scripts
   - Load features on demand

3. **Re-render Optimization** (MEDIUM) - 60-90% fewer re-renders
   - Don't subscribe for callback-only state
   - Memo expensive components
   - Primitive dependencies in effects
   - Functional setState

4. **Rendering Performance** (MEDIUM) - 60fps animations
   - Animate transform/opacity only
   - content-visibility for long lists
   - Hoist static JSX

5. **JavaScript Performance** (LOW-MEDIUM) - 50-100x faster operations
   - Set/Map for lookups
   - Index Map for repeated lookups
   - Combine iterations

6. **Client-Side Data Fetching** (MEDIUM-HIGH)
   - Deduplicate event listeners
   - Passive scroll listeners
   - Version localStorage data

7. **Advanced Patterns** (LOW)
   - Store handlers in refs
   - useLatest hook

### When to Use

- Optimizing slow pages
- Reducing bundle size
- Improving Core Web Vitals (LCP, INP, CLS)
- Code review for performance regressions
- Any component with >100ms render time
- Lists with >50 items
- Heavy features (editors, charts, visualizations)

### Quick Wins

```typescript
// 1. Parallel fetching (67% faster)
const [profile, settings, preferences] = await Promise.all([
  profileService.getProfile(userId),
  settingsService.getSettings(userId),
  preferencesService.getPreferences(userId),
]);

// 2. Direct imports (99% smaller)
import Check from 'lucide-react/dist/esm/icons/check'; // 2KB
// Not: import { Check } from 'lucide-react'; // 500KB

// 3. Dynamic imports (70% faster TTI)
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

// 4. TanStack Query (automatic deduplication)
const { data: user } = useProfile(userId); // Shares requests across components
```

---

## 2. Frameworks

**Location**: [frameworks/](frameworks/)
**Quick Ref**: [SKILL.md](frameworks/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: CRITICAL

Comprehensive React 19 development patterns covering hooks, performance optimization, UI patterns, state management, and component architecture. Essential for all React development in Pulwave.

### Key Patterns

- **Defer await until needed** - Move awaits into branches
- **Use Promise.all()** - Parallelize independent async operations
- **Avoid barrel imports** - Import directly from source files
- **Dynamic imports** - Lazy-load heavy components
- **Profile first** - Use React DevTools before optimizing

### When to Use

- Building React components and features
- Optimizing React application performance
- Implementing UI patterns (loading, error, empty states)
- Debugging re-render issues
- Reviewing React code

---

## 3. Component Design

**Location**: [component-design/](component-design/)
**Quick Ref**: [SKILL.md](component-design/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: HIGH

CVA (Class Variance Authority) patterns, compound components, controlled vs uncontrolled inputs, prop API design, component composition patterns.

### Key Patterns

- **CVA for variant management** - Type-safe CSS class composition
- **BEM for SCSS structure** - `.block__element--modifier`
- **Compound components** - Context-based composition
- **Forward refs** - Expose DOM refs for input components

### When to Use

- Creating new UI components
- Designing component APIs
- Refactoring for better composition
- Adding variants to existing components

---

## 4. Accessibility

**Location**: [accessibility/](accessibility/)
**Quick Ref**: [SKILL.md](accessibility/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: HIGH

WCAG 2.1 AA compliance patterns, ARIA attributes, keyboard navigation, screen reader support, focus management.

### Key Patterns

- **Semantic HTML first** - Use `<button>`, `<a>`, `<label>` before ARIA
- **aria-label for icon buttons** - Always provide text alternative
- **focus-visible for keyboard focus** - Visible focus without mouse outline
- **aria-live for async updates** - Announce dynamic changes

### When to Use

- Creating interactive components
- Implementing forms and inputs
- Building modals and dialogs
- Code review for accessibility
- Fixing accessibility audit issues

---

## 5. Styling

**Location**: [styling/](styling/)
**Quick Ref**: [SKILL.md](styling/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: HIGH

SCSS + BEM methodology, CSS custom properties, design tokens from Foundation package, dark mode implementation, responsive design.

### Key Patterns

- **CSS custom properties** - Use design tokens (`--color-text-primary`)
- **BEM naming** - `.block__element--modifier`
- **Design tokens** - Import from `@pulwave/foundation`
- **color-scheme: dark** - Enable dark mode properly

### When to Use

- Styling new components
- Implementing dark mode
- Creating responsive layouts
- Refactoring styles for consistency
- Using design system tokens

---

## 6. Forms

**Location**: [forms/](forms/)
**Quick Ref**: [SKILL.md](forms/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: HIGH

Form state management, validation patterns, error handling, accessibility for forms, controlled vs uncontrolled inputs.

### Key Patterns

- **Controlled inputs with validation** - Real-time validation feedback
- **Inline errors** - Show errors next to fields
- **Submit button states** - Disabled during submission
- **autocomplete attributes** - Better UX and autofill

### When to Use

- Building forms
- Implementing validation
- Handling form submission
- Improving form UX
- Accessibility for forms

---

## 7. Data Visualization

**Location**: [data-visualization/](data-visualization/)
**Quick Ref**: [SKILL.md](data-visualization/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

Chart.js patterns, responsive charts, accessibility for visualizations, performance optimization for large datasets.

### Key Patterns

- **Lazy load charts** - Dynamic import for Chart.js
- **Memoize chart config** - Prevent re-creation
- **Accessible descriptions** - ARIA labels for charts
- **Virtualization** - For >100 data points

### When to Use

- Creating charts and graphs
- Visualizing data
- Building dashboards
- Optimizing chart performance

---

## 8. Layout

**Location**: [layout/](layout/)
**Quick Ref**: [SKILL.md](layout/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

Flexbox patterns, CSS Grid layouts, responsive design, container queries, mobile-first approach.

### Key Patterns

- **Flexbox for one-dimensional layouts** - Rows, columns, centering
- **Grid for two-dimensional layouts** - Complex page layouts
- **Mobile-first CSS** - Start with mobile, scale up
- **Container queries** - Component-level responsiveness

### When to Use

- Creating page layouts
- Building responsive components
- Centering elements
- Complex grid layouts

---

## 9. Routing

**Location**: [routing/](routing/)
**Quick Ref**: [SKILL.md](routing/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

React Router patterns, code splitting at route level, route guards, lazy loading routes, URL state management.

### Key Patterns

- **Route-based code splitting** - Lazy load route components
- **URL as source of truth** - Filters, pagination in URL
- **Route guards** - Authentication, permission checks
- **Nested routes** - Layout composition

### When to Use

- Adding new routes
- Implementing navigation
- Code splitting by route
- URL state synchronization

---

## 10. UX Patterns

**Location**: [ux-patterns/](ux-patterns/)
**Quick Ref**: [SKILL.md](ux-patterns/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

Loading states, error handling, empty states, skeleton screens, optimistic updates, feedback patterns.

### Key Patterns

- **Loading only when no cache** - `if (loading && !data)`
- **Error boundaries** - Catch and display errors gracefully
- **Empty states** - Meaningful empty state messages
- **Skeleton screens** - Better perceived performance

### When to Use

- Implementing loading states
- Error handling
- Empty state design
- User feedback
- Optimistic updates

---

## 11. Animations

**Location**: [animations/](animations/)
**Quick Ref**: [SKILL.md](animations/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

CSS animations, transitions, performance considerations, `prefers-reduced-motion`, animation libraries.

### Key Patterns

- **Animate transform/opacity** - GPU-accelerated
- **prefers-reduced-motion** - Respect user preference
- **Transition specific properties** - Not `transition: all`
- **will-change sparingly** - Use only for complex animations

### When to Use

- Adding animations
- Implementing transitions
- Creating micro-interactions
- Optimizing animation performance

---

## 12. SEO (Frontend)

**Location**: [seo-frontend/](seo-frontend/)
**Quick Ref**: [SKILL.md](seo-frontend/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: MEDIUM

Meta tags, Open Graph, structured data, semantic HTML, performance for SEO, social media cards.

### Key Patterns

- **Meta tags** - Title, description, keywords
- **Open Graph** - Social media previews
- **Structured data** - JSON-LD for rich snippets
- **Semantic HTML** - Proper heading hierarchy

### When to Use

- Optimizing for search engines
- Social media sharing
- Improving page discoverability

---

## 13. Testing (Frontend)

**Location**: [testing-frontend/](testing-frontend/)
**Quick Ref**: [SKILL.md](testing-frontend/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: HIGH

Testing Library patterns, component testing, user interaction testing, accessibility testing, mocking.

### Key Patterns

- **Test behavior, not implementation** - User-centric tests
- **Testing Library queries** - Prefer `getByRole`, `getByLabelText`
- **User events** - Simulate real interactions
- **Accessibility tests** - `jest-axe` for a11y

### When to Use

- Testing React components
- User interaction testing
- Accessibility validation
- Regression testing

---

## 14. PWA

**Location**: [pwa/](pwa/)
**Quick Ref**: [SKILL.md](pwa/SKILL.md)
**Full Guide**: ⚠️ AGENTS.md coming soon

**Impact**: LOW

Progressive Web App features, service workers, offline support, install prompts, push notifications.

### Key Patterns

- **Service worker** - Cache assets for offline
- **Manifest.json** - App metadata for install
- **Offline fallback** - Graceful offline experience
- **Install prompt** - Guide users to install

### When to Use

- Adding offline support
- Enabling app installation
- Push notifications
- Improving mobile experience

---

## Usage Workflows

### Building a New Component

**Typical workflow:**
```typescript
// 1. Design component API (component-design)
export interface ButtonProps {
  variant?: 'primary' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 2. Implement with CVA (component-design)
const buttonVariants = cva('btn', {
  variants: { variant: {...}, size: {...} }
});

// 3. Style with SCSS + BEM (styling)
.btn { /* base styles */ }
.btn--primary { /* variant */ }

// 4. Add accessibility (accessibility)
<button aria-label="Submit" className={buttonVariants({ variant, size })}>
  {children}
</button>

// 5. Test with Testing Library (testing-frontend)
test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

---

### Optimizing Slow Page

**Typical workflow:**
```bash
# 1. Profile with React DevTools (frameworks, performance)
# Identify slow components

# 2. Check bundle size (performance)
npm run build -- --mode analyze

# 3. Apply optimizations (performance)
# - Add Promise.all() for parallel fetching
# - Dynamic import heavy components
# - Memo expensive components
# - Check for barrel imports

# 4. Measure improvements (performance)
# Run Lighthouse audit
# Check Core Web Vitals

# 5. Add tests (testing-frontend)
# Ensure optimizations don't break functionality
```

---

### Building a Form

**Typical workflow:**
```typescript
// 1. Design form structure (forms)
interface FormData {
  name: string;
  email: string;
}

// 2. Implement with controlled inputs (forms)
const [formData, setFormData] = useState<FormData>({...});

// 3. Add validation (forms)
const errors = validateForm(formData);

// 4. Ensure accessibility (accessibility)
<label htmlFor="name">Name</label>
<input
  id="name"
  type="text"
  aria-invalid={!!errors.name}
  aria-describedby="name-error"
/>
{errors.name && <span id="name-error">{errors.name}</span>}

// 5. Handle submission (forms)
const handleSubmit = async (e) => {
  e.preventDefault();
  await submitForm(formData);
};

// 6. Test form interactions (testing-frontend)
test('submits form', async () => {
  const user = userEvent.setup();
  render(<Form />);
  await user.type(screen.getByLabelText('Name'), 'John');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  // assertions
});
```

---

## Skill Priority by Experience Level

### Junior Developers
1. **frameworks** (CRITICAL) - React basics
2. **component-design** (HIGH) - Component patterns
3. **styling** (HIGH) - How to style
4. **accessibility** (HIGH) - A11y basics
5. **testing-frontend** (HIGH) - How to test

### Mid-Level Developers
1. **performance** (CRITICAL) - Optimization techniques
2. **forms** (HIGH) - Complex form handling
3. **routing** (MEDIUM) - Navigation patterns
4. **ux-patterns** (MEDIUM) - Better UX
5. **data-visualization** (MEDIUM) - Charts

### Senior Developers
1. **performance** (CRITICAL) - Advanced optimization
2. **component-design** (HIGH) - API design
3. **animations** (MEDIUM) - Smooth interactions
4. **seo-frontend** (MEDIUM) - SEO optimization
5. **pwa** (LOW) - Offline support

---

## 15. Canvas Design

**Location**: [canvas-design/](canvas-design/)
**Quick Ref**: [SKILL.md](canvas-design/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Interactive canvas-based design tools and utilities. Create visual designs using HTML5 Canvas API with provided fonts and templates.

**Includes**: 50+ web fonts for canvas design projects.

**See individual skill folder for full documentation and examples.**

---

## 16. Theme Factory

**Location**: [theme-factory/](theme-factory/)
**Quick Ref**: [SKILL.md](theme-factory/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Design theme generation tools for creating cohesive color schemes, typography systems, and design tokens.

**See individual skill folder for full documentation, examples, and theme showcase.**

---

## 17. Frontend Design

**Location**: [frontend-design/](frontend-design/)
**Quick Ref**: [SKILL.md](frontend-design/SKILL.md)
**Provider**: Anthropic

**Impact**: LOW

Frontend design utilities and patterns for building polished user interfaces with attention to visual hierarchy, spacing, and design principles.

**See individual skill folder for full documentation and examples.**

---

## 18. React Patterns

**Location**: [react-patterns/](react-patterns/)
**Quick Ref**: [SKILL.md](react-patterns/SKILL.md)
**Provider**: Vercel (via investigate folder)

**Impact**: MEDIUM

Vercel's comprehensive React and Next.js performance optimization guidelines. Contains 47 rules across 8 categories prioritized by impact.

**Rule Categories:**
1. **Eliminating Waterfalls** (CRITICAL) - async optimization
2. **Bundle Size Optimization** (CRITICAL) - code splitting, dynamic imports
3. **Server-Side Performance** (HIGH) - React.cache(), serialization
4. **Client-Side Data Fetching** (MEDIUM-HIGH) - SWR patterns
5. **Re-render Optimization** (MEDIUM) - memo, transitions
6. **Rendering Performance** (MEDIUM) - browser optimization
7. **JavaScript Performance** (LOW-MEDIUM) - general optimizations
8. **Advanced Patterns** (LOW) - stable refs, event handlers

**Total Rules**: 47 (each in individual markdown file in `rules/` folder)

**See individual skill folder for full documentation, all 47 rules, and detailed examples.**

---

## Coverage Status

| Skill | SKILL.md | AGENTS.md | Priority |
|-------|----------|-----------|----------|
| performance | ✅ | ✅ | CRITICAL |
| frameworks | ✅ | ⚠️ Q1 | CRITICAL |
| component-design | ✅ | ⚠️ Q2 | HIGH |
| accessibility | ✅ | ⚠️ Q2 | HIGH |
| styling | ✅ | ⚠️ Q2 | HIGH |
| forms | ✅ | ⚠️ Q2 | HIGH |
| testing-frontend | ✅ | ⚠️ Q2 | HIGH |
| data-visualization | ✅ | ⚠️ Q3 | MEDIUM |
| layout | ✅ | ⚠️ Q3 | MEDIUM |
| routing | ✅ | ⚠️ Q3 | MEDIUM |
| ux-patterns | ✅ | ⚠️ Q3 | MEDIUM |
| animations | ✅ | ⚠️ Q3 | MEDIUM |
| seo-frontend | ✅ | ⚠️ Q3 | MEDIUM |
| pwa | ✅ | ⚠️ Q4 | LOW |
| canvas-design | ✅ | ✅ | LOW |
| theme-factory | ✅ | ✅ | LOW |
| frontend-design | ✅ | ✅ | LOW |
| react-patterns | ✅ | ✅ | MEDIUM |

**Current**: 5/18 skills with AGENTS.md (28%)
**Q1 Target**: 6/18 skills (33%)
**Q2 Target**: 12/18 skills (67%)

---

## Related Categories

- **Architecture** - [../architecture/AGENTS.md](../architecture/AGENTS.md) - System design, layer patterns
- **Data** - [../data/AGENTS.md](../data/AGENTS.md) - State management, data fetching
- **Testing** - [../testing/AGENTS.md](../testing/AGENTS.md) - Testing strategies
- **Tools** - [../tools/AGENTS.md](../tools/AGENTS.md) - Development tools

---

## Further Reading

- [Pulwave Architecture Guide](../../../CLAUDE.md)
- [Master Skills Library](../AGENTS.md)
- [React 19 Documentation](https://react.dev/)
- [Web.dev Performance](https://web.dev/performance/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Version History

### 2.0.0 (2026-01-18)
- Added: canvas-design skill (interactive canvas design with 50+ fonts)
- Added: theme-factory skill (design theme generation)
- Added: frontend-design skill (frontend design utilities)
- Added: react-patterns skill (Vercel React best practices, 47 rules)
- Total skills: 14 → 18
- Updated: Table of contents, coverage status
- Migration: Skills moved from `.claude/skills/anthropic/` and `.claude/skills/investigate/` to `.claude/skills/library/front-end/`

### 1.0.0 (2026-01-16)
- Initial version with 14 skills

---

**Last Updated**: 2026-01-18
**Version**: 2.0.0
**Total Skills**: 18
**With AGENTS.md**: 5 (performance, canvas-design, theme-factory, frontend-design, react-patterns)
**Maintained By**: Pulwave Engineering
