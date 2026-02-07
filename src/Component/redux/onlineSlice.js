import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: [], // 👈 ARRAY, not Set
  reducers: {
    setAll: (_, action) => {
      return action.payload; // payload = [1, 2, 3]
    },
    update: (state, action) => {
      const { userId, status } = action.payload;

      if (status === "online" && !state.includes(userId)) {
        state.push(userId);
      }

      if (status === "offline") {
        return state.filter((id) => id !== userId);
      }
    },
  },
});

export const { setAll, update } = onlineSlice.actions;
export default onlineSlice.reducer;
