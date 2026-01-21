import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface uiState {
  token: string;
  chatId: string;
}
const initialState: uiState = {
  token: "",
  chatId: "",
};

export const UiSlice = createSlice({
  name: "UiState",
  initialState,
  reducers: {
    changeToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    changeChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
  },
});

export const { changeChatId, changeToken } = UiSlice.actions;

export default UiSlice.reducer;
