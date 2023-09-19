import React from "react";
import Styles from "./name.module.scss";
import acceptIcon from "../../assets/icons/accept.svg";

export default function Index({ onChangeName, onAccept }) {
  const [show, setShow] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setShow(true), 0.5);
  }, []);

  const validate = () => {
    if (inputValue) {
      onAccept();
    } else {
      setIsValid(false);
      setTimeout(() => {
        setIsValid(true);
      }, 200);
    }
  };
  return (
    <div
      className={show ? `${Styles.nameInput} ${Styles.show}` : Styles.nameInput}
    >
      <input
        className={!isValid && Styles.notValid}
        placeholder="Введите название"
        type="Введите название"
        onChange={(e) => {
          onChangeName(e.target.value);
          setInputValue(e.target.value);
        }}
      />
      <img src={acceptIcon} width={25} alt="" onClick={() => validate()} />
    </div>
  );
}
