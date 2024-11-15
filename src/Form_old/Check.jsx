import React from "react";
import "./styles/styles.css";
import styles from "./styles/style";

export default function Check(props) {
  return (
    <div style={{}}>
      {props?.options &&
        props.options.map((_, k) => {
          let value = props?.value ? [...props?.value] : [];
          return (
            <div
              key={_.title + k}
              onClick={(e) => {
                if (value.includes(_.value)) {
                  value = value.filter((__) => {
                    return __ != _.value;
                  });
                } else {
                  value = [...value, _.value];
                }
                props?.onChangeData(value);
              }}
            >
              <input
                key={k}
                type="checkbox"
                id={_.value}
                name={"checkbox" + _.title}
                value={_.value}
                style={{ ...styles.check, ...props?.style }}
                checked={value.includes(_.value)}
                className="absy_pkg_checkbox"
                onChange={(e) => {
                  e.preventDefault();
                  // props?.onChangeData(e.target.value)
                }}
              />
              <label
                style={{ ...styles.label, color: props?.style?.color }}
                htmlFor={"checkbox" + _.value}
              >
                {_.title}
              </label>
            </div>
          );
        })}
    </div>
  );
}
