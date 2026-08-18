export type UserRole = 'admin' | 'doctor' | 'therapist';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string;
}

export interface LoginRequest {
  role: UserRole;
  email: string; // We will just mock this for now
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}