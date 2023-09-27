import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "nanoid";

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoardsStatus",
  async (userId, thunkAPI) => {
    const result = axios.get("http://localhost:5174/boards").then((res) => {
      return res.data;
    });
    return result;
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (boardName, thunkAPI) => {
    const id = nanoid(5);
    const obj = {
      id: id,
      name: boardName,
      color: "#242424",
      tasks: [],
    };
    axios.post("http://localhost:5174/boards", obj);

    return obj;
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id, thunkAPI) => {
    console.log(id);
    axios.delete(`http://localhost:5174/boards/${id}`);

    return id;
  }
);

export const fetchTasks = createAsyncThunk(
  "boards/fetchTasks",
  async (thunkAPI) => {
    const result = axios.get("http://localhost:5174/tasks").then((res) => {
      return res.data;
    });

    return result;
  }
);

export const createTask = createAsyncThunk(
  "boards/createTask",
  async (item, thunkAPI) => {
    const id = `${nanoid(5)}-t`;

    const obj = {
      id,
      name: item.taskName,
      link: item.id,
    };

    axios.post("http://localhost:5174/tasks", obj);

    return obj;
  }
);

export const deleteTask = createAsyncThunk(
  "board/deleteTask",
  (id, thunkAPI) => {
    axios.delete(`http://localhost:5174/tasks/${id}`);

    return id;
  }
);

const initialState = {
  isLoading: false,
  idCount: 0,
  boardCount: 0,
  taskCount: 0,
  grabTask: "",
  grabBoard: "",
  overBoard: "",
  overTask: "",
  boardsList: [],
  tasksList: [],
};

export const boardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    startDragTask: (state, { payload }) => {
      state.grabBoard = "";
      state.grabTask = payload;
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
    endDragBoard: (state, { payload }) => {
      if (state.grabTask == "") {
        const grabbed = state.boardsList.find(
          (item) => item.id == state.grabBoard
        );
        const toPast = state.boardsList.find(
          (item) => item.id == state.overBoard
        );

        const grabbedIndex = state.boardsList.indexOf(grabbed);
        const toPastIndex = state.boardsList.indexOf(toPast);
        const list = state.boardsList;

        list[grabbedIndex] = toPast;
        list[toPastIndex] = grabbed;

        state.boardsList = list;
        state.grabBoard = "";
        state.overBoard = "";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBoards.fulfilled, (state, actions) => {
      state.boardsList = actions.payload;
      state.boardCount = state.boardCount + actions.payload.length;
      state.isLoading = false;
      state.boardCount = state.boardsList.length;
    });
    builder.addCase(fetchBoards.rejected, (state, action) => {
      state.isLoading = false;
      state.boardsList = [];
    });
    builder.addCase(createBoard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boardsList = [...state.boardsList, action.payload];

      state.idCount = state.idCount + 1;
      state.boardCount = state.boardCount + 1;
      state.isLoading = false;
    });
    builder.addCase(deleteBoard.fulfilled, (state, action) => {
      console.log(action.payload);
      const list = state.boardsList.filter((item) => item.id != action.payload);
      const obj = state.boardsList.find((item) => item.id == action.payload);
      state.boardsList = list;
      state.boardCount = state.boardCount - 1;
      state.taskCount = state.taskCount - obj.tasks.length;
      state.isConfirm = !state.isConfirm;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasksList = [...state.tasksList, action.payload];
      state.taskCount = state.taskCount + 1;
    });
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.tasksList = payload;
      state.taskCount = state.tasksList.length;
    });
    builder.addCase(deleteTask.fulfilled, (state, { payload }) => {
      const deletedTask = state.tasksList.find((item) => item.id == payload);

      state.tasksList = state.tasksList.filter((item) => item != deletedTask);
      state.taskCount = state.taskCount - 1;
    });
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = boardSlice;

export default boardSlice.reducer;
