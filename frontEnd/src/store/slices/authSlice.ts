import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminInfo {
  id: string;
  email: string;
  username: string;
  fullName: string;
}

interface AuthState {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("admin_token"),
  admin: JSON.parse(localStorage.getItem("admin_info") || "null"),
  isAuthenticated: !!localStorage.getItem("admin_token"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (
      state,
      action: PayloadAction<{ admin: AdminInfo; token: string }>,
    ) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("admin_token", action.payload.token);
      localStorage.setItem("admin_info", JSON.stringify(action.payload.admin));
    },
    setLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_info");
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;

export default authSlice.reducer;
