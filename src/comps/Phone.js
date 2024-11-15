import React, { useState, useEffect } from 'react'
import Select from './Select'
import Input from './Input'
import country_data from '../country.json'
import style from './styles/style'

export default function Phone(props) {
  const [phone, setPhone] = useState({})
  const _phone = country_data.map((_) => ({
    title: _.iso3 + ' (' + _.phone + ')',
    value: _.phone,
  }))
  useEffect(() => {
    if (phone?.code && phone?.number) {
      props?.onChangeData(phone.code +'-'+ phone.number)
    }
  }, [phone])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 5,
        border: '1px solid black',
        borderRadius: 5,
        ...props?.containerStyle,
      }}
    >
      <span class="material-symbols-outlined">arrow_drop_down_circle</span>
      <Select
        placeholder="CODE"
        options={_phone}
        onChangeData={(val) => setPhone({ ...phone, code: val })}
        style={{ width: '40%', border: 0 }}
        itemStyle={{ fontWeight: 'bold' }}
        value={phone.code}
      />
      <span class="material-symbols-outlined">phone</span>
      <Input
        placeholder={'00 00 00 00 00'}
        onChangeData={(val) => setPhone({ ...phone, number: val })}
        style={{ border: 0, fontSize: 20, letterSpacing: 3, marginLeft: 10 }}
        value={phone.number}
        type="number"
      />
    </div>
  )
}
