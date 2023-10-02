import React from "react";
import Styles from "./TasksWindow.module.scss";
import addIcon from "../../assets/icons/addIcon.svg";
import Task from "../Task";
import deleteIcon from "../../assets/icons/delete.svg";
import { changePositios, deleteBoard } from "../../redux/slices/boardSlice";
import { createTask } from "../../redux/slices/boardSlice";
import { useActions } from "../../redux/hooks/useActions";
import { useDispatch } from "react-redux";
import { useBoards } from "../../redux/hooks/useBoards";
export default function Index({ id, name, color, position, onChangePlace }) {
  const BOARD_POS_X = 20 + 20 * position + 268 * position;
  const BOARD_WIDTH = 268;

  // board info
  const [cardColor, setCardColor] = React.useState(color);
  const [isNaming, setIsNaming] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [show, setShow] = React.useState(false);

  const [isDrag, setIsDrag] = React.useState(false);
  const [downX, setDownX] = React.useState(0);
  const [moveX, setMoveX] = React.useState(BOARD_POS_X);
  const [downY, setDownY] = React.useState();
  const [moveY, setMoveY] = React.useState();

  const boardRef = React.useRef();

  const dispatch = useDispatch();

  const { boards } = useBoards();
  const { setSelectedBoard, moveBoard } = useActions();

  React.useEffect(() => {
    setTimeout(() => setShow(true), 0.5);
  }, []);

  const addTask = () => {
    setIsNaming(false);
    dispatch(createTask({ id, taskName }));
  };

  const onDeleteBoard = () => {
    let list = boards.boardsList;
    const deletedIndex = list.indexOf(list.find((item) => item.id == id));
    if (deletedIndex + 1) {
      for (let i = deletedIndex + 1; i < list.length; i++) {
        const changedItem = list[i];
        dispatch(changePositios(changedItem));
      }
    }

    dispatch(deleteBoard(id));
    boardRef.current.style.display = "none";
  };

  // самая сложная часть, делал 6 дней...
  const onMoveBoard = (e) => {
    if (isDrag) {
      boardRef.current.style.transform = "rotate(10deg)";

      const parentX = boardRef.current.parentNode.getBoundingClientRect().x;

      // высчитываем позицию карточки относительно элемента boards
      // берем x коорд. доски и вычитаем x коорд. элемента boards
      const boardX = boardRef.current.getBoundingClientRect().x - parentX;

      const boardHeight = boardRef.current.getBoundingClientRect().height;
      const objPos = boards.boardsList.find((item) => item.id == id).position;

      const nextObj = boards.boardsList.find(
        (item) => item.position == objPos + 1
      );
      const prevObj = boards.boardsList.find(
        (item) => item.position == objPos - 1
      );

      // записываем координаты так, чтобы при передвижении доска не меняла свое положение
      setMoveX(BOARD_POS_X + (e.clientX - downX));
      setMoveY(e.clientY - downY);

      // подсветка снизу доски, обозначающая место, куда поставится карточка
      onChangePlace(BOARD_WIDTH, boardHeight, BOARD_POS_X, 5);

      /* 
      перемещение вперед
      проверка nextObj для того, чтобы приложение не сломалось, если впереди 
      ничего нет
      */
      if (nextObj) {
        const nextX = 20 + 20 * nextObj.position + 268 * nextObj.position;

        if (boardX > nextX) {
          setDownX(e.clientX);
          moveBoard({ moveFrom: objPos, moveTo: objPos + 1 });
        }
      }

      /* 
      перемещение назад(!!сломано!!)
      проверка nextObj для того, чтобы приложение не сломалось, если впереди 
      ничего нет
      */

      if (prevObj) {
        const prevX = 20 + 20 * prevObj.position + 268 * prevObj.position;

        if (boardX < prevX) {
          setDownX(e.clientX);
          moveBoard({ moveFrom: objPos, moveTo: objPos - 1 });
        }
      }
    }
  };

  // конец перемещения, обнуляем позиции, убираем эффекты
  const moveEnd = () => {
    setIsDrag(false);
    setDownX(0);
    setMoveX(BOARD_POS_X);
    setMoveY(5);
    boardRef.current.style.border = "none";
    boardRef.current.style.transform = "rotate(0)";
    onChangePlace(0, 0, 0, 0);
  };

  // записываем координаты клика и немного эффектов
  const moveStart = (e) => {
    setIsDrag(true);
    setDownX(e.clientX);
    setMoveX(BOARD_POS_X);
    setDownY(e.clientY);
    boardRef.current.style.border = "2px dotted #4d4d4d";
  };

  // если мышка ушла с элемента перетаскивание отменяется
  const moveCrash = () => {
    setIsDrag(false);
    setDownX(0);
    setMoveX(BOARD_POS_X);
    setMoveY(5);
    boardRef.current.style.border = "none";
    boardRef.current.style.transform = "rotate(0)";
    onChangePlace(0, 0, 0, 0);
  };

  return (
    <>
      <div
        className={
          show ? `${Styles.tasks_Card} ${Styles.show} ` : Styles.tasks_Card
        }
        style={{
          background: cardColor,
          left: !isDrag ? BOARD_POS_X + "px" : moveX + "px",
          top: moveY,
          zIndex: isDrag && 100,
          transition: isDrag && 0 + "s",
          width: BOARD_WIDTH + "px",
        }}
        onDragStart={(e) => {
          e.preventDefault();
        }}
        onDrag={(e) => e.preventDefault()}
        onMouseDown={(e) => moveStart(e)}
        onMouseMove={(e) => onMoveBoard(e)}
        onMouseLeave={() => moveCrash()}
        onMouseUp={() => moveEnd()}
        ref={boardRef}
      >
        <div className={Styles.card_Header}>
          <div className={Styles.color_change}>
            <input
              type="color"
              value={cardColor}
              onChange={(e) => setCardColor(e.target.value)}
            />
          </div>

          <div className={Styles.card_name}>
            <div className={Styles.title}>{name}</div>
            <div className={Styles.deleteBoard}>
              <img src={deleteIcon} width={18} alt="" onClick={onDeleteBoard} />
            </div>
          </div>
        </div>
        <div
          className={Styles.tasks}
          onDragOver={() => {
            setSelectedBoard(id);
          }}
        >
          {boards.tasksList.length > 0 &&
            boards.tasksList.map(
              (item, index) =>
                item.link == id && (
                  <Task
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    onDeleteTask={(taskName) => deleteTask({ name, taskName })}
                  />
                )
            )}
          <div className={Styles.addTask} onClick={() => setIsNaming(true)}>
            <div className={Styles.icon}>
              <img src={addIcon} alt="" />
            </div>
            <div className={Styles.title}>Новая задача</div>
          </div>

          {isNaming && (
            <div className={Styles.enterName}>
              <textarea
                placeholder="Введите заголовок"
                name=""
                id=""
                cols="30"
                rows="2"
                onChange={(e) => setTaskName(e.target.value)}
              ></textarea>
              <div className={Styles.actions}>
                <button className={Styles.accept} onClick={() => addTask()}>
                  Добавить задачу
                </button>
                <button
                  className={Styles.cancel}
                  onClick={() => setIsNaming(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
