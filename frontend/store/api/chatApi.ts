import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { chat, createChat } from "../../types/chat";
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/chat",
    credentials: "include",
  }),
  tagTypes: ["CHAT"],
  endpoints: (build) => ({
    getChats: build.query<chat[], void>({
      query: () => "/",
      providesTags: ["CHAT"],
    }),
    createChat: build.mutation<chat, createChat>({
      query: (chatName) => ({ url: "/", body: chatName, method: "POST" }),
      invalidatesTags: ["CHAT"],
    }),
  }),
});
export const { useGetChatsQuery, useCreateChatMutation } = chatApi;
