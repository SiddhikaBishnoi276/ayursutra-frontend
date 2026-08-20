import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, ROLE_DASHBOARD_MAP } from '../types/login';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/auth/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      // TODO: Replace queryFn with real endpoint when backend is ready:
      // query: (body) => ({ url: 'login', method: 'POST', body }),
      queryFn: async (arg) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Basic mock validation — backend will handle real auth
        if (!arg.email || !arg.password) {
          return { error: { status: 400, data: { message: 'Email and password are required.' } } };
        }

        const mockNames: Record<string, string> = {
          admin: 'Clinic Admin',
          doctor: 'Dr. Suresh Menon',
          therapist: 'Priya Nair',
          patient: 'Amit Sharma',
          mtb: 'MTB Coordinator',
        };

        const mockResponse: LoginResponse = {
          token: `mock-jwt-${arg.role}-token-${Date.now()}`,
          user: {
            id: `u-${arg.role}-1`,
            name: mockNames[arg.role] ?? arg.role,
            email: arg.email,
            role: arg.role,
            clinicId: 'clinic-ayursutra-001',
          },
        };

        return { data: mockResponse };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;