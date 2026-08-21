import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (userId) {
        headers.set('x-user-id', userId);
      }
      return headers;
    },
  }),
  tagTypes: [
    'TherapistQueue',
    'TherapistSession',
    'TherapistAvailability',
    'TherapistWorkload',
    'PatientDashboard',
    'PatientPlan',
    'PatientAppointments',
    'PatientFeedback',
    'Staff',
    'Rooms',
    'Protocols',
    'Package',
    'Progress',
    'DoctorPatients',
    'DoctorDiet',
    'DoctorPlan',
    'Questions',
  ],
  endpoints: () => ({}),
});
