import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  idCount: 0,
  boardCount: 0,
  taskCount: 0,
  grabTask: "",
  grabBoard: "",
  overBoard: "",
  overTask: "",
  boardsList: [],
};

export const boardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
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
    deleteTask: (state, { payload }) => {
      const list = state.boardsList;

      const indexBoard = list.indexOf(
        list.find((item) => item.tasks.find((elem) => elem.name == payload))
      );

      const deletedTask = list[indexBoard].tasks.find(
        (item) => item.name == payload
      );

      list[indexBoard].tasks = list[indexBoard].tasks.filter(
        (item) => item != deletedTask
      );

      state.boardsList = list;
      state.taskCount = state.taskCount - 1;
    },
    startDragTask: (state, { payload }) => {
      state.grabTask = payload;
      console.log(payload);
    },
    setSelectedBoard: (state, { payload }) => {
      state.overBoard = payload;
    },
    setSelectedTask: (state, { payload }) => {
      state.overTask = payload;
    },
    endDragTask: (state) => {
      const fromObjIndex = state.boardsList.indexOf(
        state.boardsList.find((item) =>
          item.tasks.find((item) => item.name == state.grabTask)
        )
      );
      const toObjIndex = state.boardsList.indexOf(
        state.boardsList.find((item) => item.id == state.overBoard)
      );

      const list = state.boardsList;

      list[fromObjIndex].tasks = list[fromObjIndex].tasks.filter(
        (item) => item.name != state.grabTask
      );
      list[toObjIndex].tasks = [
        ...list[toObjIndex].tasks,
        { name: state.grabTask },
      ];

      state.boardsList = list;

      state.overBoard = "";
      state.grabTask = "";
    },
    startDragBoard: (state, { payload }) => {
      state.grabBoard = payload;
    },
    endDragBoard: (state) => {
      if (!state.grabTask) {
        const grabbed = state.boardsList.find(
          (item) => item.name == state.grabBoard
        );
        const toPast = state.boardsList.find(
          (item) => item.name == state.overBoard
        );
        const grabbedIndex = state.boardsList.indexOf(grabbed);
        const toPastIndex = state.boardsList.indexOf(toPast);
        const list = state.boardsList;

        list[grabbedIndex] = toPast;
        list[toPastIndex] = grabbed;

        state.boardsList = list;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions } = boardSlice;

export default boardSlice.reducer;
