import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { chat, chatResponse, createChat } from "../../types/chat";
import { messageApi } from "./messageApi";
import { setChatId } from "../slices/chatIdSlice";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/chat`,
    credentials: "include",
  }),
  tagTypes: ["CHAT"],
  endpoints: (build) => ({
    getChats: build.query<chat[], void>({
      query: () => "/",
      providesTags: ["CHAT"],
    }),
    createChat: build.mutation<chatResponse, createChat>({
      query: (chatName) => ({ url: "/", body: chatName, method: "POST" }),
      invalidatesTags: ["CHAT"],
    }),
    deleteChat: build.mutation<string, string>({
      query: (chatID) => ({ url: `/${chatID}`, method: "DELETE" }),
      invalidatesTags: ["CHAT"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(messageApi.util.resetApiState());
        dispatch(setChatId(""));
      },
    }),
  }),
});
export const {
  useGetChatsQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
} = chatApi;
