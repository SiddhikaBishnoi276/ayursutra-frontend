import { apiSlice } from "../../app/api";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: "/notifications/my",
                method: "GET",
                headers: {
                    'x-user-id': localStorage.getItem('userId') || 'default',
                },
            }),
            providesTags: ['Notification'],
        }),
        markNotificationAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
                headers: {
                    'x-user-id': localStorage.getItem('userId') || 'default',
                },
            }),
            invalidatesTags: ['Notification'],
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
                headers: {
                    'x-user-id': localStorage.getItem('userId') || 'default',
                },
            }),
            invalidatesTags: ['Notification'],
        }),
        registerDeviceToken: builder.mutation<{ success: boolean }, { token: string }>({
            query: (body) => ({
                url: "/notifications/register-token",
                method: "POST",
                headers: {
                    'x-user-id': localStorage.getItem('userId') || 'default',
                },
                body,
            }),
        }),
        testSendNotification: builder.mutation({
            query: (body) => ({
                url: "/notifications/test-send",
                method: "POST",
                headers: {
                    'x-user-id': localStorage.getItem('userId') || 'default',
                },
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