import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse } from '../types/login';
import { setCredentials } from '../authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (arg) => {
        const backendRole = arg.role === 'admin' ? 'clinic_admin' : arg.role;
        return {
          url: '/auth/login',
          method: 'POST',
          body: {
            email: arg.email.trim(),
            password: arg.password,
            role: backendRole,
          },
        };
      },
      transformResponse: (response: any, _meta, arg) => {
        const userObj = response.user || response;
        const user = {
          id: userObj.id || response.user_id || 'u-1',
          name: userObj.name || response.name || `${arg.role.toUpperCase()} User`,
          email: userObj.email || response.email || arg.email,
          role: arg.role,
          clinicId: userObj.clinic_id || response.clinic_id || '1',
        };
        const token = response.token || `jwt-${user.id}-${Date.now()}`;

        // Persist session in localStorage for auth headers & session state
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        if (user.clinicId) {
          localStorage.setItem('clinicId', String(user.clinicId));
        }

        return {
          token,
          user,
        };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // Ignore mutation errors handled by component
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;