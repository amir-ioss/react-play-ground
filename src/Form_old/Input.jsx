import React from "react";
import styles from "./styles/style";

function Input(props) {
  const hiddenInputRef = React.useRef(null);

  const handleClick = (event) => {
    hiddenInputRef.current.click();
  };

  return (
    <input
      onChange={(e) => props?.onChangeData(e.target.value)}
      onBlur={(e) => props?.onBlur?.(e.target.value)}
      value={props.value?? ''}
      placeholder={props.placeholder}
      readOnly={props?.editable == false ? "readonly" : false}
      type={props?.type}
      className={`outline-none ${props?.className ?? "bg-[#18ff0420] w-full p-3 rounded-lg text-lg placeholder:text-[#00000050]"}`}
      // className={`outline-none ${props?.className ?? "bg-[#18ff0420] w-full p-3 rounded-lg text-white text-lg placeholder:text-[#ffffff90]"}`}
      style={{ ...styles.input, ...props?.style, opacity: props?.editable ? 1 : .5 }}
      ref={hiddenInputRef}
    />
  );
}
export default Input;
