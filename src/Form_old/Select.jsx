import React from "react";
import styles from "./styles/style";

export default function Select(props) {
  /****** PROPS ******
  - itemStyle 
  */

  const { useState, useEffect } = React;
  const data = props?.options;
  const [isOpen, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (value) => {
    props?.onChangeData(value);
    setOpen(!isOpen);
  };
  return (
    <div className={`absy_pkg_dropdown ${props?.className}`}>
      <div
        className="absy_pkg_dropdown-header font-thin"
        onClick={toggleDropdown}
        // onMouseEnter={toggleDropdown}
        style={{ ...styles.input, ...props?.style }}
      >
        <p className="font-normal text-base">
          {data.find((item) => item.value == props?.value)?.title ??
            props?.placeholder}
        </p>
        {/* <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i> */}
        <span translate="no" className="material-symbols-rounded mx-2">arrow_drop_down</span>
      </div>
      <div
        className={
          `absy_pkg_dropdown-body ${isOpen && "open"} ` +
          props?.itemContainerClassName
        }
        onMouseLeave={() => setOpen(false)}
        // style={{ width: props?.style?.width ?? styles.input.width }}
        style={{ ...styles.itemContainerStyle, ...props?.itemContainerStyle }}
      >
        {data.map((item, key) => (
          <div
            key={"select_" + key}
            className={
              "absy_pkg_dropdown-item " + props?.itemContainerclassName
            }
            onClick={(e) => handleItemClick(item.value)}
            id={item.value}
            style={props?.itemStyle}
          >
            <span
              className={`absy_pkg_dropdown-item-dot ${
                item.value == props.value && "selected"
              }`}
            >
              •{" "}
            </span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
