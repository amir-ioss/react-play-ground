function prepareLineChartData(candleStickData, indicatorData) {
  const lineData = [];
  for (let idx = 0; idx < candleStickData.length; idx++) {
    if (indicatorData[idx] !== null && indicatorData[idx] !== undefined) {
      lineData.push({
        time: candleStickData[idx].time,
        value: indicatorData[idx],
      });
    }
  }
  return lineData;
}

export { prepareLineChartData };