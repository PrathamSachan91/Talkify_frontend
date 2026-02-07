import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: new Set(),
  reducers: {
    setAll: (_, action) => new Set(action.payload),
    update: (state, action) => {
      const { userId, status } = action.payload;
      status === "online" ? state.add(userId) : state.delete(userId);
    },
  },
});

export const { setAll, update } = onlineSlice.actions;
export default onlineSlice.reducer;
