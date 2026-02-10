import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,        
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔐 Login success
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // 🚪 Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    // ⏳ Optional: loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
