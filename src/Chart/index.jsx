import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import data from './data.json'



function calculateMovingAverageSeriesData(candleData, maLength) {
    const maData = [];

    for (let i = 0; i < candleData.length; i++) {
        if (i < maLength) {
            // Provide whitespace data points until the MA can be calculated
            maData.push({ time: candleData[i].time });
        } else {
            // Calculate the moving average, slow but simple way
            let sum = 0;
            for (let j = 0; j < maLength; j++) {
                sum += candleData[i - j].close;
            }
            const maValue = sum / maLength;
            maData.push({ time: candleData[i].time, value: maValue });
        }
    }

    return maData;
}



const LightweightChart = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);


    // useEffect(() => {
    //     const handleResize = () => {
    //         if (chartContainerRef.current && chartRef.current) {
    //             chartRef.current.resize(
    //                 chartContainerRef.current.clientWidth,
    //                 chartContainerRef.current.clientHeight
    //             );
    //         }
    //     };

    //     const observer = new ResizeObserver(() => {
    //         if (chartRef.current) {
    //             handleResize();
    //         }
    //     });

    //     observer.observe(chartContainerRef.current);

    //     return () => {
    //         observer.disconnect();
    //         if (chartRef.current) {
    //             chartRef.current.remove();
    //             chartRef.current = null;
    //         }
    //     };
    // }, []);

    useEffect(() => {
        if (chartContainerRef.current) {
            // Initialize chart
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                // height: chartContainerRef.current.clientHeight,
                height: window.innerHeight,
                layout: {
                    background: { color: '#222' },
                    textColor: '#D9D9D9', // Light gray text color
                    visible: false
                },
                grid: {
                    vertLines: { color: '#444' },
                    horzLines: { color: '#444' },
                },
                crosshair: {
                    mode: 1, // Enables both horizontal and vertical lines
                },
                rightPriceScale: {
                    borderColor: '#2B2B43', // Border for price scale
                },
                timeScale: {
                    borderColor: '#2B2B43', // Border for time scale
                },
            });

            chart.applyOptions({
                watermark: {
                    visible: true,
                    fontSize: 24,
                    horzAlign: 'center',
                    vertAlign: 'center',
                    color: 'rgba(171, 71, 188, 0.5)',
                    text: 'Maadan Chart',
                },
            });


            // Save chart instance for cleanup
            chartRef.current = chart;

            // Add candlestick series with TradingView-like colors
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#4CAF50', // Green for upward candles
                downColor: '#F44336', // Red for downward candles
                borderUpColor: '#4CAF50', // Green for upward candle borders
                borderDownColor: '#F44336', // Red for downward candle borders
                wickUpColor: '#4CAF50', // Green for upward wicks
                wickDownColor: '#F44336', // Red for downward wicks
                borderVisible: false,
            });

            // Set sample data
            // candlestickSeries.setData([
            //     { time: '2023-11-20', open: 100, high: 110, low: 90, close: 105 },
            //     { time: '2023-11-21', open: 105, high: 120, low: 100, close: 115 },
            // ]);

            const candleStickData = data.map(_ => ({ time: _[0], open: _[1], high: _[2], low: _[3], close: _[4] }))
            candlestickSeries.setData(candleStickData)



            // A D D I N G   S E C O N D   S E R I E S

            // L I N E

            // Convert the candlestick data for use with a line series
            const lineData = candleStickData.map(datapoint => ({
                time: datapoint.time,
                value: (datapoint.close + datapoint.open) / 2,
            }));


            const maData = calculateMovingAverageSeriesData(candleStickData, 20);

            const lineSeries = chart.addLineSeries({
                lastValueVisible: false, // hide the last value marker for this series
                crosshairMarkerVisible: false, // hide the crosshair marker for this series
                lineColor: 'transparent', // hide the line
                topColor: 'rgba(56, 33, 110,0.6)',
                bottomColor: 'rgba(56, 33, 110, 0.1)',
            })


            const lineSeries2 = chart.addLineSeries({
                lastValueVisible: false, // hide the last value marker for this series
                crosshairMarkerVisible: false, // hide the crosshair marker for this series
                lineColor: 'red', // hide the line
                lineWidth: 1
                // topColor: 'rgba(56, 33, 110,0.6)',
                // bottomColor: 'rgba(56, 33, 110, 0.1)',
            })



            lineSeries.setData(lineData)
            lineSeries2.setData(maData)


            const markers = [
                {
                    time: lineData.at(-10).time,
                    position: 'aboveBar',
                    color: '#fff',
                    shape: 'circle',
                    text: 'Amir Abbasy',
                },
                // ...{}
            ];
            lineSeries.setMarkers(markers);



            // A R E A
            const areaSeries = chart.addAreaSeries({
                lastValueVisible: false, // hide the last value marker for this series
                crosshairMarkerVisible: false, // hide the crosshair marker for this series
                lineColor: 'transparent', // hide the line
                topColor: 'rgba(56, 33, 110,0.6)',
                bottomColor: 'rgba(56, 33, 110, 0.1)',
            });
            // Set the data for the Area Series
            areaSeries.setData(lineData);






            // C U S T O M   T O O L T I P

            const container = chartContainerRef.current

            const toolTipWidth = 100;
            const toolTipHeight = 100;
            const toolTipMargin = 15;

            // Create and style the tooltip html element
            const toolTip = document.createElement('div');
            toolTip.style = `width: 100px; height: 100px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
            toolTip.style.background = 'white';
            toolTip.style.color = 'black';
            toolTip.style.borderColor = 'rgba( 38, 166, 154, 1)';
            container.appendChild(toolTip);

            // update tooltip
            chart.subscribeCrosshairMove(param => {
                if (
                    param.point === undefined ||
                    !param.time ||
                    param.point.x < 0 ||
                    param.point.x > container.clientWidth ||
                    param.point.y < 0 ||
                    param.point.y > container.clientHeight
                ) {
                    toolTip.style.display = 'none';
                } else {
                    // time will be in the same format that we supplied to setData.
                    // thus it will be YYYY-MM-DD
                    const dateStr = param.time;
                    toolTip.style.display = 'block';
                    const data = param.seriesData.get(areaSeries);
                    const price = data.value !== undefined ? data.value : data.close;
                    toolTip.innerHTML = `<div style="color: ${'#2962FF'}">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
            ${Math.round(100 * price) / 100}
            </div><div style="color: ${'black'}">
            ${dateStr}
            </div>`;

                    const coordinate = areaSeries.priceToCoordinate(price);
                    let shiftedCoordinate = param.point.x - 50;
                    if (coordinate === null) {
                        return;
                    }
                    shiftedCoordinate = Math.max(
                        0,
                        Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate)
                    );
                    const coordinateY =
                        coordinate - toolTipHeight - toolTipMargin > 0
                            ? coordinate - toolTipHeight - toolTipMargin
                            : Math.max(
                                0,
                                Math.min(
                                    container.clientHeight - toolTipHeight - toolTipMargin,
                                    coordinate + toolTipMargin
                                )
                            );
                    toolTip.style.left = shiftedCoordinate + 'px';
                    toolTip.style.top = coordinateY + 'px';
                }
            });















            // C U S T O M   L I N E 
            const customLineSeries = chart.addLineSeries({
                color: '#FFFF00',
                lineWidth: 5,
                lineStyle: 2, // Dashed line
                lastValueVisible: false, // Hide the last value label
                priceLineVisible: false, // Hide the price line
            });

            customLineSeries.setData([
                {
                    time: candleStickData.at(-100).time,
                    value: candleStickData.at(-100).close
                },
                {
                    time: candleStickData.at(-10).time,
                    value: candleStickData.at(-10).close
                },
               
            ]);


            // chart.timeScale().fitContent();
            chart.timeScale().scrollToPosition(-100);
            // chart.timeScale().scrollToPosition(-candleStickData.length+100);

        }



        return () => {
            // Clean up the chart instance
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);


    return <div ref={chartContainerRef} style={{ width: '100%', height: '400px', backgroundColor: '#000000' }} />
};

export default LightweightChart;
