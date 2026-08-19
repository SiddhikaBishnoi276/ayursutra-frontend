// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../auth/apis/Authapi';
import { apiSlice } from './api';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;