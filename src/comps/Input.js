import React from 'react'
import styles from './styles/style'

function Input(props) {
  const hiddenInputRef = React.useRef(null)

  const handleClick = (event) => {
    hiddenInputRef.current.click()
  }

  return (
      <input
        onChange={(e) => props?.onChangeData(e.target.value)}
        value={props.value}
        placeholder={props.placeholder}
        // style={{ ...styles.input, ...props?.style }}
        type={props?.type}
        class={''}
        style={{ ...styles.input, ...props?.style }}
        ref={hiddenInputRef}
      />
  )
}
export default Input
