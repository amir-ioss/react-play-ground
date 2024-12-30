
import React, { useEffect, useRef, useState } from 'react';
import { convertTimestampToDate, getRandomColor, getColor, isObject, Text } from './utils/helpers';


var initialCandleWidth = 5

const Chart = ({ data: results }) => {
  const canvasRef = useRef(null);
  const [chartOffsetX, setChartOffsetX] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const [mousePos, setMousePos] = useState({ x: null, y: null });



  // useEffect(() => {
  //     const handleResize = () => {
  //         setCanvasWidth(window.innerWidth);
  //         setCanvasHeight(window.innerHeight);
  //     };

  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  // }, []);


  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasWidth(width);
        setCanvasHeight(height);
      }
    };

    // Initial size setting
    updateCanvasSize();

    // Resize listener
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);



  const renderChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const padding = { top: 0, bottom: 30, right: 0, left: 0 };
    const chartWidth = canvasWidth - padding.left - padding.right;

    const chartHeight = canvasHeight - padding.top - padding.bottom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    const candleWidth = initialCandleWidth * zoomFactor;
    const margin = (initialCandleWidth / 2) * zoomFactor;
    const totalCandleWidth = candleWidth + margin;

    const startIndex = Math.floor((chartOffsetX) / totalCandleWidth);
    // const startIndex = Math.max(0, Math.floor((chartOffsetX - padding.left) / totalCandleWidth));

    const maxVisibleCandles = Math.ceil(chartWidth / totalCandleWidth);





    // // Draw SMA line
    // ctx.beginPath();
    // ctx.strokeStyle = '#2196F3';
    // ctx.lineWidth = 1;

    // for (let index = 0; index < maxVisibleCandles; index++) {
    //   const dataIndex = index + startIndex;
    //   if (dataIndex < 0 || dataIndex >= candleStickData.length || !sma[dataIndex]) continue;

    //   const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
    //   if (x < padding.left || x > canvasWidth - padding.right) continue;

    //   const y = padding.top + ((highPrice - sma[dataIndex]) / priceRange) * chartHeight;

    //   if (index === 0) {
    //     ctx.moveTo(x, y);
    //   } else {
    //     ctx.lineTo(x, y);
    //   }
    // }
    // ctx.stroke();
    // ctx.lineWidth = 1;








    // // Draw EMA line
    // ctx.beginPath();
    // ctx.strokeStyle = '#219600';
    // ctx.lineWidth = 1;

    // for (let index = 0; index < maxVisibleCandles; index++) {
    //   const dataIndex = index + startIndex;
    //   if (dataIndex < 0 || dataIndex >= candleStickData.length || !ema[dataIndex]) continue;

    //   const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
    //   if (x < padding.left || x > canvasWidth - padding.right) continue;

    //   const y = padding.top + ((highPrice - ema[dataIndex]) / priceRange) * chartHeight;

    //   if (index === 0) {
    //     ctx.moveTo(x, y);
    //   } else {
    //     ctx.lineTo(x, y);
    //   }
    // }
    // ctx.stroke();
    // ctx.lineWidth = 1;




    // // Draw circle
    // const index_circle = 10
    // const firstCandle = candleStickData[index_circle]; // The first visible candle

    // if (firstCandle) {
    //   const CircleX = (canvasWidth - ((index_circle) * totalCandleWidth) + chartOffsetX) + (totalCandleWidth / 2)
    //   const CircleY = padding.top + ((highPrice - firstCandle.close) / priceRange) * chartHeight; // Y-position based on price
    //   // Ensure CircleX is within the visible chart area
    //   if (CircleX >= padding.left && CircleX <= canvasWidth - padding.right) {
    //     ctx.beginPath();
    //     ctx.arc(CircleX, CircleY, 5, 0, 2 * Math.PI); // Circle with radius 5
    //     ctx.fillStyle = "#FF0000"; // Red color
    //     ctx.fill();
    //     ctx.strokeStyle = "#000000"; // Black border
    //     ctx.stroke();
    //   }
    // }




    // // Draw Rectangle
    // const index_1 = 200
    // const index_2 = 250
    // const candle1 = candleStickData[candleStickData.length - index_1]; // The first visible candle
    // const candle2 = candleStickData[candleStickData.length - index_2]; // The first visible candle


    // if (candle1 && candle2) {
    //   const X1 = (chartWidth - ((candleStickData.length - index_1) * totalCandleWidth) + chartOffsetX)
    //   const X2 = (chartWidth - ((candleStickData.length - index_2) * totalCandleWidth) + chartOffsetX)

    //   const Y1 = padding.top + ((highPrice - candle1.close) / priceRange) * chartHeight;
    //   const Y2 = padding.top + ((highPrice - candle2.close) / priceRange) * chartHeight;

    //   // Ensure CircleX is within the visible chart area
    //   if (X1 >= padding.left && X1 <= canvasWidth - padding.right) {
    //     ctx.beginPath();
    //     ctx.rect(X1, Y1, X2 - X1, Y2 - Y1);
    //     ctx.fillStyle = '#ef5350';
    //     ctx.fill();
    //   }
    // }




    var candleStickData = []
    var visibleData = []
    var highPrice = 0
    var lowPrice = 0
    var priceRange = (highPrice - lowPrice) * 1.1; // Add 10% padding




    const renderCrosshair = (ctx, mouseX, mouseY, visibleData, highPrice, lowPrice, priceRange) => {
      if (mouseX === null || mouseY === null) return; // No crosshair if mouse is outside canvas

      // Draw vertical line
      ctx.beginPath();
      ctx.moveTo(mouseX, padding.top);
      ctx.lineTo(mouseX, canvasHeight - padding.bottom);
      ctx.strokeStyle = "#44444490"; // Crosshair line color
      ctx.setLineDash([6, 6]); // Set dashed line pattern
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(padding.left, mouseY);
      ctx.lineTo(canvasWidth - padding.right, mouseY);
      ctx.stroke();


      // Display price label (Y-axis)

      // Calculate the price based on the mouse position
      const price = highPrice - ((mouseY - padding.top) / chartHeight) * priceRange;
      // Set font and alignment for text
      ctx.font = "12px Arial";
      ctx.textAlign = "right";

      // Measure the text to determine the width for the background
      const text = price.toFixed(2);
      const textWidth = ctx.measureText(text).width;
      const textHeight = 30; // Approximate height for a 12px font

      // Set background position and dimensions
      const bgX = canvasWidth - textWidth - 10; // Padding of 5 on both sides
      const bgY = mouseY - textHeight / 1.5;
      const bgWidth = textWidth + 10; // Padding for background
      const bgHeight = textHeight;

      // Draw the black background rectangle
      ctx.fillStyle = "#000";
      ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

      // Draw the white text on top
      ctx.fillStyle = "#FFF";
      ctx.fillText(text, canvasWidth - 5, mouseY);

      // Display time label (X-axis)
      const candleIndex = Math.floor(((mouseX - padding.left)) / totalCandleWidth); // Adjust chartOffsetX logic
      const dataIndex = candleIndex + startIndex;

      if (candleIndex >= 0 && candleIndex < visibleData.length) {
        // const timeLabel = convertTimestampToDate(candleStickData[dataIndex].time);
        const timeLabel = convertTimestampToDate(visibleData.at(-(candleIndex))?.time)

        // Set font and alignment for text
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        // Measure the text to determine the width for the background
        const text = `${timeLabel['date']} ${timeLabel['time']}`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = 30; // Approximate height for a 12px font

        // Set background position and dimensions
        const bgX = mouseX - textWidth / 2 - 5; // Center the rectangle around the text
        const bgY = canvasHeight - padding.bottom; // Position slightly above the text
        const bgWidth = textWidth + 10; // Padding for background
        const bgHeight = textHeight;

        // Draw the black background rectangle
        ctx.fillStyle = "#000";
        ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

        // Draw the white text on top
        ctx.fillStyle = "#FFF";
        ctx.fillText(text, mouseX, canvasHeight - padding.bottom + 20);
      }


      ctx.setLineDash([]); // Reset to solid lines for other elements
    };


    // PLOT
    const outputs = JSON.parse(results?.outputs)
    var component_layer = 1
    var line_layer = 1

    if (outputs) {
      Object.entries(outputs).forEach(([id, out]) => {
        const node = results.kahn_nodes[id]
        // console.log("--------", node?.type)


        if (node?.type == 'coin_data') {
          candleStickData = out['time'].map((_, idx) => ({ time: out['time'][idx], open: out['open'][idx], high: out['high'][idx], low: out['low'][idx], close: out['close'][idx] })).reverse()

          // Calculate price range for visible candleStickData
          visibleData = candleStickData.slice(
            Math.max(0, startIndex),
            Math.min(candleStickData.length, startIndex + maxVisibleCandles)
          );

          highPrice = Math.max(...visibleData.map((d) => d.high));
          lowPrice = Math.min(...visibleData.map((d) => d.low));
          priceRange = (highPrice - lowPrice) * 1.2; // Add 10% padding

          // Draw price axis (Y-axis)
          ctx.beginPath();
          ctx.strokeStyle = '#dedede80';
          const priceLines = 10;
          for (let i = 0; i <= priceLines; i++) {
            const y = padding.top + (i * chartHeight) / priceLines;
            const price = highPrice - (i * priceRange) / priceLines;

            ctx.moveTo(padding.left, y);
            ctx.lineTo(canvasWidth - padding.right, y);

            // Price labels
            ctx.fillStyle = '#444';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(price.toFixed(2), canvasWidth - 5, y + 4);
          }
          ctx.stroke();

          // Draw time axis (X-axis)
          const timeInterval = Math.ceil(maxVisibleCandles / 15);
          ctx.beginPath();
          ctx.strokeStyle = '#dedede80';

          for (let i = startIndex; i < startIndex + maxVisibleCandles; i += timeInterval) {
            if (i >= 0 && i < candleStickData.length) {
              const x = canvasWidth - (i * totalCandleWidth) + chartOffsetX;
              if (x >= padding.left && x <= canvasWidth - padding.right) {
                ctx.moveTo(x, padding.top);
                ctx.lineTo(x, canvasHeight - padding.bottom);

                // Time labels
                const timeLabel = convertTimestampToDate(candleStickData[i].time)['time']
                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(timeLabel, x, canvasHeight - padding.bottom + 20);
              }
            }
          }
          ctx.stroke();

          // Draw candles
          for (let index = 0; index < maxVisibleCandles; index++) {
            const dataIndex = index + startIndex;

            if (dataIndex < 0 || dataIndex >= candleStickData.length) continue;

            const candleData = candleStickData[dataIndex];
            const x = chartWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;

            // if (x < padding.left || x > candleWidth - padding.right) continue;

            const yHigh = padding.top + ((highPrice - candleData.high) / priceRange) * chartHeight;
            const yLow = padding.top + ((highPrice - candleData.low) / priceRange) * chartHeight;
            const yOpen = padding.top + ((highPrice - candleData.open) / priceRange) * chartHeight;
            const yClose = padding.top + ((highPrice - candleData.close) / priceRange) * chartHeight;

            // Draw high-low line
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, yHigh);
            ctx.lineTo(x + candleWidth / 2, yLow);
            ctx.strokeStyle = candleData.close > candleData.open ? '#26a69a' : '#ef5350';
            ctx.stroke();

            // Draw candle body
            ctx.beginPath();
            ctx.rect(x, Math.min(yOpen, yClose), candleWidth, Math.abs(yClose - yOpen));
            ctx.fillStyle = candleData.close > candleData.open ? '#26a69a' : '#ef5350';
            ctx.fill();

          }

          // Draw the crosshair
          renderCrosshair(ctx, mousePos.x, mousePos.y, visibleData, highPrice, lowPrice, priceRange);

        } // END CANDLES





        // PLOT LINE ON CHART
        function plotLineOnChart(name, out, color = '#000') {
          if (!name || !out) return
          ctx.beginPath();
          ctx.strokeStyle = color
          ctx.lineWidth = 1;
          let hasDrawName = false

          const line = out.reverse()

          for (let index = 0; index < maxVisibleCandles; index++) {
            const dataIndex = index + startIndex;
            if (dataIndex < 0 || dataIndex >= candleStickData.length || !line[dataIndex]) continue;

            const x = chartWidth - (dataIndex * totalCandleWidth) + chartOffsetX;
            if (x < padding.left || x > chartWidth - padding.right) continue;

            const y = padding.top + ((highPrice - line[dataIndex]) / priceRange) * chartHeight;

            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color);
              hasDrawName = true
            }

          }
          ctx.stroke();
          ctx.lineWidth = 1;

        }

        // BOOLEAN
        function plotBooleans(name = "", out, color = '#000') {
          if (!name || !out) return

          const data = out.reverse()
          let hasDrawName = false

          for (let index = 0; index < maxVisibleCandles; index++) {

            const dataIndex = index + startIndex;
            if (dataIndex < 0 || dataIndex >= candleStickData.length || !data[dataIndex]) continue;

            const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
            if (x < padding.left || x > canvasWidth - padding.right) continue;
            const y = padding.top + (20 * line_layer);

            ctx.beginPath();
            ctx.arc(x + (candleWidth / 2), y, 2, 0, 2 * Math.PI); // Circle with radius 5
            // ctx.fillStyle = color; // Red color
            // ctx.fill();
            ctx.strokeStyle = color; // Black border
            ctx.stroke();

            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color);
              hasDrawName = true
            }
          }

        }



        if (node?.type == "check") {
          // console.log(node, out);
          plotBooleans(node.name, out, getColor(id))
          line_layer += 1
        }

        // INDICATORS
        if (node?.type == 'indicator') {
          // var lineComponents = ["RSI", "STOCH", "WILLR", "CCI", "MFI", "ADX"]


          if (Array.isArray(out)) { // []
            const lastVal = out.at(-1)
            const dataType = typeof out.at(-1)
            const isOverlay = lastVal < (highPrice * 1.2) && lastVal > lowPrice - (lowPrice * .2)

            // console.log("ARRAY", { dataType, out });
            if (dataType == 'number' && isOverlay) {
              plotLineOnChart(node.label, out, getColor(id))
            } else if (dataType == 'boolean') {
              plotBooleans(node.label, out, getColor(id))
            }

          } else if (isObject(out)) {  // {[],[],[]}
            Object.entries(out).map((_, key) => {
              let name = _[0]
              let named_out = _[1]
              const lastVal = named_out.at(-1)
              const dataType = typeof named_out.at(-1)
              const isOverlay = lastVal < (highPrice * 1.2) && lastVal > lowPrice - (lowPrice * .2)

              if (dataType == 'number' && isOverlay) {
                // console.log(name, named_out);
                plotLineOnChart(`${node.label} (${name})`, named_out, getColor(id + key))
              } else {
                // console.log("MULTI ARRAY", named_out);

              }
            })
          } else {
            console.log("OTHER TYPE", { out });
          }


        }



      })
    }
    // Draw chart border
    ctx.strokeStyle = '#dedede';
    ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);
  };




  const handleMouseLeave = () => {
    setMousePos({ x: null, y: null }); // Hide the crosshair when the mouse leaves the canvas
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartDragX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - startDragX;
      setChartOffsetX((prevOffsetX) => prevOffsetX + deltaX);
      setStartDragX(e.clientX);
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomFactor((prevZoom) => Math.min(prevZoom * 1.1, 3));
    } else {
      setZoomFactor((prevZoom) => Math.max(prevZoom / 1.1, 0.01));
    }
  };

  useEffect(() => {
    renderChart();
  }, [mousePos, chartOffsetX, zoomFactor, canvasWidth, canvasHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, chartOffsetX]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};


export default Chart