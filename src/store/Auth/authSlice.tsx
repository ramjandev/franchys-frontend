import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Tstate = {
  accessToken: string | null;
  restToken: string | null;
};

const initialState: Tstate = {
  accessToken: null,
  restToken: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        console.error("Invalid payload received:", action.payload);
        return;
      }

      state.accessToken = action.payload;
    },
    addResetToken: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        console.error("Invalid payload received:", action.payload);
        return;
      }
      state.restToken = action.payload;
    },
    clearResetToken: (state) => {
      state.restToken = null;
    },

    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setUser, addResetToken, clearResetToken, logout } =
  authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
