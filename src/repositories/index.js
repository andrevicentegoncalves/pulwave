// src/repositories/index.js
/**
 * Repositories Index
 * Data access layer for the application.
 * 
 * Architecture:
 * Components → Hooks → Services → Repositories → Database Provider
 * 
 * Only repository files should import from lib/supabaseClient.
 * To switch providers, only these files need to change.
 */


export { paymentRepository } from './paymentRepository';
export { profileRepository } from './profileRepository';
export { userRepository } from './userRepository';
export { translationRepository } from './translationRepository';
export { systemRepository } from './systemRepository';
export { propertyRepository } from './propertyRepository';

