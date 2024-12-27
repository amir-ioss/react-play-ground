import React, { useEffect, useRef, useState } from 'react';
import Chart from './components/Chart'
import { getCandlestickData } from './data/dataProcessor';

function App() {
  const candleStickData = getCandlestickData();

  return (
    <div className="App">
      <Chart data={candleStickData} />
    </div>
  );
}

export default App;
