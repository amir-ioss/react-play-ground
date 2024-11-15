import React from 'react'
import './styles/styles.css'
import styles, { prime, second } from './styles/style'

export default function MultiSelect(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {props?.options &&
        props.options.map((_, key) => {
          let value = props?.value ? [...props?.value] : []
          let checked = value.includes(_.value)
          let _getVal = () => {
            if (checked) {
              value = value.filter((__) => {
                return __ != _.value
              })
            } else {
              value = [...value, _.value]
            }
            return value
          }

          // CUSTOM COMPONENT
          if (props?.component) {
            return props?.component({
              ...props,
              option: _,
              key,
              checked,
              value: _getVal(),
            })
          }

          return (
            <div
              key={key}
              id={_.value}
              name={'MultiSelect' + _.title}
              value={_.value}
              style={{
                ...styles.multiSelect,
                ...props?.style,
                backgroundColor: checked ? props?.activeColor ?? prime : '',
                color: checked ? '#fff' : props?.activeColor ?? prime,
              }}
              onClick={(e) => {
                props?.onChangeData(_getVal())
              }}
            >
              <div class="row pointer">
                <span
                  class="material-symbols-outlined"
                  style={{
                    fontSize: 30,
                    position: 'relative',
                    height: 15,
                    top: -5,
                    color: checked ? '' : second,
                  }}
                >
                  {checked ? 'check_small' : 'check_indeterminate_small'}
                </span>
                {_.title}
              </div>
            </div>
          )
        })}
    </div>
  )
}
