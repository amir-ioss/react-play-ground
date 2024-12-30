export function convertTimestampToDate(timestamp) {
  const date = new Date(timestamp);
  let _date = date.toLocaleString().split(","); // Returns a localized string representation of the date and time

  const options = { weekday: "short", day: "numeric", month: "short", year: "2-digit" };
  let formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  return { date: formattedDate, time: _date[1] };
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const colors = [
  "#e11d48",
  "#db2777",
  "#9333ea",
  "#2563eb",
  "#0284c7",
  "#7c3aed",
  "#c026d3",
  "#0d9488",
  "#d97706",
  "#ea580c",
  "#4f46e5",
  "#059669",
  "#94a3b8",
  "#0891b2",
  "#16a34a",
  "#dc2626",
];
export function getColor(id) {
  return colors[id % 16];
}

export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// RSI Calculation Function (same as above)
const calculateRSI = (data, period = 14) => {
  let gains = 0;
  let losses = 0;

  // Calculate the initial gains and losses
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  // Average gain and loss
  let avgGain = gains / period;
  let avgLoss = losses / period;

  const rsi = [100 - 100 / (1 + avgGain / avgLoss)];

  // Calculate the RSI for each following period
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
};



function Text(ctx, text, x, y, bgColor, textColor = "white") {
  // Set font and measure text
  ctx.font = "12px Arial";
  const padding = 5; // Padding around the text
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = 12; // Approx height for the font size

  // Draw background rectangle
  ctx.fillStyle = bgColor;
  ctx.fillRect(x - padding, y - textHeight - padding, textWidth + padding * 2, textHeight + padding * 2);

  // Draw text
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y - textHeight);
}


export { calculateRSI,Text };
