import React from "react";
import "./styles/styles.css";
import styles from "./styles/style";

export default function Radio(props) {
  return (
    <div style={{ display: "flex" }} className="absy_pkg_radio">
      {props?.options &&
        props.options.map((_, k) => {
          return (
            <div
              style={{ display: "flex", marginLeft: 10 }}
              onClick={(e) => {
                props?.onChangeData(_?.value);
              }}
              key={k}
            >
              <input
                type="radio"
                // id={'radio_ui'}
                // name={'radio' + _.title}
                name={"absy_pkg_radio"}
                value={_.value}
                style={{ ...styles.input, ...props?.style }}
                // disabled={true}
                checked={props?.value == _.value}
                onChange={(e) => {
                  e.preventDefault();
                  // props?.onChangeData(e.target.value)
                }}
              />
              <label
                style={{ ...styles.label, color: props?.style?.color }}
                htmlFor={"radio" + _.value}
              >
                {_.title}
              </label>
            </div>
          );
        })}
    </div>
  );
}
