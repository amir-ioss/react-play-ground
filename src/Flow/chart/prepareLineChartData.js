function prepareLineChartData(candleStickData, indicatorData, offset=0) {
  console.log({offset});
  
  const lineData = [];
  for (let idx = 0; idx < candleStickData.length; idx++) {
    if (indicatorData[idx] !== null && indicatorData[idx] !== undefined) {
      lineData.push({
        time: candleStickData[idx].time,
        value: offset+indicatorData[idx],
      });
    }
  }
  return lineData;
}

export { prepareLineChartData };