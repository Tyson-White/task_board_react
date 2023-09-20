import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./slices/boardSlice";

export const store = configureStore({
  reducer: {
    boards: boardSlice,
  },
});
