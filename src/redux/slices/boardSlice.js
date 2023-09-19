import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const boardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = boardSlice.actions;

export default boardSlice.reducer;
