import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from './App';
import TestUI from "./TestUI";
import Canvas from "./Canvas/Canvas";
import Pattern from "./Pattern";
import Form from "./Form/Test";
import reportWebVitals from "./reportWebVitals";
// import { Input,Button } from "pkg_gpt";
// import { Button } from "my-react-ui-ioss-test";
// import { MyComponent } from 'react-pkg';


const IFrame = () => {
  return (
    <iframe
      src="http://localhost:3000/profile"
      width={"100%"}
      height="1000"
    ></iframe>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <TestUI /> */}
    {/* <Button label="TEST BUTTON" onClick={() => null} /> */}
    {/* <Input onChangeData={(data) => console.log(data)} /> */}
    {/* <IFrame/> */}
    {/* <Button/> */}
    {/* <MyComponent text={"THIS IS TEST"} /> */}
    {/* <Canvas/> */}
    <Form />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
