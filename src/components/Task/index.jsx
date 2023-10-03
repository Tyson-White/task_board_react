import React from "react";
import Styles from "./Task.module.scss";
import deleteIcon from "../../assets/icons/delete.svg";
import { deleteTask } from "../../redux/slices/boardSlice";
import { useDispatch } from "react-redux";
import { useActions } from "../../redux/hooks/useActions";

export default function Index({ id, name, position }) {
  const TASK_WIDTH = 55;

  const { startDragTask, endDragTask } = useActions();
  const [show, setShow] = React.useState(false);
  const taskRef = React.useRef();
  const dispatch = useDispatch();

  const [isDrag, setIsDrag] = React.useState(false);
  const [downX, setDownX] = React.useState(0);
  const [downY, setDownY] = React.useState(0);
  const [moveY, setMoveY] = React.useState(0);
  const [moveX, setMoveX] = React.useState(0);

  React.useEffect(() => {
    // animation for show
    setTimeout(() => setShow(true), 0.5);
  }, []);

  const onHandleDelete = () => {
    taskRef.current.style.transform = "translate(900px, 0px)";
    setTimeout(() => {
      dispatch(deleteTask(id));
      taskRef.current.style.transform = "translate(0px, 0px)";
    }, 200);
  };

  return (
    <div
      className={
        show ? `${Styles.task_wrapper} ${Styles.show}` : Styles.task_wrapper
      }
      style={{
        left: isDrag ? moveX + "px" : "13px",
        top: isDrag
          ? moveY + "px"
          : 10 * position + position * TASK_WIDTH + "px",
      }}
      ref={taskRef}
      draggable={false}
      onDragStart={() => {
        return false;
      }}
      onMouseDown={(e) => {
        setIsDrag(true);
        setDownX(e.clientX);
        setDownY(e.clientY);
        setMoveY(10 * position + position * TASK_WIDTH);
      }}
      onMouseMove={(e) => {
        if (isDrag) {
          const parent = taskRef.current.parentNode;
          const parentX = parent.getBoundingClientRect().x;
          const parentY = parent.getBoundingClientRect().y;
          const taskX = taskRef.current.getBoundingClientRect().left - parentX;
          const taskY = taskRef.current.getBoundingClientRect().top - parentY;
          taskRef.current.style.transition = "0s";
          taskRef.current.style.zIndex = 200;
          setMoveX(13 + e.clientX - downX);
          setMoveY(10 * position + position * TASK_WIDTH + e.clientY - downY);
        }
      }}
      onMouseUp={() => {
        setIsDrag(false);
        setMoveX(13);
        taskRef.current.style.zIndex = 1;
        taskRef.current.style.left = "13px";
      }}
    >
      <div className={"task"}>
        <div className={Styles.task_title}>{name}</div>
        <img
          src={deleteIcon}
          width={25}
          alt=""
          onClick={() => onHandleDelete()}
        />
      </div>
    </div>
  );
}
