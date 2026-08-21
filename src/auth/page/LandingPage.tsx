/**
 * src/auth/page/LandingPage.tsx
 *
 * The global landing page has been moved to src/common/landing/LandingPage.tsx
 * because it is shared across all roles (Admin, Doctor, Therapist, Patient)
 * and is not auth-specific.
 *
 * This file re-exports it so that App.tsx routing requires zero changes.
 */
export { LandingPage } from '../../Common/landing/LandingPage';
