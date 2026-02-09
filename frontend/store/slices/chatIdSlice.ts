import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state

// Define the initial state using that type
const initialState: { _id: string } = {
  _id: "",
};

export const chatId = createSlice({
  name: "chatId",
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state._id = action.payload;
    },
  },
});

export const { setChatId } = chatId.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectChat = (state: RootState) => state.chatId._id;

export default chatId.reducer;
