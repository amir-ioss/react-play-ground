import React, { useState, useEffect } from "react";
import FileUploader from "./FilePicker";
import Input from "./Input";
import Radio from "./Radio";
import Check from "./Check";
import DropDown from "./DropDown";
import Select from "./Select";
import MultiSelect from "./MultiSelect";
import Phone from "./Phone";
import Country from "./Country";

import styles from "./styles/style";
import MultiSwitch from "./MultiSwitch";

const Config = {
  //   fields: [],
  required: true,
  type: "text",
  // beforComponent: (_) => _,
  // afterComponent: (_) => _,
  // validate: (_) => _,
  editable: true,
  // field_id
  // placeholder,
  // getField: (_) => _,
  // descriptionStyle
  // description
};

function _validate(field, value) {
  if (!value || value == "") {
    return field?.name
      ? field?.name + " is required"
      : field?.id + " is required";
  }
  return null;
}

function Form(props) {
  var vals = { data: initialData(props?.data) };

  function initialData() {
    // data
    var data = props?.data.map((_) => ({
      ...Config,
      ...props?.config,
      ..._,
      field_id: "_" + _.id,
      placeholder: _?.name ?? _?.id,
    }));
    //   console.log(data)
    return data;
  }

  // const [vals, setVals] = useState({
  //   data: initialData(props?.data),
  // })

  var ctx = () => ({
    data: props?.data,
    getField,
    setField,
  });

  const dataModify = (field, value, field_name = "value") => {
    var newData = vals.data.map((item, key) => {
      if (field.id == item.id) {
        item[field_name] = value;
        if (field_name != "error") {
          item.error = _validate(item, value) || field?.validate?.(item, ctx());
        }
      }
      return item;
    });
    return newData;
  };

  const getField = (_id) => {
    return props.data.find((_) => _.id == _id);
  };

  const setField = (field, value, field_name = "value") => {
    console.log("change--->", field, value, field_name);
    return props?.onChange(dataModify(field, value, field_name), ctx());
  };

  const _submit = () => {
    // POST DATA
    vals.data.forEach((field, key) => {
      if ((!field.value || field.value == "") && field?.required) {
        setField(
          field,
          `(on sumit) ${field?.name ?? field?.id} field is requied`,
          "error"
        );
      }
    });
    const body = props?.data.map((_) => ({
      [_.id]: _.value,
    }));
    props?.onSubmit(body, ctx());
  };

  return (
    <form
      id="absy_form_package"
      style={{
        ...styles?.formStyle,
        ...props?.formStyle,
        // ?
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      {vals.data.map((field, key) => {
        return (
          <Field
            {...field}
            key={key}
            onChangeData={(value) => {
              props?.onChange(dataModify(field, value), ctx());
              props?.onChangeData(value, ctx());
            }}
            style={{ ...props?.style, ...field?.style }}
            containerStyle={{
              ...props?.containerStyle,
              ...field?.containerStyle,
            }}
          />
        );
      })}

      <button onClick={_submit} style={{ padding: 10 }}>
        Submit
      </button>
    </form>
  );
}
export function Field(props) {
  const defaultStyle = {
    ...styles.inputContainer,
  };
  return (
    <div
      key={props.key + "__"}
      style={{ ...defaultStyle, ...props?.containerStyle }}
    >
      {props?.title && (
        <p style={{ ...styles?.title, ...props?.titleStyle }}>
          {props?.name ?? props?.type}
        </p>
      )}
      {/* LEFT COMPONENT ? */}
      {props?.beforComponent?.(props)}
      {/* MAIN COMPONENT */}
      {_getComponent(props)}
      {/* RIGHT COMPONENT ? */}
      {props?.afterComponent?.(props)}
      {/* ERROR */}
      {props?.error ? (
        <div style={{ ...styles.error, ...props?.errorStyle }} className="row">
          <span
            class="material-symbols-outlined"
            style={{ fontSize: 16, marginRight: 5 }}
          >
            error
          </span>
          <p>{props.error}</p>
        </div>
      ) : null}

      {props?.description && (
        <p style={{ ...styles.description, ...props?.descriptionStyle }}>
          {props.description}
        </p>
      )}
    </div>
  );
}

// CORE
function _getComponent(props) {
  var comp = null;
  var TYPE = props?.type;
  // var TYPE = props?.type == 'file' ? 'filepicker' : props?.type
  switch (TYPE) {
    case "dropdown":
      comp = (
        <DropDown {...props} onChangeData={(val) => props?.onChangeData(val)} />
      );
      break;
    case "checkbox":
      comp = (
        <Check {...props} onChangeData={(val) => props?.onChangeData(val)} />
      );
      break;
    case "radio":
      comp = (
        <Radio {...props} onChangeData={(val) => props?.onChangeData(val)} />
      );
      break;
    case "select":
      comp = (
        <Select {...props} onChangeData={(val) => props?.onChangeData(val)} />
      );
      break;

    case "filepicker":
      comp = (
        <FileUploader
          {...props}
          handleFile={(val) => props?.onChangeData(val)}
        />
      );
      break;
    case "multiselect":
      comp = (
        <MultiSelect
          {...props}
          handleFile={(val) => props?.onChangeData(val)}
        />
      );
      break;
    case "phone":
      comp = (
        <Phone {...props} handleFile={(val) => props?.onChangeData(val)} />
      );
      break;
    case "country":
      comp = (
        <Country {...props} handleFile={(val) => props?.onChangeData(val)} />
      );
      break;
    case "multi-switch":
      comp = (
        <MultiSwitch
          {...props}
          handleFile={(val) => props?.onChangeData(val)}
        />
      );
      break;

    default:
      comp = (
        <Input
          {...props}
          onChange={(e) => {
            props?.onChangeData(e.target.value);
          }}
        />
      );
      break;
  }

  return comp;
}

export default Form;
