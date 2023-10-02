import React from "react";
import Styles from "./header.module.scss";
export default function Index() {
  return (
    <>
      <div className={Styles.header_wrapper}>
        <div className={Styles.title}>
          TaskBoard <span>React</span>
        </div>
      </div>
    </>
  );
}
