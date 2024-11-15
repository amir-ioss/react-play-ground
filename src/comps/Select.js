import React from 'react'
import styles from './styles/style'

export default function Select(props) {
  /****** PROPS ******
    - itemStyle 
  */

  const { useState, useEffect } = React
  const data = props?.options
  const [isOpen, setOpen] = useState(false)
  const toggleDropdown = () => setOpen(!isOpen)
  const handleItemClick = (value) => {
    props?.onChangeData(value)
    setOpen(!isOpen)
  }
  return (
    <div className="absy_pkg_dropdown">
      <div
        className="absy_pkg_dropdown-header"
        onClick={toggleDropdown}
        // onMouseEnter={toggleDropdown}
        style={{ ...styles.input, ...props?.style}}
      >
        {data.find((item) => item.value == props?.value)?.value ??
          props?.placeholder}
        <i className={`fa fa-chevron-right icon ${isOpen && 'open'}`}></i>
      </div>
      <div
        className={`absy_pkg_dropdown-body ${isOpen && 'open'}`}
        onMouseLeave={() => setOpen(false)}
        style={{ width: props?.style?.width ?? styles.input.width }}
      >
        {data.map((item, key) => (
          <div
            key={'select_' + key}
            className="absy_pkg_dropdown-item"
            onClick={(e) => handleItemClick(item.value)}
            id={item.value}
            style={props?.itemStyle}
          >
            <span
              className={`absy_pkg_dropdown-item-dot ${
                item.value == props.value && 'selected'
              }`}
            >
              •{' '}
            </span>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}
