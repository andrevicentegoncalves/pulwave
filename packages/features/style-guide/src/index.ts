/**
 * Shared components for style-guide documentation
 */

// Core
export * from './core/RegistryContext';
export * from './core/types';

// Components
export { DemoCard } from './components/DemoCard';
export type { DemoCardProps } from './components/DemoCard';

export { ComponentDocPage } from './components/ComponentDocPage';
export type { ComponentDocProps } from './components/ComponentDocPage';

export { StyleGuideShell } from './pages/StyleGuideShell';
export type { StyleGuideShellProps } from './pages/StyleGuideShell';

export { CodeBlock } from './components/CodeBlock';
export type { CodeBlockProps } from './components/CodeBlock';

export { PropTable } from './components/PropTable';
export type { PropDefinition, PropTableProps } from './components/PropTable';

export { FoundationDocPage } from './components/FoundationDocPage';
export type { FoundationDocProps, FoundationSection } from './components/FoundationDocPage';

export { Guidance } from './components/Guidance';
export type { GuidanceProps, GuidanceItem } from './components/Guidance';

export { TokenTable } from './components/TokenTable';
export type { TokenTableProps, TokenVariant, TokenState } from './components/TokenTable';

export { StructureSpec } from './components/StructureSpec';
export type { StructureSpecProps, StructureItem } from './components/StructureSpec';

export { KeyboardShortcutTable } from './components/KeyboardShortcutTable';
export type { KeyboardShortcutTableProps, KeyboardShortcut } from './components/KeyboardShortcutTable';

export { RelatedComponentCards } from './components/RelatedComponentCards';
export type { RelatedComponentCardsProps, RelatedComponent } from './components/RelatedComponentCards';

export { LivePlayground } from './components/LivePlayground';
export type { LivePlaygroundProps, PlaygroundControl } from './components/LivePlayground';

export { AnatomyDiagram } from './components/AnatomyDiagram';
export type { AnatomyDiagramProps, AnatomyPart } from './components/AnatomyDiagram';

export { AccessibilityStatusBadges } from './components/AccessibilityStatusBadges/AccessibilityStatusBadges';
export type { AccessibilityStatusBadgesProps, AccessibilityStatus } from './components/AccessibilityStatusBadges/AccessibilityStatusBadges';

export { StyleGuideLink } from './components/StyleGuideLink/StyleGuideLink';
export type { StyleGuideLinkProps } from './components/StyleGuideLink/StyleGuideLink';

export { DemoGrid, DemoGridCard } from './components/DemoGrid/DemoGrid';
export type { DemoGridProps, DemoGridCardProps } from './components/DemoGrid/DemoGrid';

export { LibraryToggle } from './components/LibraryToggle';
export type { LibraryToggleProps, ChartLibraryType } from './components/LibraryToggle';

// Components
export { IconLibrary } from './components/IconLibrary/IconLibrary';

// Hooks
export { useStyleGuideNavigation } from './hooks/useStyleGuideNavigation';
export type { StyleGuideNavigation } from './hooks/useStyleGuideNavigation';

// Registry
export * from './registry';

// Utils
export { getColorTokens, getSpacingTokens, getTypographyTokens } from './utils/tokenData';
export type { Token } from './utils/tokenData';

// Pattern Demos
export { DataTransferBasicDemo } from './content/patterns/data/DataTransferButton/demos';
