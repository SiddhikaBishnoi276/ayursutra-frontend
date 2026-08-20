// src/app/api.ts — sirf tumhare features ke liye, authApi se independent
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // authApi ka reducerPath 'authApi' hai, isliye clash nahi hoga
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Staff', 'Package', 'DoctorPatients', 'Progress', 'DoctorDiet', 'DoctorPlan'],
    endpoints: () => ({}),
});