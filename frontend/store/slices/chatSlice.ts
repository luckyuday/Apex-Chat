import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { chat } from "../../types/chat";

const initialState: chat = {
  _id: "",
  title: "New Chat",
  lastActivity: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeChat: (state, action: PayloadAction<chat>) => {
      state.title = action.payload.title;
      state._id = action.payload._id;
      state.lastActivity = action.payload.lastActivity;
    },
  },
});

export const { changeChat } = chatSlice.actions;
export default chatSlice.reducer;
export const selectChat = (state: RootState) => state.userState.email;
