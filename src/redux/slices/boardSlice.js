import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
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
    const getPos = thunkAPI.getState((state) => state).boards.boardCount;
    const id = nanoid(5);
    const obj = {
      id: id,
      name: boardName,
      position: getPos,
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
    axios
      .delete(`http://localhost:5174/boards/${id}`)
      .then(() => {
        thunkAPI.dispatch(changePositios(id));
      })
      .catch((err) => {
        console.log("Ошибка");
      });

    return id;
  }
);

export const changePositios = createAsyncThunk(
  "boards/changePositios",
  async (item, thunkAPI) => {
    if (item.id) {
      axios.put(`http://localhost:5174/boards/${item.id}`, {
        ...item,
        position: item.position - 1,
      });
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "boards/fetchTasks",
  async (item, thunkAPI) => {
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
    moveBoard: (state, action) => {
      const fromIndex = current(state).boardsList.indexOf(
        current(state).boardsList.find(
          (item) => item.position == action.payload.moveFrom
        )
      );
      const toIndex = current(state).boardsList.indexOf(
        current(state).boardsList.find(
          (item) => item.position == action.payload.moveTo
        )
      );

      if (state.boardsList[toIndex].position) {
        console.log(fromIndex, toIndex);
        state.boardsList[fromIndex].position = action.payload.moveTo;
        state.boardsList[toIndex].position = action.payload.moveFrom;
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
      let list = state.boardsList;
      const pos = list.indexOf(list.find((item) => item.id == action.payload));
      const obj = state.boardsList.find((item) => item.id == action.payload);
      for (let i = pos + 1; i < list.length; i++) {
        console.log(list[i].position);
        state.boardsList[i].position -= 1;
      }
      // state.boardsList = list.filter((item) => item.id != action.payload);

      state.boardCount = state.boardCount - 1;
      state.taskCount = state.taskCount - obj.tasks.length;
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
