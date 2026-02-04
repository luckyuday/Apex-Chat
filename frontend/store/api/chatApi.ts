import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { chat } from "../../types/chat";
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/chat",
    credentials: "include",
  }),
  endpoints: (build) => ({
    getChats: build.query<chat[], void>({
      query: () => "/",
    }),
  }),
});
export const { useGetChatsQuery } = chatApi;
