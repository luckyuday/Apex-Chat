import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Message } from "../../types/message";
export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/message/",
    credentials: "include",
  }),
  tagTypes: ["MESSAGES"],
  endpoints: (build) => ({
    getMessages: build.query<Message[], string>({
      query: (chatId) => ({ url: `/${chatId}` }),
      providesTags: ["MESSAGES"],
    }),
  }),
});
export const { useGetMessagesQuery } = messageApi;
