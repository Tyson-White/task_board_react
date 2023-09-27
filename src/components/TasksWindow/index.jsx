import React from "react";
import Styles from "./TasksWindow.module.scss";
import editIcon from "../../assets/icons/edit.svg";
import addIcon from "../../assets/icons/addIcon.svg";
import Name from "../Name";
import Task from "../Task";
import cancel from "../../assets/icons/cancel.svg";
import acceptIcon from "../../assets/icons/accept.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import { deleteBoard } from "../../redux/slices/boardSlice";
import { createTask } from "../../redux/slices/boardSlice";
import Confirm from "../../components/Confirm";
import { useActions } from "../../redux/hooks/useActions";
import { useDispatch } from "react-redux";
import { useBoards } from "../../redux/hooks/useBoards";
export default function Index({ id, name, color, tasksList, onAcceptName }) {
  const [cardName, setCardName] = React.useState(name);
  const [cardColor, setCardColor] = React.useState(color);
  const [isEditName, setIsEditName] = React.useState(false);
  const [isNaming, setIsNaming] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();
  const { boards } = useBoards();
  const { toggleConfirm, setSelectedBoard, startDragBoard, endDragBoard } =
    useActions();

  React.useEffect(() => {
    setTimeout(() => setShow(true), 0.5);
  }, []);

  const addTask = () => {
    setIsNaming(false);
    dispatch(createTask({ id, taskName }));
  };

  const editBoardName = () => {
    setCardName("");
    setIsEditName(!isEditName);
  };

  const cancelEnter = () => {
    setCardName(name);
    setIsEditName(false);
  };

  const onClickAccept = () => {
    if (cardName) {
      onAcceptName(name, cardName);
      setIsEditName(false);
    }
  };

  return (
    <>
      <div
        className={
          show ? `${Styles.tasks_Card} ${Styles.show}` : Styles.tasks_Card
        }
        style={{ background: cardColor }}
        draggable={true}
        onDragOver={() => setSelectedBoard(id)}
        onDragEnd={() => endDragBoard(id)}
        onDragStart={() => startDragBoard(id)}
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
            <div className={Styles.title}>
              {!isEditName ? (
                name
              ) : (
                <input
                  type="text"
                  placeholder={"Название..."}
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                  }}
                />
              )}
            </div>
            <div className={Styles.change_icon}>
              {isEditName ? (
                <>
                  <img
                    className={Styles.cancel}
                    src={cancel}
                    onClick={() => cancelEnter()}
                  />
                  <img
                    className={
                      cardName.length < 3
                        ? Styles.accept
                        : `${Styles.accept} ${Styles.enable}`
                    }
                    src={acceptIcon}
                    onClick={() => onClickAccept()}
                  />
                </>
              ) : (
                <img
                  src={editIcon}
                  width={15}
                  alt=""
                  onClick={() => editBoardName()}
                />
              )}
            </div>
            <div className={Styles.deleteBoard}>
              <img
                src={deleteIcon}
                width={18}
                alt=""
                onClick={() => {
                  dispatch(deleteBoard(id));
                }}
              />
            </div>
          </div>
        </div>
        <div
          className={Styles.tasks}
          onDragOver={() => {
            setSelectedBoard(id);
          }}
        >
          {!isNaming ? (
            <div className={Styles.addTask} onClick={() => setIsNaming(true)}>
              <div className={Styles.icon}>
                <img src={addIcon} alt="" />
              </div>
              <div className={Styles.title}>Новая задача</div>
            </div>
          ) : (
            <Name
              onChangeName={(name) => setTaskName(name)}
              onAccept={(name) => addTask(name)}
            />
          )}
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
        </div>
      </div>
    </>
  );
}
