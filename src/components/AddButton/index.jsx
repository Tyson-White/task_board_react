import React from "react";
import Styles from "./addButton.module.scss";
import addIcon from "../../assets/icons/addIcon.svg";
import { useBoards } from "../../redux/hooks/useBoards";

export default function Index({ onAccept }) {
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState("");
  const { boards } = useBoards();

  const onClickAccept = () => {
    if (name) {
      onAccept(name);
    }
    setIsEdit(false);
    setName("");
  };

  const onClickCancel = () => {
    setIsEdit(false);
    setName("");
  };

  if (!isEdit) {
    return (
      <div
        className={Styles.addButton_wrapper}
        style={{
          left: 20 + 20 * boards.boardCount + 268 * boards.boardCount + "px",
        }}
        onClick={() => setIsEdit(true)}
      >
        <div className={Styles.content}>
          <img src={addIcon} width={15} alt="" />
          Добавить доску
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={Styles.editBoard}
        style={{
          top: "5px",
          left: 20 + 20 * boards.boardCount + 268 * boards.boardCount + "px",
        }}
      >
        <textarea
          name=""
          id=""
          cols="30"
          rows="1"
          placeholder="Введите заголовок"
          onChange={(e) => {
            setName(e.target.value);
          }}
          autoFocus={true}
          value={name}
        ></textarea>

        <div className={Styles.actions}>
          <button className={Styles.accept} onClick={() => onClickAccept()}>
            Создать доску
          </button>
          <button className={Styles.cancel} onClick={() => onClickCancel()}>
            Отмена
          </button>
        </div>
      </div>
    );
  }
}
