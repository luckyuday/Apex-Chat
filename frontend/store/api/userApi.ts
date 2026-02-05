import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { authResponse, loginForm, user, UserForm } from "../../types/user";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  tagTypes: ["USER"],
  endpoints: (build) => ({
    getUser: build.query<user, void>({
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
  }),
});
export const {
  useGetUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} = userApi;
