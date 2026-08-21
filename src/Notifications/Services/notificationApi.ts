import { apiSlice } from "../../app/api";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerDeviceToken: builder.mutation<{ success: boolean }, { token: string }>({
            query: (body) => ({
                url: "/notifications/register-token",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useRegisterDeviceTokenMutation } = notificationApi;