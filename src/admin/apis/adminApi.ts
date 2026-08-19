import { apiSlice } from '../../app/api';
import { 
    initialStaff, 
    initialPackages, 
    initialRooms, 
    initialQuestions, 
    initialNotifications, 
    initialActivities 
} from '../data/mockData';

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaff: builder.query<typeof initialStaff, void>({
            queryFn: async () => ({ data: initialStaff }),
        }),
        getPackages: builder.query<typeof initialPackages, void>({
            queryFn: async () => ({ data: initialPackages }),
        }),
        getRooms: builder.query<typeof initialRooms, void>({
            queryFn: async () => ({ data: initialRooms }),
        }),
        getQuestions: builder.query<typeof initialQuestions, void>({
            queryFn: async () => ({ data: initialQuestions }),
        }),
        getNotifications: builder.query<typeof initialNotifications, void>({
            queryFn: async () => ({ data: initialNotifications }),
        }),
        getActivities: builder.query<typeof initialActivities, void>({
            queryFn: async () => ({ data: initialActivities }),
        }),
    }),
});

export const {
    useGetStaffQuery,
    useGetPackagesQuery,
    useGetRoomsQuery,
    useGetQuestionsQuery,
    useGetNotificationsQuery,
    useGetActivitiesQuery,
} = adminApi;
