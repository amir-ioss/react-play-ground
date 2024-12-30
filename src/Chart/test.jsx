import React from 'react'
import data from './data/data.json'
import Chart from './components/Chart'
import { getCandlestickData } from './data/dataProcessor';

function test() {
  const da = getCandlestickData()
  return (
    <Chart data={da} />
  )
}

export default test