import React from 'react';

/**
 * Icon Library
 * Collection of SVG path definitions for common icons
 * These are the raw icon definitions - use with <Icon> component
 */

export const AlertCircle = () => (
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </>
);

export const CheckCircle = () => (
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </>
);

export const AlertTriangle = () => (
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </>
);

export const XCircle = () => (
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </>
);

export const InfoCircle = () => (
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 11V16M12 8V8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </>
);

export const XClose = () => (
  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
);

export const Spinner = () => (
  <path 
    d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round"
  />
);