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
    if (props?.base64) {
      // check max. file size is not exceeded
      // size is in bytes
      // if (files[0].size > 2000000) {
      //   console.log("File too large");
      //   return;
      // }
      var reader = new FileReader();
      reader.readAsDataURL(fileUploaded);

      reader.onload = () => {
        // console.log(reader.result); //base64encoded string
        props.handleFile(reader.result);
        return;
      };
      reader.onerror = (error) => {
        // console.log("Error: ", error);
        props.handleFile(null);
        return;
      };
    }
    props.handleFile(fileUploaded);
    event.target.value = '';
  };


  return (
    <div
      className={props?.className}
      onClick={handleClick}
      style={{
        ...styles.file,
        ...props?.style,
      }}
    >
      <p style={{ marginLeft: 10, ...styles.input, border: 0 }}>
        {props?.placeholder ?? "Pick file"}
      </p>
      {!props?.value ? (
        <span translate="no" className="material-symbols-rounded">folder</span>
      ) : (
        <img src={props.value} alt="File" className="file-previw" />
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
