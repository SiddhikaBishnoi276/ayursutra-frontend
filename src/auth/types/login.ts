// Auth types for AyurSutra
// Backend will expect: POST /api/v1/auth/login → { email, password, role }

export type UserRole = 'admin' | 'doctor' | 'therapist' | 'patient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  admin: '/admin-dashboard',
  doctor: '/doctor-dashboard',
  therapist: '/therapist-dashboard',
  patient: '/patient-dashboard',
  
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Admin',
  doctor: 'Doctor',
  therapist: 'Therapist',
  patient: 'Patient',
  
};