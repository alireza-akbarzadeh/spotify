/**
 * Auth Feature - Simplified Production-Ready Structure
 *
 * Clean, straightforward authentication without complex DDD patterns
 */

// Services
export * from './services/user.service';
export * from './services/session.service';

// Types
export * from './types';

// UI Components
export * from './presentation/ui/login-form';
export * from './presentation/ui/register-form';
export * from './presentation/ui/sign-out-button';
export * from './presentation/ui/social-login';
export * from './presentation/ui/password-input';
export * from './presentation/ui/auth-provider-button';
