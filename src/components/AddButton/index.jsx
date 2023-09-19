import React from "react";
import Styles from "./addButton.module.scss";
import addIcon from "../../assets/icons/addIcon.svg";

export default function Index({ onClick }) {
  return (
    <div>
      <div className={Styles.addButton_wrapper} onClick={() => onClick("ку")}>
        <div className={Styles.content}>
          Добавить доску
          <img src={addIcon} width={15} alt="" />
        </div>
      </div>
    </div>
  );
}
