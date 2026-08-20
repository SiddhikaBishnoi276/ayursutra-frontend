import { apiSlice } from '../../apis';
import staffData from '../data/staff.json';
import packagesData from '../data/packages.json';
import roomsData from '../data/rooms.json';
import questionsData from '../data/questions.json';
import notificationsData from '../data/notifications.json';
import activitiesData from '../data/activities.json';
import statsData from '../data/stats.json';
import {
  StaffMember,
  TherapyPackage,
  Room,
  PrakritiQuestion,
  NotificationLog,
  ActivityLog,
} from '../types/admin.types';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<StaffMember[], void>({
      queryFn: async () => ({ data: staffData as StaffMember[] }),
      providesTags: ['Staff'],
    }),
    addStaff: builder.mutation<StaffMember, Omit<StaffMember, 'id' | 'status'>>({
      queryFn: async (newStaff) => {
        const created: StaffMember = {
          ...newStaff,
          id: `S-${Date.now().toString().slice(-4)}`,
          status: 'Active',
        };
        return { data: created };
      },
      invalidatesTags: ['Staff'],
    }),
    updateStaffStatus: builder.mutation<StaffMember, { id: string; status: StaffMember['status'] }>({
      queryFn: async ({ id, status }) => {
        const found = (staffData as StaffMember[]).find((s) => s.id === id);
        return { data: { ...found!, status } };
      },
      invalidatesTags: ['Staff'],
    }),
    getPackages: builder.query<TherapyPackage[], void>({
      queryFn: async () => ({ data: packagesData as TherapyPackage[] }),
      providesTags: ['Package'],
    }),
    createPackage: builder.mutation<TherapyPackage, Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>>({
      queryFn: async (newPkg) => {
        const created: TherapyPackage = {
          ...newPkg,
          id: `PKG-${Date.now().toString().slice(-3)}`,
          status: 'Active',
          createdBy: 'admin',
          authorName: 'Clinic Administrator',
        };
        return { data: created };
      },
      invalidatesTags: ['Package'],
    }),
    getRooms: builder.query<Room[], void>({
      queryFn: async () => ({ data: roomsData as Room[] }),
    }),
    updateRoomStatus: builder.mutation<Room, { id: string; status: Room['status'] }>({
      queryFn: async ({ id, status }) => {
        const found = (roomsData as Room[]).find((r) => r.id === id);
        return { data: { ...found!, status } };
      },
    }),
    getActivities: builder.query<ActivityLog[], void>({
      queryFn: async () => ({ data: activitiesData as ActivityLog[] }),
    }),
    getStats: builder.query<typeof statsData, void>({
      queryFn: async () => ({ data: statsData }),
    }),
    getQuestions: builder.query<PrakritiQuestion[], void>({
      queryFn: async () => ({ data: questionsData as PrakritiQuestion[] }),
    }),
    updateQuestion: builder.mutation<PrakritiQuestion, PrakritiQuestion>({
      queryFn: async (updated) => ({ data: updated }),
    }),
    getNotificationLogs: builder.query<NotificationLog[], void>({
      queryFn: async () => ({ data: notificationsData as NotificationLog[] }),
    }),
    retryNotification: builder.mutation<NotificationLog, { id: string }>({
      queryFn: async ({ id }) => {
        const found = (notificationsData as NotificationLog[]).find((n) => n.id === id);
        return { data: { ...found!, status: 'Sent' } };
      },
    }),
  }),
});

export const {
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffStatusMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useGetRoomsQuery,
  useUpdateRoomStatusMutation,
  useGetActivitiesQuery,
  useGetStatsQuery,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useGetNotificationLogsQuery,
  useRetryNotificationMutation,
} = adminApi;
