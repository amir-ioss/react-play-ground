import React, { useState, useEffect } from 'react'
import Select from './Select'
import country_data from '../country.json'
import style from './styles/style'

export default function Country(props) {
  const country = country_data.map((_) => ({
    title: _.name,
    value: _.iso3,
  }))
  return <Select {...props} placeholder="Country" options={country} />
}
