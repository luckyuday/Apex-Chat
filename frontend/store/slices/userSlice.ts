import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { user } from "../../types/user";
const initialState: user = {
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { changeUser } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.userState.email;
