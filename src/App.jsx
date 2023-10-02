import React from "react";
import AddButton from "./components/AddButton";
import TasksWindow from "./components/TasksWindow";
import Name from "./components/Name";
import Header from "./components/Header";
import lightTheme from "./assets/img/sky.jpg";
import nightTheme from "./assets/img/sky_night.png";
import sun from "./assets/icons/sun.svg";
import moon from "./assets/icons/moon.svg";
import loadinGif from "./assets/icons/loading.gif";
import SelectedPlace from "./components/SelectedPlace";
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
  const [placeOptions, setPlaceOptions] = React.useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const dispatch = useDispatch();

  const { boards } = useBoards();

  React.useEffect(() => {
    dispatch(fetchBoards());
    dispatch(fetchTasks());
  }, []);

  const createWindow = (name) => {
    dispatch(createBoard(name));
  };

  const changeBoardName = (boardName, newName) => {
    const list = windowsList;
    const index = list.indexOf(list.find((item) => item.name == boardName));

    list[index].name = newName;

    setWindowsList([...list]);
  };

  return (
    <>
      <div className={theme == "light" ? "content" : "content night"}>
        <Header />
        <div className="wrapper" draggable={false}>
          <div className="sidebar">
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
              onClick={() => {
                if (theme == "light") {
                  setTheme("dark");
                } else {
                  setTheme("light");
                }
              }}
            >
              <div
                className={theme == "light" ? "toggle" : "toggle toggle_dark"}
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
              boards.boardCount < 1 && (
                <>
                  <p>Нет досок</p>
                </>
              )
            )}
            <SelectedPlace
              width={placeOptions.width}
              height={placeOptions.height}
              x={placeOptions.x}
              y={placeOptions.y}
            />
            {boards.boardsList.length > 0 &&
              boards.boardsList.map((item) => (
                <>
                  <TasksWindow
                    id={item.id}
                    name={item.name}
                    position={item.position}
                    key={item.id}
                    tasksList={item.tasks}
                    color={item.color}
                    onChangePlace={(width, height, x, y) =>
                      setPlaceOptions({ width, height, x, y })
                    }
                    onAcceptName={(boardName, newName) =>
                      changeBoardName(boardName, newName)
                    }
                  />
                </>
              ))}
            <AddButton onAccept={(name) => createWindow(name)} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
