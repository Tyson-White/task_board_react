import React from "react";
import AddButton from "./components/AddButton";
import TasksWindow from "./components/TasksWindow";
import Name from "./components/Name";
import Header from "./components/Header";
import lightTheme from "./assets/img/sky.jpg";
import nightTheme from "./assets/img/sky_night.jpg";
import sun from "./assets/icons/sun.svg";
import moon from "./assets/icons/moon.svg";
import { addBoard } from "./redux/slices/boardSlice";
import { useSelector, useDispatch } from "react-redux";
function App() {
  const [theme, setTheme] = React.useState("light");
  const [idCount, setIdCount] = React.useState(0);
  const [boardCount, setBoardCount] = React.useState(0);
  const [taskCount, setTaskCount] = React.useState(0);
  const [windowsList, setWindowsList] = React.useState([]);
  const [isNamingWindow, setIsNamingWindow] = React.useState(false);
  const [name, setName] = React.useState("");
  const [board, setBoard] = React.useState();
  const [grabbedItem, setGrabbedItem] = React.useState();
  const [grabbedBoard, setGrabbedBoard] = React.useState();
  const [changedBoard, setChangedBoard] = React.useState();

  const dispatch = useDispatch();

  const boardsList = useSelector((state) => state.boards.boardsList);

  const createWindow = () => {
    dispatch(addBoard(name));
    setName("");
    setIsNamingWindow(false);
  };

  const addTask = (boardName, taskName) => {};

  const onHandleTaskStart = (name) => {
    setGrabbedItem(name);
  };

  const onHandleTaskOver = (name) => {
    setBoard(name);
  };

  const onHandleTaskEnd = () => {
    const fromObjIndex = windowsList.indexOf(
      windowsList.find((item) =>
        item.tasks.find((item) => item.name == grabbedItem)
      )
    );
    const toObjIndex = windowsList.indexOf(
      windowsList.find((item) => item.name == board)
    );

    const list = windowsList;

    list[fromObjIndex].tasks = list[fromObjIndex].tasks.filter(
      (item) => item.name != grabbedItem
    );
    list[toObjIndex].tasks = [...list[toObjIndex].tasks, { name: grabbedItem }];

    setWindowsList([...list]);

    setBoard();
    setGrabbedItem();
  };

  const changeBoardName = (boardName, newName) => {
    const list = windowsList;
    const index = list.indexOf(list.find((item) => item.name == boardName));

    list[index].name = newName;

    setWindowsList([...list]);
  };

  const onDeleteTask = (boardName, taskName) => {
    const list = windowsList;

    const indexBoard = list.indexOf(
      list.find((item) => item.name == boardName)
    );

    const deletedTask = list[indexBoard].tasks.find(
      (item) => item.name == taskName
    );

    list[indexBoard].tasks = list[indexBoard].tasks.filter(
      (item) => item != deletedTask
    );

    setWindowsList([...list]);
    setTaskCount(taskCount - 1);
  };

  const onHandleBoardStart = (name) => {
    setGrabbedBoard(name);
  };

  const onHandleBoardOver = (name) => {
    setChangedBoard(name);
  };

  const onHandleBoardEnd = () => {
    if (!grabbedItem) {
      const grabbed = windowsList.find((item) => item.name == grabbedBoard);
      const toPast = windowsList.find((item) => item.name == changedBoard);
      const grabbedIndex = windowsList.indexOf(grabbed);
      const toPastIndex = windowsList.indexOf(toPast);
      const list = windowsList;

      list[grabbedIndex] = toPast;
      list[toPastIndex] = grabbed;

      setWindowsList([...list]);
    }
  };

  return (
    <>
      <div
        className="content"
        style={{
          background:
            theme == "light" ? `url(${lightTheme})` : `url(${nightTheme})`,
        }}
      >
        <Header />
        <div className="wrapper" draggable={false}>
          <div className="sidebar">
            <AddButton onClick={() => setIsNamingWindow(true)} />
            {isNamingWindow && (
              <div className="editName">
                <Name
                  onChangeName={(item) => {
                    setName(item);
                  }}
                  onAccept={() => createWindow()}
                />
              </div>
            )}
            <div className="board_info">
              Всего досок:
              <p>{boardCount}</p>
            </div>
            <div className="task_info">
              Всего задач:
              <p>{taskCount}</p>
            </div>
            <div
              className={
                theme == "light" ? "select_theme" : "select_theme dark_theme"
              }
            >
              <div
                className={theme == "light" ? "toggle" : "toggle toggle_dark"}
                onClick={() => {
                  if (theme == "light") {
                    setTheme("dark");
                  } else {
                    setTheme("light");
                  }
                }}
              >
                {theme == "light" ? (
                  <img src={sun} alt="" width={20} />
                ) : (
                  <img src={moon} alt="" width={20} />
                )}
              </div>
            </div>
          </div>

          <div className="boards">
            {boardsList.length < 1 && (
              <>
                <p>Нет досок</p>
              </>
            )}
            {boardsList.map((item, index) => (
              <>
                <TasksWindow
                  id={item.id}
                  name={item.name}
                  key={item.id}
                  tasksList={item.tasks}
                  color={item.color}
                  onDeleteTask={(boardName, taskName) =>
                    onDeleteTask(boardName, taskName)
                  }
                  onAcceptName={(boardName, newName) =>
                    changeBoardName(boardName, newName)
                  }
                  onHandleTaskOver={(name) => onHandleTaskOver(name)}
                  onHandleTaskStart={(name) => onHandleTaskStart(name)}
                  onHandleTaskEnd={(name) => onHandleTaskEnd(name)}
                  onHandleBoardStart={(name) => onHandleBoardStart(name)}
                  onHandleBoardOver={(name) => onHandleBoardOver(name)}
                  onHandleBoardEnd={() => onHandleBoardEnd()}
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
