import React from "react";
import "./styles/styles.css";
import styles from "./styles/style";

const FileUploader = (props) => {
  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };
  return (
    <div
      className="pointer"
      onClick={handleClick}
      style={{
        ...styles.file,
        ...props?.style,
      }}
    >
      <p style={{ marginLeft: 10, ...styles.input, border: 0 }}>Pick file</p>
      {!props?.value ? (
        <span class="material-symbols-outlined">folder</span>
      ) : (
        <img src={props.value} alt="File" className="object-cover" />
      )}

      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};
export default FileUploader;
