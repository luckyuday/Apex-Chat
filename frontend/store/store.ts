import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { chatApi } from "./api/chatApi";

export const store = configureStore({
  reducer: {
    userState: userReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
