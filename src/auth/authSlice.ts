import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from './types/login';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getInitialUser = (): AuthUser | null => {
  try {
    if (typeof window === 'undefined') return null;

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role') as any;
    const email = localStorage.getItem('email');
    const clinicId = localStorage.getItem('clinicId') || undefined;

    if (userId || name || role) {
      return {
        id: userId || 'u-1',
        name: name || (role ? `${String(role).charAt(0).toUpperCase() + String(role).slice(1)} User` : 'User'),
        email: email || `${role || 'user'}@ayursutra.com`,
        role: role || 'admin',
        clinicId,
      };
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err);
  }
  return null;
};

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const initialState: AuthState = {
  user: getInitialUser(),
  token: initialToken,
  isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token?: string }>
    ) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('userId', action.payload.user.id);
      localStorage.setItem('role', action.payload.user.role);
      localStorage.setItem('name', action.payload.user.name);
      if (action.payload.user.email) {
        localStorage.setItem('email', action.payload.user.email);
      }
      if (action.payload.user.clinicId) {
        localStorage.setItem('clinicId', action.payload.user.clinicId);
      }
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
        if (state.user.name) localStorage.setItem('name', state.user.name);
        if (state.user.role) localStorage.setItem('role', state.user.role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('clinicId');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
