import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse } from '../types/login';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      // We use queryFn to bypass the real network request and return mock JSON
      queryFn: async (arg) => {
        // Simulate a 1-second network delay for the hackathon presentation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock JSON Response based on the role selected
        const mockResponse: LoginResponse = {
          token: 'mock-jwt-token-12345',
          user: {
            id: 'u-1',
            name: arg.role === 'admin' ? 'Clinic Admin' : arg.role === 'doctor' ? 'Dr. Suresh' : 'Therapist Priya',
            email: arg.email,
            role: arg.role,
            clinicId: 'clinic-xyz'
          }
        };
        
        return { data: mockResponse };
      }
    }),
  }),
});

export const { useLoginMutation } = authApi;