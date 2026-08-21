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
          url: '/auth/mock-login',
          method: 'POST',
          body: {
            role: backendRole,
            email: arg.email,
            password: arg.password,
          },
        };
      },
      transformResponse: (response: any, _meta, arg) => {
        const user = {
          id: response.user_id || response.user?.id || 'u-1',
          name: response.name || response.user?.name || `${arg.role.toUpperCase()} User`,
          email: arg.email || response.email || `${arg.role}@ayursutra.com`,
          role: arg.role,
          clinicId: response.clinic_id || response.user?.clinic_id || '1',
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
          localStorage.setItem('clinicId', user.clinicId);
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