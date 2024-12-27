import data from "./data.json";
import outputes from "./out.json";

const out = outputes["0"];

const candleStickData = out["time"].map((_, idx) => ({
  time: out["time"][idx],
  open: out["open"][idx],
  high: out["high"][idx],
  low: out["low"][idx],
  close: out["close"][idx],
}));

const sma = outputes["1"].reverse();
const ema = outputes["2"].reverse();

// export const getCandlestickData = () =>
//   data
//     .slice(0, 1000)
//     .reverse() // Reverse for charting
//     .map((_) => ({
//       time: _[0],
//       open: _[1],
//       high: _[2],
//       low: _[3],
//       close: _[4],
//     }));

export const getCandlestickData = () => candleStickData.slice(0, 1000).reverse();
export { sma, ema };
