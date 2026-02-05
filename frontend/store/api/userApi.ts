import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { authResponse, loginForm, UserForm } from "../../types/user";
import { chatApi } from "./chatApi";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["USER"],
  endpoints: (build) => ({
    getUser: build.query<authResponse, void>({
      query: () => "/user",
      providesTags: ["USER"],
    }),
    loginUser: build.mutation<authResponse, loginForm>({
      query: (login) => ({
        url: "/auth/login",
        method: "POST",
        body: login,
      }),
      invalidatesTags: ["USER"],
    }),
    registerUser: build.mutation<authResponse, UserForm>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["USER"],
    }),
    logoutUser: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(userApi.util.resetApiState());
        dispatch(chatApi.util.resetApiState());
      },
    }),
  }),
});
export const {
  useGetUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = userApi;
