import React from "react";
import "./styles/styles.css";
import styles, { second } from "./styles/style";

export function Switch(props) {
  var width = 60;
  var height = 5;
  var checked = props.value.includes(props.item.value);
  return (
    <button
      className="switch"
      type="checkbox"
      value={props.item.value}
      name={"multi-switch" + props.item.value}
      id={"multi-switch" + props.item.value}
      checked={checked}
      onClick={props.onChange}
      style={{
        width: width,
        height: height,
        marginRight: 10,
        backgroundColor: !checked && "#ddd",
        ...props?.switchStyle,
      }}
    >
      <div
        className="point"
        style={{
          width: height,
          height: height,
          padding: 5,
          borderRadius: 50,
          top: -5,
          right: checked ? 0 : null,
          left: checked ? null : 0,
          backgroundColor: !checked && "#999",
          ...props?.switchMarkStyle,
        }}
      ></div>
    </button>
  );
}

export default function MultiSwitch(props) {
  return (
    <div className="">
      {props.options.map((item, key) => {
        let value = props?.value ? [...props?.value] : [];
        return (
          <div
            key={"multi_switch_" + key}
            className="row"
            style={{
              ...props?.style,
              border: "solid 1px " + second,
              display: "flex",
              justifyItems: "center",
              justifyContent: "space-between",
              marginTop: 5,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <div>
              {item?.title && <p style={{ marginBottom: 10 }}>{item.title}</p>}
              {item?.description && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#444",
                    ...props?.descriptionStyle,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
            <Switch
              item={item}
              value={value}
              onChange={() => {
                if (value.includes(item.value)) {
                  value = value.filter((__) => {
                    return __ != item.value;
                  });
                } else {
                  value = [...value, item.value];
                }
                props?.onChangeData(value);
              }}
              style={props?.style}
              switchStyle={props?.switchStyle}
              switchMarkStyle={props?.switchMarkStyle}
            />
          </div>
        );
      })}
      {/* <Switch /> */}
    </div>
  );
}
