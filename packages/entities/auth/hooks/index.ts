/**
 * Auth Domain Hooks
 * 
 * Note: Authentication is primarily service-based in this architecture.
 * Hooks for auth state management are added here as needed.
 * 
 * For most auth operations, use the authService directly:
 * - authService.signIn()
 * - authService.signOut()
 * - authService.getCurrentUser()
 */

// Re-export auth keys for convenience
export { authKeys } from '../keys';

// Future hooks will be exported from here
// Example: export { useCurrentUser } from './useCurrentUser';
