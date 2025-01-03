
import React, { useEffect, useRef, useState } from 'react';
import { convertTimestampToDate, getRandomColor, getColor, isObject, Text, Box, calculatePercentageChange } from './utils/helpers';


const initialCandleWidth = 5
const RED = "#f04042"
const GREEN = "#1dda9e"

const Chart = ({ data: results, state }) => {
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
      // ctx.lineWidth = 1;
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
    var component_layer = 0
    var line_layer = 0

    if (outputs) {
      Object.entries(outputs).forEach(([id, out]) => {
        const node = results.kahn_nodes[id]
        // console.log("--------", node?.type, out)


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

            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);




            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color, undefined, chartOffsetX > 0);
              hasDrawName = true
            }

          }
          ctx.stroke();
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
            ctx.arc(x + (candleWidth / 2), y, 1.5, 0, 2 * Math.PI); // Circle with radius 5
            ctx.fillStyle = color; // Red color
            ctx.fill();
            // ctx.strokeStyle = color; // Black border
            // ctx.stroke();

            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color, undefined, chartOffsetX > 0);
              hasDrawName = true
            }
          }

        }

        // 0 - 100 Bounded  COMPONENTS
        var boundedAxisDraw = false
        function plotBoundedComponent(name = "", out, color = '#000') {
          if (!name || !out) return

          const rsi = out.reverse()
          let hasDrawName = false

          const rsiHeight = chartHeight / 4; // height of RSI chart below the main chart
          var rsiPaddingTop = canvasHeight - rsiHeight - padding.bottom
          rsiPaddingTop = rsiPaddingTop - (rsiHeight * component_layer);

          if (!boundedAxisDraw) {
            // Draw RSI axis
            const rsiLines = 4;
            for (let i = 0; i <= rsiLines; i++) {
              const y = rsiPaddingTop + (i * rsiHeight) / rsiLines;
              const value = 100 - (i * 100) / rsiLines;

              ctx.fillStyle = color
              ctx.font = '9px Arial';
              ctx.textAlign = 'right';
              ctx.fillText(value.toFixed(0), canvasWidth - padding.right - 70, y + 4);
            }

            Box(ctx, 0, rsiPaddingTop, chartWidth, rsiHeight, color + 10)
            boundedAxisDraw = true
          }



          // Draw RSI line
          ctx.beginPath();
          ctx.strokeStyle = color
          ctx.lineWidth = 1;
          for (let i = 0; i < rsi.length; i++) {
            if (i < startIndex || i >= startIndex + maxVisibleCandles) continue;

            const x = chartWidth - ((i) * totalCandleWidth) + chartOffsetX;
            var value = rsi[i]
            if (value < 0) value = rsi[i] * -1
            const y = rsiPaddingTop + ((100 - value) / 100) * (rsiHeight);

            if (i === startIndex) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }


            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color, undefined, chartOffsetX > 0);
              hasDrawName = true
            }

          }
          ctx.stroke();



        }

        // 0 Centered COMPONENTS
        var centeredAxisDraw = false
        function plotCenteredComponent(name = "", out, color = '#000', maxValue, minValue) {

          if (!name || !out) return

          const rsi = out.reverse()
          let hasDrawName = false

          const indicatorHeight = 100; // height of RSI chart below the main chart
          var indicatorPaddingTop = canvasHeight - indicatorHeight - padding.bottom
          indicatorPaddingTop = indicatorPaddingTop - (indicatorHeight * component_layer);
          const range = maxValue - minValue;
          const zeroPosition = indicatorPaddingTop + (indicatorHeight * (maxValue / range)); // Zero line position


          if (!centeredAxisDraw) {

            // Draw 0-line
            ctx.beginPath();
            const zeroY = indicatorPaddingTop + (indicatorHeight * (maxValue / range)); // Y-coordinate for 0 value
            ctx.moveTo(padding.left, zeroY);
            ctx.lineTo(chartWidth - padding.right, zeroY);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = color
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);



            // Draw 0-centered axis
            const numLines = 4; // Number of divisions above and below the zero line
            for (let i = -numLines; i <= numLines; i++) {
              const value = (i / numLines) * maxValue; // Calculate value for this division
              const y = zeroPosition - (i * indicatorHeight) / (2 * numLines);

              ctx.fillStyle = color;
              ctx.font = '9px Arial';
              ctx.textAlign = 'right';
              ctx.fillText(value.toFixed(4), canvasWidth - padding.right - 70, y + 4);
            }

            Box(ctx, 0, indicatorPaddingTop, chartWidth, indicatorHeight, color + 10)

            centeredAxisDraw = true
          }


          // Draw RSI line

          ctx.beginPath();
          ctx.strokeStyle = color
          for (let i = 0; i < rsi.length; i++) {
            const x = chartWidth - (i * totalCandleWidth) + chartOffsetX;
            if (x < padding.left || x > chartWidth - padding.right) continue; // Clip outside the chart
            const y = indicatorPaddingTop + indicatorHeight - ((rsi[i] - minValue) / range) * indicatorHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            // NAME
            if (!hasDrawName) {
              Text(ctx, name, x, y, color, undefined, chartOffsetX > 0);
              hasDrawName = true
            }



          }
          ctx.stroke();

        }

        function plotHorizontalLines(name, out, color = '#000', lineWidth = 2) {
          if (!name || !out) return;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          let hasDrawName = false;

          const line = out.reverse();

          // Group consecutive same values together
          let groups = [];
          let currentGroup = {
            value: line[0],
            startIdx: 0,
            endIdx: 0
          };

          for (let i = 1; i < line.length; i++) {
            if (line[i] === currentGroup.value) {
              currentGroup.endIdx = i;
            } else {
              groups.push({ ...currentGroup });
              currentGroup = {
                value: line[i],
                startIdx: i,
                endIdx: i
              };
            }
          }
          groups.push(currentGroup); // Add the last group

          // Plot each group as a single line
          groups.forEach(group => {
            const dataStartIndex = group.startIdx + startIndex;
            const dataEndIndex = group.endIdx + startIndex;

            // if (dataStartIndex < 0 || dataEndIndex >= candleStickData.length) return;

            // Calculate coordinates
            const x1 = chartWidth - (group.startIdx * totalCandleWidth) + chartOffsetX;
            const x2 = chartWidth - (group.endIdx * totalCandleWidth) + chartOffsetX;

            // Skip if outside visible area
            // if (x2 > chartWidth - padding.right || x1 < padding.left) return;

            // Calculate y position
            const y = padding.top + ((highPrice - group.value) / priceRange) * chartHeight;

            // Draw the line
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);

            // Draw name for the first visible line
            if (!hasDrawName) {
              Text(ctx, name, x1, y, color, undefined, chartOffsetX > 0);
              hasDrawName = true;
            }
          });

          ctx.stroke();
        }




        // Function to draw order blocks on canvas
        function drawOrderBlock(orderBlock, endTime) {
          // console.log(orderBlock);


          // Extract order block properties
          const { top, bottom, startTime, obType } = orderBlock;

          // Calculate start and end positions on the x-axis
          const startX = chartWidth - ((candleStickData.length - 1 - startTime) * totalCandleWidth) + chartOffsetX;
          const endX = chartWidth - ((candleStickData.length - 1 + endTime) * totalCandleWidth) + chartOffsetX;

          // Make sure the x positions are within canvas bounds
          // if (startX < padding.left || endX > canvasWidth - padding.right) return;

          // Calculate the y-coordinates for the top and bottom of the order block
          const topY = padding.top + ((highPrice - top) / priceRange) * chartHeight;
          const bottomY = padding.top + ((highPrice - bottom) / priceRange) * chartHeight;

          // Set the color for drawing the order block (e.g., green for Bullish, red for Bearish)
          ctx.fillStyle = obType === 'Bull' ? GREEN + 90 : RED + 90;

          // Draw the order block as a filled rectangle
          // ctx.fillRect(startX, bottomY, endX - startX, topY - bottomY);
          ctx.fillRect(startX, topY, startX - endX, bottomY - topY);
        }



        // Draw Histogram
        //  for (let i = 0; i < data.length; i++) {
        //   const x = chartWidth - (i * totalCandleWidth) + chartOffsetX;
        //   if (x < padding.left || x > chartWidth - padding.right) continue;
        //   const barHeight = (histogramValues[i] / macdRange) * macdHeight;

        //   const barY = zeroY - barHeight; // Start at 0-line
        //   ctx.beginPath();
        //   ctx.rect(x - (totalCandleWidth / 4), barHeight < 0 ? zeroY : barY, totalCandleWidth / 2, Math.abs(barHeight));
        //   ctx.fillStyle = barHeight < 0 ? "#ef5350" : "#26a69a";
        //   ctx.fill();
        // }

        ///////////  P O S I T I O N S  ///////////
        if (node?.type == 'trade') {
          const trades = results.result.trades
          // console.log(trades);



          trades.forEach((pos, id) => {
            let entryIndex = pos.entry_index
            let exitIndex = pos.exit_index
            let entryPrice = pos.entry_price
            let exitPrice = pos.exit_price

            let color = pos.type == 'long' ? entryPrice < exitPrice ? GREEN : RED : entryPrice > exitPrice ? GREEN : RED


            // Draw Rectangle
            const index_1 = entryIndex
            const index_2 = exitIndex
            const candle1 = candleStickData[candleStickData.length - index_1];
            const candle2 = candleStickData[candleStickData.length - index_2];


            if (candle1 && candle2) {
              const x1 = (chartWidth - ((candleStickData.length - index_1) * totalCandleWidth) + chartOffsetX)
              const x2 = (chartWidth - ((candleStickData.length - index_2) * totalCandleWidth) + chartOffsetX)

              const y1 = padding.top + ((highPrice - candle1.close) / priceRange) * chartHeight;
              const y2 = padding.top + ((highPrice - candle2.close) / priceRange) * chartHeight;

              // position area
              // if (X1 >= padding.left && X1 <= canvasWidth - padding.right) {
              Box(ctx, x1, y1, x2 - x1, y2 - y1, color + 20)
              // }

              // position type
              Text(ctx, (pos.type).toUpperCase(), x1, y1, pos.type == 'long' ? GREEN : RED)
              // Text(ctx, Math.abs(calculatePercentageChange(entryPrice, exitPrice)) + '%', x1 + ((x2 - x1) / 2), y1 + ((y2 - y1) / 2), '#fff', 'black')
              Text(ctx, Math.abs(calculatePercentageChange(entryPrice, exitPrice)) + '%', x2 - 40, y1, '#fff', 'black')


              // cross line
              ctx.beginPath();
              ctx.strokeStyle = color
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.setLineDash([6, 6]);
              ctx.stroke();
            }

          }) // trades end
        }

        ///////////  C H E C K  ///////////
        if (node?.type == "check") {
          // console.log(node, out);
          plotBooleans(node.name, out, getColor(id))
          line_layer += 1
        }


        ///////////  INDICATORS ///////////
        if (node?.type == 'indicator' || node?.type == 'math' || node?.type == "hhll" || node?.type == 'math_utils_np') {


          var BoundedType = ["RSI", "STOCH", "WILLR", "CCI", "MFI", "ADX", "STOCHRSI"]
          var CenteredType = ["MACD", "MOM", "ROC", "AO", "TRIX"]
          var UnboundeType = ["ATR", "OBV"]
          // var Percentage = ["ROC", "WILLR"]

          const isBounded = BoundedType.includes(node?.indicator?.Name)
          const isCentered = CenteredType.includes(node?.indicator?.Name)


          if (Array.isArray(out)) { // []
            const lastVal = out.at(-1)
            const dataType = typeof out.at(-1)
            const isOverlay = lastVal < (highPrice * 1.2) && lastVal > lowPrice - (lowPrice * .2)
            const maxValue = Math.max(...out);
            const minValue = Math.min(...out);


            // console.log("ARRAY", { dataType, out });
            if (dataType == 'number' && isOverlay && !isBounded && !isCentered) {
              if (node?.plot == 'lines') {
                plotHorizontalLines(node.label, out, getColor(id))
              } else {
                plotLineOnChart(node.label, out, getColor(id))
              }
            } else if (dataType == 'boolean') {
              plotBooleans(node.label, out, getColor(id))
            } else {
              if (isBounded) {
                plotBoundedComponent(node.label, out, getColor(id))
              } else if (isCentered) {
                plotCenteredComponent(`${node.label}`, out, getColor(id), maxValue, minValue)
                component_layer += 1
              } else {
                console.log("SPECIAL", out);
              }
            }

          } else if (isObject(out)) {  // {[],[],[]}
            const signals = Object.entries(out)
            var mergedData = [] // for max and min height

            signals.forEach((_, key) => {
              mergedData = [...mergedData, ..._[1]]
            })
            // console.log(isBounded, signals.length);
            const maxValue = Math.max(...mergedData);
            const minValue = Math.min(...mergedData);

            signals.map((_, key) => {
              let name = _[0]
              let named_out = _[1]
              const lastVal = named_out.at(-1)
              const dataType = typeof named_out.at(-1)
              const isOverlay = lastVal < (highPrice * 1.2) && lastVal > lowPrice - (lowPrice * .2)


              // console.log(name, named_out);

              if (dataType == 'number' && isOverlay && !isBounded && !isCentered) {
                if (node?.plot == 'lines') {
                  plotHorizontalLines(`${node.label} (${name})`, named_out, getColor(id + key))
                } else {
                  plotLineOnChart(`${node.label} (${name})`, named_out, getColor(id + key))
                }
              } else {
                // console.log("MULTI ARRAY", named_out);
                // drawMACD

                if (isBounded) {
                  plotBoundedComponent(`${node.label} (${name})`, named_out, getColor(id + key))
                } else if (isCentered) {

                  plotCenteredComponent(`${node.label} (${name})`, named_out, getColor(id + key), maxValue, minValue)
                }


              }
            })

            if (isCentered || isBounded) component_layer += 1

          } else {
            console.log("OTHER TYPE", { out });
          }


        }



        if (node?.type == "hhll") {
          // console.log("WORKS", node);

          // plotLineOnChart(out)
          // for (let i = 0; i < out.length; i++) {
          //   // drawOrderBlock(out[i], out[i + 1]?.['startTime'] ?? 0)
          //   console.log(out[i]);
          // }



          // plotHorizontalLines("asasd", out['high_pivot'])

        }


        else {
          // for (let i = 0; i < out.length; i++) {
          //   // drawOrderBlock(out[i], out[i + 1]?.['startTime'] ?? 0)
          //   console.log(out[i]);

          // }
        }

      })
    }





    // drawOrderBlock({ 'top': 93857.04, 'bottom': 93698.98, 'obVolume': 216.92406, 'obType': 'Bear', 'startTime': 162, 'endTime': 262, 'obLowVolume': 6.97252, 'obHighVolume': 54.89707, 'breaker': false, 'breakTime': null })




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
  }, [mousePos, chartOffsetX, zoomFactor, canvasWidth, canvasHeight, state]);

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