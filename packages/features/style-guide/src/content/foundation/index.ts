/**
 * Foundation Content - Exports
 * 
 * Organized by folder structure with docs and demos
 */

// Color
export { ColorDoc } from './Color/docs';
export * from './Color/demos';

// Typography
export { TypographyDoc } from './Typography/docs';
export { TypeScaleDemo as TypographyScale, FontWeightsDemo as TypographyWeights } from './Typography/demos';

// Spacing
export { SpacingDoc } from './Spacing/docs';
export { default as SpacingScaleDemo } from './Spacing/demos/SpacingScaleDemo';

// Elevation
export { ElevationDoc } from './Elevation/docs';
export * from './Elevation/demos';
// Name specifically to avoid 'scale' collision
export { scale as ElevationScale } from './Elevation/demos';

// Motion
export { MotionDoc } from './Motion/docs';
export * from './Motion/demos';

// Grid
export * from './Grid/demos';

// Borders
export { BordersDoc } from './Borders/docs';
export * from './Borders/demos';

// Breakpoints
export { BreakpointsDoc } from './Breakpoints/docs';
export { scale as BreakpointsScale } from './Breakpoints/demos';

// Z-Index
export { ZIndexDoc } from './ZIndex/docs';
export { scale as ZIndexScale } from './ZIndex/demos';

// Iconography
export { IconographyDoc } from './Iconography/docs';
export * from './Iconography/demos';

// Accessibility
export { AccessibilityDoc } from './Accessibility/docs';
export * from './Accessibility/demos';
