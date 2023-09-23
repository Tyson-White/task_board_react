import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./slices/boardSlice";
import popupSlice from "./slices/popupSlice";

export const store = configureStore({
  reducer: {
    boards: boardSlice,
    popups: popupSlice,
  },
});
