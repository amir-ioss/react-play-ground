import React, { useState, useEffect } from 'react'
// import socketIOClient from 'socket.io-client'
import Form from './comps/Form'
import Select from './comps/Select'
import ScrollDrag from './ScrollDrag'

import './App.css'

// https://www.cognitoforms.com/templates

var config = {
  required: true,
}
const options = [
  { title: 'India', value: 'india' },
  { title: 'Africa', value: 'africa' },
  { title: 'Other', value: 'other' },
]

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
  {
    id: 'email',
    name: 'email',
    type: 'email',
    beforComponent: (_) => <div>{_.name}</div>,
    afterComponent: (_) => <div>{_.name}</div>,
  },
  {
    id: 'age',
    name: 'age',
    type: 'number',
    validate: (field, ctx) => {
      if (ctx.getField('name')['value'] == 'testname') {
        return 'name is testname so age should be number'
      }
    },
  },
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
  { id: '_file', type: 'file' },
  { id: '_color', type: 'color' },
  { id: '_password', type: 'password' },
  { id: '_tel', type: 'tel' },
  { id: '_url', type: 'url' },
  { id: '_date', type: 'date' },
  { id: '_time', type: 'time' },
  // { id: '_week', type: 'week' },
  // { id: '_month', type: 'month' },
  { id: '_datetime', type: 'datetime-local' },
  { id: '_filepicker', type: 'filepicker' },
]

// home
function App() {
  const [form, setForm] = useState(data)

  const ref = React.createRef()
  const state = {
    isScrolling: false,
    clientX: 0,
    scrollX: 0,
    clientY: 0,
    scrollY: 0,
  }

  const [client, setClient] = useState(state)

  const onMouseDown = (e) => {
    setClient({
      ...client,
      isScrolling: true,
      clientX: e.clientX,
      clientY: e.clientY,
    })
  }

  const onMouseUp = () => {
    setClient({ ...client, isScrolling: false })
  }

  const onMouseMove = (e) => {
    const { clientX, scrollX, clientY, scrollY } = client
    if (client.isScrolling) {
      ref.current.scrollLeft = scrollX - (e.clientX - clientX)
      ref.current.scrollBottom = scrollY - (e.clientY - clientY)
      // ref.current.scrollLeft = 500;
      // this.state.scrollX = scrollX + e.clientX - clientX;
      // this.state.clientX = e.clientX;

      scrollX = scrollX - (e.clientX - clientX)

      // setClient({
      //   ...client,
      //   scrollX: scrollX + e.clientX - clientX,
      //   clientX: e.clientX,
      // })
      console.log('---', ref.current)
    }
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{
        backgroundColor: 'green',
        width: '100%',
        height: '100%',
        overflow: 'scroll',
      }}
      ref={ref}
      className={'rootClass'}
    >
      <div
        style={{
          backgroundColor: 'red',
          width: 2500,
        }}
      >
        <p>
          Alternatively, the current configuration can be loaded as a static
          font instead of a variable one.Alternatively, the current
          configuration can be loaded as a static font instead of a variable
          one.Alternatively, the current configuration can be loaded as a static
          font instead of a variable one.
        </p>
        <Select />
        <p>
          Alternatively, the current configuration can be loaded as a static
          font instead of a variable one.Alternatively, the current
          configuration can be loaded as a static font instead of a variable
          one.Alternatively, the current configuration can be loaded as a static
          font instead of a variable one.
        </p>

        <Form
          data={form}
          config={config}
          onChange={(newData, ctx) => {
            // console.log(newData)
            setForm(newData)
          }}
          onChangeData={(value, ctx) => {
            // console.log(ctx.getField('email'))
            // ctx.setField(ctx.getField('email'), 'testmail@gmail.com')
          }}
          formStyle={styles.myFormStyle}
          style={styles.myInput}
          containerStyle={styles.myInputContainer}
          onSubmit={(body, ctx) => {
            // console.log('POST', body)
            if (!body.email || body.email == '') {
              ctx.setField(
                ctx.getField('email'),
                'mail error from user side',
                'error',
              )
            }
          }}
        />
      </div>
    </div>
  )
}

export default App

const styles = {
  myFormStyle: {
    padding: 40,
  },
  myInputContainer: {
    // backgroundColor: '#cccccc50',
  },
  myInput: {
    // padding: 10,
  },
}
