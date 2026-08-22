import { apiSlice } from "../../app/api";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => "/notifications/my",
            providesTags: ['Notification'],
        }),
        markNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ['Notification'],
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: ['Notification'],
        }),
        registerDeviceToken: builder.mutation<{ success: boolean }, { token: string }>({
            query: (body) => ({
                url: "/notifications/register-token",
                method: "POST",
                body,
            }),
        }),
        testSendNotification: builder.mutation({
            query: (body) => ({
                url: "/notifications/test-send",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useRegisterDeviceTokenMutation,
    useTestSendNotificationMutation
} = notificationApi;