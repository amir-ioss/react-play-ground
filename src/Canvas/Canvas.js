// src/components/Canvas.js

import React, { useRef, useEffect } from "react";
import test_data from "./test_data.json";
import { drawLine, drawRect } from "./help";
import { nextLineEndpoint, calculatePercentage } from "./help";
import DoubleTop from './Pattern/DoubleTop'
import RisingWedge from './Pattern/RisingWedge'
import BullishRectangle from './Pattern/BullishRectangle'
import BearighPennant from './Pattern/BearighPennant'
import HeadShoulders from './Pattern/HeadShoulders'



var lineWidth = 30;
var data_boost = .00005
const cval = (_) => window.innerHeight - _ * data_boost;

// https://www.babypips.com/learn/forex/how-to-trade-chart-patterns

const Draw = (ctx) => {
  var cdata = test_data.map((_) => cval(_));
  // const hasPattern = DoubleTop(ctx, test_data);
  // const doubleTop = DoubleTop(ctx, test_data);
  // const risingWedge = RisingWedge(ctx, test_data);
  // const bullishRectangle = BullishRectangle(ctx, test_data);
  // const bearighPennant = BearighPennant(ctx, test_data);
  const headShoulders = HeadShoulders(ctx, test_data);

  // console.log("doubleTop", doubleTop);
  // console.log("risingWedge", risingWedge);
  // console.log("bullishRectangle", bullishRectangle);
  // console.log("bearighPennant", bearighPennant);
  console.log("headShoulders", headShoulders);

  // if (hasPattern) {
  //   console.log("YEEEEEEEEEEEEES");
  // } else {
  //   console.log("Nooooooooooooo");
  // }

  // draw
  cdata.forEach((val, idx) => {
    if (idx < 1) return;
    let x1 = idx * lineWidth;
    let y1 = cdata[idx - 1];
    let x2 = idx * lineWidth + lineWidth;
    let y2 = cdata[idx];
    return drawLine(ctx, x1, y1, x2, y2, "blue", 1);
  });
};

const Canvas = () => {
  const canvasRef = useRef(null);
  let ctx = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    Draw(ctx);

    return ()=>{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth} // Set your desired canvas width
      height={window.innerHeight} // Set your desired canvas height
    />
  );
};

export default Canvas;
