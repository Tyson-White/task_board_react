import React from "react";
import AddButton from "./components/AddButton";
import TasksWindow from "./components/TasksWindow";
import Name from "./components/Name";
import Header from "./components/Header";
import lightTheme from "./assets/img/sky.jpg";
import nightTheme from "./assets/img/sky_night.jpg";
import sun from "./assets/icons/sun.svg";
import moon from "./assets/icons/moon.svg";
import loadinGif from "./assets/icons/loading.gif";
import {
  fetchBoards,
  createBoard,
  fetchTasks,
} from "./redux/slices/boardSlice";
import { useDispatch } from "react-redux";

import { useBoards } from "./redux/hooks/useBoards";

function App() {
  const [theme, setTheme] = React.useState("light");
  const [windowsList, setWindowsList] = React.useState([]);
  const [isNamingWindow, setIsNamingWindow] = React.useState(false);
  const [name, setName] = React.useState("");
  const dispatch = useDispatch();

  const { boards } = useBoards();

  React.useEffect(() => {
    dispatch(fetchBoards());
    dispatch(fetchTasks());
  }, []);

  const createWindow = () => {
    dispatch(createBoard(name));
    setName("");
    setIsNamingWindow(false);
  };

  const changeBoardName = (boardName, newName) => {
    const list = windowsList;
    const index = list.indexOf(list.find((item) => item.name == boardName));

    list[index].name = newName;

    setWindowsList([...list]);
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
              <p>{boards.boardCount}</p>
            </div>
            <div className="task_info">
              Всего задач:
              <p>{boards.taskCount}</p>
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
            {boards.isLoading ? (
              <>
                <p>
                  <img src={loadinGif} width={60} height={60} alt="" />
                </p>
              </>
            ) : (
              boards.boardsList.length < 1 && (
                <>
                  <p>Нет досок</p>
                </>
              )
            )}
            {boards.boardsList.length > 0 &&
              boards.boardsList.map((item) => (
                <>
                  <TasksWindow
                    id={item.id}
                    name={item.name}
                    key={item.id}
                    tasksList={item.tasks}
                    color={item.color}
                    onAcceptName={(boardName, newName) =>
                      changeBoardName(boardName, newName)
                    }
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
