import React from "react";
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
import { useEffect } from "react";

const Config = {
  // field_id,
  // fields: [],
  // required: true,
  type: "text",
  // beforComponent: (_) => _,
  // afterComponent: (_) => _,
  // validate: (_) => _,
  editable: true,
  // placeholder,
  // getField: (_) => _,
  // style:{},
  // formStyle:{},
  // labelStyle: {},
  // titleStyle: {},
  // descriptionStyle: {},
  // descriptionStyle: {},
  // description,
  // submitComponent: (_) => _,
  // showPlaceholder: false,
  // validCharacter: bool
  visible: true,
};

function _validate(field, value) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if ((!value || value == "") && field.required) {
    return field?.name
      ? field?.name + " is required"
      : field?.id + " is required";
  } else if (field?.type == "email" && !field?.value.match(validRegex)) {
    return "E mail is not valid!";
  } else if (
    field?.validCharacter == true &&
    /[^a-zA-Z0-9\-\/]/.test(field?.value)
  ) {
    return "Enter Valid characters!";
  }
  return null;
}

function Form(props) {
  // const [vals, setVals] = useState({
  //   data: initialData(props?.data),
  // })

  // const { data } = useForm({
  //   data: initialData(props?.data),
  //   getField,
  //   setValue,
  // });

  var vals = { data: initialData(props?.data) };

  var ctx = () => ({
    data: vals?.data,
    getField,
    setValue,
    setError,
  });

  const getField = (_id) => {
    return vals.data.find((_) => _.id == _id);
  };

  const setValue = (field, value, field_name = "value") => {
    // console.log("change--->", field, value, field_name);
    var field = typeof field == "string" ? getField(field) : field;
    var newFiled = fieldModify(field, value, field_name);
    var newCtx = ctx();
    return props?.onChange({ ...newCtx, data: newFiled });
  };

  const setError = (field, value) => {
    return setValue(field, value, "error");
  };

  function initialData() {
    // data
    var data = props?.data.map((_) => ({
      ...Config,
      ...props?.config,
      ..._,
      field_id: "_" + _.id,
      // placeholder: _?.showPlaceholder == false ? null : _?.name ?? _?.id,
    }));
    //   console.log(data)
    return data;
  }

  const fieldModify = (field, value, field_name = "value") => {
    var newData = vals.data.map((item, key) => {
      if (field.id == item.id) {
        item[field_name] = field?.lowercase ? value.toLowerCase() : value;
        if (field_name != "error") {
          item.error = _validate(item, value) || field?.validate?.(item, ctx());
        }
      }
      return item;
    });
    return newData;
  };

  const _submit = () => {
    let isValid = true;
    // POST DATA
    vals.data.forEach((field, key) => {
      if (
        ((!field.value || field.value == "") && field?.required) ||
        field?.error
      ) {
        setValue(
          field,
          field?.error ?? `${field?.name ?? field?.id} field is required`,
          // `(on sumit) ${field?.name ?? field?.id} field is required`,
          "error"
        );
        isValid = false;
      }
    });
    // var body = !isValid ? null : {};
    // isValid && vals?.data.forEach((_) => (body[_.id] = _.value));
    var body = {};
    vals?.data.forEach((_) => {
      return (body[_.id] = _.value)
    });
    props?.onSubmit(body, isValid, ctx());
  };
  return (
    <form
      id="absy_form_package"
      style={{
        ...styles?.formStyle,
        ...props?.config?.formStyle,
        // ?
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
      onSubmit={(e) => e.preventDefault()}
      className={props?.className}
    >
      {vals.data.map((field, key) => {
        if (!field.visible) return;
        return (
          <Field
            {...field}
            key={key}
            onChangeData={(value) => {
              var newFiled = fieldModify(field, value);
              var newCtx = ctx();
              props?.onChange({ ...newCtx, data: newFiled });
              props?.onChangeData?.(field, ctx());
            }}
            style={{ ...props?.style, ...field?.style }}
            containerStyle={{
              ...props?.containerStyle,
              ...field?.containerStyle,
            }}
          />
        );
      })}

      {
        <div className={props?.submitClass} onClick={_submit}>
          {props?.submitComponent?.() ?? "Submit"}
        </div>
      }
    </form>
  );
}

export function Field(props) {
  const defaultStyle = {
    ...styles.inputContainer,
  };
  return (
    <div
      key={props?.title + "__"}
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
          translate="no"
            className="material-symbols-rounded"
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
