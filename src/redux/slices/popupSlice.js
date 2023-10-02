import { createSlice } from "@reduxjs/toolkit";

export const popupSlice = createSlice({
  name: "popupSlice",
  initialState: {
    isConfirm: false,
  },
  reducers: {
    toggleConfirm: (state) => {
      state.isConfirm = !state.isConfirm;
    },
  },
});

export const { actions } = popupSlice;

export default popupSlice.reducer;
