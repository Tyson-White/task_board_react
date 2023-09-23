import React from "react";
import Styles from "./Task.module.scss";
import deleteIcon from "../../assets/icons/delete.svg";
import { useActions } from "../../redux/hooks/useActions";

export default function Index({ name }) {
  const { startDragTask, endDragTask, deleteTask } = useActions();
  const [show, setShow] = React.useState(false);
  const taskRef = React.useRef();

  React.useEffect(() => {
    // animation for show
    setTimeout(() => setShow(true), 0.5);
  }, []);

  const onHandleDelete = () => {
    taskRef.current.style.transform = "translate(900px, 0px)";
    setTimeout(() => {
      deleteTask(name);
      taskRef.current.style.transform = "translate(0px, 0px)";
    }, 200);
  };

  const illuminationOn = (e) => {
    if (e.target.className == "task") {
      e.target.style.boxShadow = "0px 2px 1px #000";
    }
  };

  const illuminationOff = (e) => {
    if (e.target.className == "task") {
      e.target.style.boxShadow = "0px 0px 0px grey";
    }
  };
  return (
    <div
      className={
        show ? `${Styles.task_wrapper} ${Styles.show}` : Styles.task_wrapper
      }
      ref={taskRef}
      draggable={true}
      onDragOver={(e) => illuminationOn(e)}
      onDragLeave={(e) => illuminationOff(e)}
      onDragStart={() => startDragTask(name)}
      onDragEnd={() => endDragTask()}
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
