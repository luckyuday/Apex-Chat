import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { chat, chatResponse, createChat } from "../../types/chat";
import { messageApi } from "./messageApi";
import { setChatId, selectChat } from "../slices/chatIdSlice";
// Type-only: erased at runtime, so this doesn't create a runtime circular
// import even though store.ts imports chatApi for its reducer.
import type { RootState } from "../store";

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
    deleteChat: build.mutation<{ message: string }, string>({
      query: (chatID) => ({ url: `/${chatID}`, method: "DELETE" }),
      invalidatesTags: ["CHAT"],
      async onQueryStarted(deletedChatId, { dispatch, getState, queryFulfilled }) {
        await queryFulfilled;
        // Clear only the deleted chat's message cache — deleting a
        // background chat must not wipe the active chat's history.
        dispatch(
          messageApi.util.upsertQueryData("getMessages", deletedChatId, []),
        );
        if (selectChat(getState() as RootState) === deletedChatId) {
          dispatch(setChatId(""));
        }
      },
    }),
  }),
});
export const {
  useGetChatsQuery,
  useCreateChatMutation,
  useDeleteChatMutation,
} = chatApi;
