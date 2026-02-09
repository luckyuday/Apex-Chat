import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { chatApi } from "./api/chatApi";
import { messageApi } from "./api/messageApi";
import chatId from "./slices/chatIdSlice";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    chatId: chatId,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(chatApi.middleware)
      .concat(messageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
