import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/members',
  }),
  tagTypes: ['Member'],
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: () => '/',
      providesTags: ['Member'],
    }),
    getMember: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),
    updateMember: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Member', id }],
    }),
    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Member'],
    }),
  }),
});
export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = membersApi;
