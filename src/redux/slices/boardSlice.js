import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idCount: 0,
  boardCount: 0,
  taskCount: 0,
  boardsList: [],
  isConfirm: false,
};

export const boardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleConfirm: (state) => {
      state.isConfirm = !state.isConfirm;
    },
    addBoard: (state, action) => {
      state.boardsList = [
        ...state.boardsList,
        {
          id: state.idCount,
          name: action.payload,
          color: "#242424",
          tasks: [],
        },
      ];
      state.idCount = state.idCount + 1;
      state.boardCount = state.boardCount + 1;
    },
    addTask: (state, { payload }) => {
      const obj = state.boardsList.find((item) => item.name == payload.name);
      const index = state.boardsList.indexOf(obj);
      const list = state.boardsList;
      list[index].tasks = [...obj.tasks, { name: payload.taskName }];
      state.boardsList = list;

      state.taskCount = state.taskCount + 1;
    },
    deleteBoard: (state, { payload }) => {
      const list = state.boardsList.filter((item) => item.name != payload);
      const obj = state.boardsList.find((item) => item.name == payload);
      state.boardsList = list;
      state.boardCount = state.boardCount - 1;
      state.taskCount = state.taskCount - obj.tasks.length;
      state.isConfirm = !state.isConfirm;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleConfirm, addBoard, addTask, deleteBoard } =
  boardSlice.actions;

export default boardSlice.reducer;
