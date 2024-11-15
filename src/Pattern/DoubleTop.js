import React from "react";
import { drawTrendLine, drawRect, drawTrendLineObj } from "../_fun/draw";
import { calculatePercentage } from "../_fun/helpers";
export default function DoubleTop({
  ctx,
  data: _candles,
  last,
  getChartPoints,
  tolerance = 40
}) {
  try {
    var shapePivot = [-1, -1, -1, -1, -1];
    var candles = [last, ..._candles]; // adds last candle
    var data = candles.slice(0, shapePivot.length).map((_) => _.cand.c);
    var len = shapePivot.length;
    var last__ = getChartPoints(0, 0, last.index, last.cand.c)

    var necklineTop = Math.max(...data.slice(1));
    var necklineBottom = Math.min(...data.slice(1));
    var necklineTop__ = getChartPoints(0, necklineTop, last.index, necklineTop)
    var necklineBottom__ = getChartPoints(0, necklineBottom, last.index, necklineBottom)

    var diff_price = necklineTop - necklineBottom;
    var diff_price__ = necklineTop__[1] - necklineBottom__[1];
    var change = Math.abs(calculatePercentage(diff_price, tolerance) / 2);
    var change__ = Math.abs(calculatePercentage(diff_price__, tolerance) / 2)

    // NECKLINE TOP
    var necklineTop_start = necklineTop - change
    var necklineTop_end = necklineTop + change
    var necklineTop_start__ = necklineTop__[1] - change__
    drawTrendLine(ctx, necklineTop__, "red");
    ctx.fillStyle = '00ff0010'
    ctx.fillRect(0, necklineTop_start__, last__[2], change__ * 2);


    // NECKLINE BOTTOM
    var necklineBottom_start = necklineBottom + change
    var necklineBottom_end = necklineBottom - change
    var necklineBottom_start__ = necklineBottom__[1] - change__
    drawTrendLine(ctx, necklineBottom__, "red");
    ctx.fillStyle = '00ff0010'
    ctx.fillRect(0, necklineBottom_start__, last__[2], change__ * 2);


    var paths = []
    for (let i = 0; i < len; i++) {
      const line = getChartPoints(candles[i]["index"], candles[i]["cand"]["c"], candles[i + 1]["index"], candles[i + 1]["cand"]["c"])
      drawTrendLine(ctx, line, "white");
      paths.push({ line, ...candles[i] })
      // console.log("-", line[1]);
      // analyze
      if (i%2 == 0 && candles[i]["cand"]["c"] < necklineBottom_start && candles[i]["cand"]["c"] > necklineBottom_end) {
        console.log("DOWN", i);
        // should below of prev
        shapePivot[i] = 1;
      }else if(candles[i]["cand"]["c"] > necklineTop_start && candles[i]["cand"]["c"] < necklineTop_end){
        console.log("TOP",  i);
        // should above of prev
        shapePivot[i] = 1;
      }
    }

    console.log(shapePivot);
    var gotShape_2 = !shapePivot.some((_) => _ == 0)
    // console.log("gotShape_2 =====>", shapePivot);
    if (!gotShape_2) return paths
    return false
  } catch (error) {
    console.log("|||||||||||||||||", error);
  }
}
