import React, { useState, useEffect } from "react";
// import socketIOClient from 'socket.io-client'
import Form from "./comps/Form";
import Select from "./comps/Select";
import ScrollDrag from "./ScrollDrag";
import "./App.css";
import MultiSwitch from "./comps/MultiSwitch";

// https://www.cognitoforms.com/templates

var config = {
  required: true,
};
var description =
  "In CodePen, whatever you write in the HTML editor is what goes within the days";
const options = [
  { title: "India", value: "india", description },
  { title: "Africa", value: "africa", description },
  { title: "Other", value: "other", description },
];

var data = [
  {
    id: 'name',
    name: 'name',
    validate: (field, ctx) => {
      // console.log('CUSTOM VALIDATING....', field, ctx.getField('email'))
      if (field.value == 'testname') {
        return 'testname is not valid name'
      }
    },
    value: '',
  },
  // {
  //   id: 'email',
  //   name: 'email',
  //   type: 'email',
  //   beforComponent: (_) => <div>{_.name}</div>,
  //   afterComponent: (_) => <div>{_.name}</div>,
  // },
  // {
  //   id: 'age',
  //   name: 'age',
  //   type: 'number',
  //   validate: (field, ctx) => {
  //     if (ctx.getField('name')['value'] == 'testname') {
  //       return 'name is testname so age should be number'
  //     }
  //   },
  // },
  {
    id: 'pick',
    name: 'Pick',
    type: 'dropdown',
    options,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    type: 'checkbox',
    options,
    required: false,
  },
  {
    id: 'radio_',
    name: 'Radio',
    type: 'radio',
    options,
    value: 'india',
  },
  {
    id: '_range',
    type: 'range',
    description:
      'Introducing Material Symbols. Material Symbols are our newest icons consolidating over 2,891 glyphs in a single font file with a wide range of design variants.',
  },
  // { id: '_file', type: 'file' },
  // { id: '_color', type: 'color' },
  // { id: '_password', type: 'password' },
  // { id: '_tel', type: 'tel' },
  // { id: '_url', type: 'url' },
  // { id: '_date', type: 'date' },
  // { id: '_time', type: 'time' },
  // { id: '_week', type: 'week' },
  {
    id: "_month",
    type: "month",
    containerStyle: {
      // width: '40%',
      // backgroundColor: 'red'
    },
  },
  {
    id: "_multiselect",
    type: "multiselect",
    options,
    containerStyle: {
      // width: '40%',
      // backgroundColor: 'blue'
    },
  },
  {
    id: "_multiselect_custom",
    type: "multiselect",
    name: "multiselect custom",
    options,
    component: (item) => {
      return (
        <div
          key={item.key}
          onClick={() => {
            item.onChangeData(item.value);
          }}
          style={{ padding: 10, border: "2px solid black", marginRight: 5 }}
        >
          <p
            style={{
              color: item.checked ? "green" : "black",
            }}
          >
            {item.option.title}
          </p>
        </div>
      );
    },
    containerStyle: {
      // width: '40%',
      // backgroundColor: 'blue'
    },
  },
  { id: "_phone", type: "phone" },
  { id: "_country", type: "country" },
  { id: "_multi-switch", type: "multi-switch", options },
  {
    id: "_select",
    type: "select",
    options,
  },
  // { id: '_datetime', type: 'datetime-local' },
  { id: "_filepicker", type: "filepicker", description},
  { id: "_time", type: "time" },
];

// home
function App() {
  const [form, setForm] = useState(data);
  return (
    <div>
      <Form
        data={form}
        config={config}
        onChange={(newData, ctx) => {
          // console.log(newData)
          setForm(newData);
        }}
        onChangeData={(value, ctx) => {
          // console.log(value);
          // console.log(ctx.getField('email'))
          // ctx.setField(ctx.getField('email'), 'testmail@gmail.com')
        }}
        formStyle={styles.myFormStyle}
        style={styles.myInput}
        containerStyle={styles.myInputContainer}
        onSubmit={(body, ctx) => {
          console.log('POST', body)
          if (!body.email || body.email == "") {
            ctx.setField(
              ctx.getField("email"),
              "mail error from user side",
              "error"
            );
          }
        }}
      />
    </div>
  );
}

export default App;

const styles = {
  myFormStyle: {
    // padding: '4%',
  },
  myInputContainer: {
    // backgroundColor: '#cccccc50',
  },
  myInput: {
    // padding: 10,
  },
};
