import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import OnlineSlice from "./onlineSlice"
// import {enableMapSet} from "immer";
// enableMapSet();

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    online:OnlineSlice,
  },
});
