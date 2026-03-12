import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Message } from "../../types/message";
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return "http://localhost:3000";
};
export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/message/`,
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
