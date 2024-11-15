import React from 'react'
import './styles/styles.css'
import styles from './styles/style'

export default function DropDown(props) {
  return (
    <select
      name="dropdown"
      id={props?.field_id}
      style={{ ...styles.input, ...props?.style }}
      onChange={(e) => props?.onChangeData(e.target.value)}
    >
      {props?.options &&
        props.options.map((_, k) => {
          return <option value={_.value}>{_.title}</option>
        })}
    </select>
  )
}
