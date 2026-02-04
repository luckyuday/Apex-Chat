import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { user } from "../../types/user";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
  }),
  endpoints: (build) => ({
    getUser: build.query<user, void>({
      query: () => "/user",
    }),
  }),
});
export const { useGetUserQuery } = userApi;
