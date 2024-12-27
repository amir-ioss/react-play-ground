export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  let _date = date.toLocaleString().split(","); // Returns a localized string representation of the date and time
  return { date: _date[0], time: _date[1] };
}

export function calculateSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push(sum / period);
  }
  return sma;
}

export function drawCircle(
  ctx,
  timestamp,
  price,
  highPrice,
  lowPrice,
  chartHeight,
  padding,
  chartOffsetX,
  zoomFactor,
  candleWidth,
  data,
  canvasWidth
) {
  const totalCandleWidth = candleWidth + 1; // Include margin
  const startIndex = Math.floor(chartOffsetX / totalCandleWidth);

  // Find the closest candle to the given timestamp
  const dataIndex = data.findIndex((d) => d.time === timestamp);
  if (dataIndex === -1 || dataIndex < startIndex) return; // Timestamp is not in visible range

  const x = canvasWidth - (dataIndex - startIndex) * totalCandleWidth + chartOffsetX;
  const priceRange = (highPrice - lowPrice) * 1.1; // Include 10% padding
  const y = padding.top + ((highPrice - price) / priceRange) * chartHeight;

  // Draw the circle
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI); // Circle with radius 5
  ctx.fillStyle = "#FF0000"; // Red color
  ctx.fill();
  ctx.strokeStyle = "#000000"; // Black border
  ctx.stroke();
}
