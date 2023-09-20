import React from "react";
import Styles from "./confirm.module.scss";
import { useDispatch, useSelector } from "react-redux";

export default function Index({ onConfirm, onCancel }) {
  const isConfirm = useSelector((state) => state.boards.isConfirm);
  return (
    <>
      <div
        className={
          isConfirm
            ? `${Styles.confirm_wrapper} ${Styles.confirm_wrapper_show}`
            : Styles.confirm_wrapper
        }
      >
        <div className={Styles.confirm_content}>
          Удалить?
          <div className={Styles.buttons}>
            <button className={Styles.cancel} onClick={() => onCancel()}>
              Отмена
            </button>
            <button className={Styles.confirm} onClick={() => onConfirm()}>
              Удалить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
