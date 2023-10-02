import React from "react";
import Styles from "./selectedPlace.module.scss";

export default function Index({ width, height, x, y }) {
  return (
    <div
      className={Styles.placeBlock}
      style={{
        position: "absolute",
        width: width + "px",
        height: height + "px",
        left: x + "px",
        top: y + "px",
      }}
    ></div>
  );
}
