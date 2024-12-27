import React, { useEffect, useRef } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
import { crosshairMove } from './crosshairMove'
import { prepareLineChartData } from './prepareLineChartData'

const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};


const LightweightChart = ({ data: results }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    // const data = JSON.parse(results.outputs)?.[0]
    // console.log("results->", results);


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
        if (chartContainerRef.current && results) {
            // Initialize chart
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                // height: chartContainerRef.current.clientHeight,
                height: window.innerHeight / 2,
                layout: {
                    background: { color: '#000' },
                    textColor: '#D9D9D9', // Light gray text color
                    visible: false
                },
                grid: {
                    vertLines: { color: '#44444460' },
                    horzLines: { color: '#44444460' },
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

            // chart.applyOptions({
            //     watermark: {
            //         visible: true,
            //         fontSize: 24,
            //         horzAlign: 'center',
            //         vertAlign: 'center',
            //         color: 'rgba(171, 71, 188, 0.5)',
            //         text: 'Maadan Chart',
            //     },
            // });


            // Save chart instance for cleanup
            chartRef.current = chart;


            // DYNAMIC
            // if(!results?.outputs)return
            const outputs = JSON.parse(results?.outputs)
            var candleStickData = []
            var candlestickSeries = null
            var contentBot = 0
            var contentTop = 0

            if (outputs) {
                Object.entries(outputs).forEach(([id, out]) => {
                    const node = results.kahn_nodes[id]
                    console.log("--------", node?.type)

                    /////////// Candles ///////////
                    if (node?.type == 'coin_data') {

                        // Add candlestick series with TradingView-like colors
                        candlestickSeries = chart.addCandlestickSeries({
                            upColor: '#4CAF50', // Green for upward candles
                            downColor: '#F44336', // Red for downward candles
                            borderUpColor: '#4CAF50', // Green for upward candle borders
                            borderDownColor: '#F44336', // Red for downward candle borders
                            wickUpColor: '#4CAF50', // Green for upward wicks
                            wickDownColor: '#F44336', // Red for downward wicks
                            borderVisible: false,
                        });
                        candleStickData = out['time'].map((_, idx) => ({ time: out['time'][idx], open: out['open'][idx], high: out['high'][idx], low: out['low'][idx], close: out['close'][idx] }))
                        candlestickSeries.setData(candleStickData)

                        contentTop = Math.max(...out['high'])
                        contentBot = Math.min(...out['low'])

                    }

                    /////////// Indicator ///////////
                    if (node?.type == 'indicator' || node?.type == 'hhll') {
                        const lineData = prepareLineChartData(candleStickData, out)
                        // L I N E

                        const lineSeries = chart.addLineSeries({
                            title: node.label,
                            lineWidth: 2,
                            color: getRandomColor(), // Set random color
                            lastValueVisible: false, // hide the last value marker for this series
                            crosshairMarkerVisible: false, // hide the crosshair marker for this series
                            priceLineVisible: false
                            // lineColor: 'transparent', // hide the line
                            // topColor: 'rgba(56, 33, 110,0.6)',
                            // bottomColor: 'rgba(56, 33, 110, 0.1)',
                        })
                        lineSeries.setData(lineData)


                        if (out['macd']) {
                            const macdLineData = prepareLineChartData(candleStickData, out['macd'], contentBot)
                            const signalLineData = prepareLineChartData(candleStickData, out['macdsignal'], contentBot)
                            const histogramData = prepareLineChartData(candleStickData, out['macdhist'])

                            const macdLineSeries = chart.addLineSeries({
                                color: getRandomColor(),
                                lineWidth: 1,
                                title: 'MACD Line',
                                lineStyle: LineStyle.Dashed

                            });
                            macdLineSeries.setData(macdLineData);

                            const signalLineSeries = chart.addLineSeries({
                                color: getRandomColor(),
                                lineWidth: 1,
                                title: 'Signal Line',
                                priceLineVisible: false,
                                lineStyle: LineStyle.Dashed


                            });
                            signalLineSeries.setData(signalLineData);


                            const histogramSeries = chart.addHistogramSeries({
                                color: 'green',
                                title: 'MACD Histogram',
                                lineWidth: 1,
                                priceLineVisible: false,

                            });
                            // histogramSeries.setData(histogramData);





                        }



                    }

                    /////////// Indicator ///////////
                    if (node?.type == 'hhll') {
                        // console.log("--------", out)
                        // const hhll = prepareLineChartData(candleStickData, out)
                    }


                    if (node?.type == 'check') {
                        // console.log("--------", out)
                        const booleanData = prepareLineChartData(candleStickData, out)

                        // Add a line series
                        const lineSeries = chart.addLineSeries({
                            color: 'blue',
                            lineWidth: 2,
                        });


                        const chartData = booleanData
                            .filter(point => point.value) // Exclude points where value is `false`
                            .map((point, index) => ({
                                time: point.time,
                                value: point.value ? index + 1 : NaN, // Use NaN for false to create a gap

                            }));

                        console.log({ chartData });


                        // Set the data to the line series
                        // lineSeries.setData(chartData);


                        // Convert boolean data to markers
                        // const markers = booleanData
                        //     .filter(item => item.value) // Only include points with `true`
                        //     .map(item => ({
                        //         time: item.time,
                        //         position: 'aboveBar', // Position of the marker
                        //         shape: 'circle', // Shape of the marker
                        //         color: 'green', // Color of the circle
                        //         size: 1, // Small size for the circle,
                        //         value: contentBot
                        //     }));

                        // candlestickSeries.createPriceLine({
                        //     price: contentBot,
                        //     color: 'pink',
                        //     lineWidth: 2,
                        //     lineStyle: LineStyle.Dashed,
                        //     axisLabelVisible: true,
                        //     title: 'Resistance Level',
                        // });


                        // Add markers to the chart
                        // candlestickSeries.setMarkers(markers);

                    }


                    ///////////  P O S I T I O N S  ///////////
                    if (node?.type == 'trade') {
                        const trades = results.result.trades
                        console.log(trades);



                        trades.forEach((pos, id) => {
                            let entryPrice = pos.entry_price
                            let exitPrice = pos.exit_price
                            let RED = "#FF0000"
                            let GREEN = "#00FF00"
                            let color = pos.type == 'long' ? entryPrice < exitPrice ? GREEN : RED : entryPrice > exitPrice ? GREEN : RED

                            const customLineSeries = chart.addLineSeries({
                                // color:  pos.type == 'long' ? entryPrice < exitPrice ? GREEN : RED : entryPrice > exitPrice ? GREEN : RED, // Alternating colors for clarity
                                color: pos.type == 'long' ? '#ccc' : "#ccc", // Alternating colors for clarity
                                lineWidth: 2,
                                lineStyle: LineStyle.Dashed,
                                lastValueVisible: false,
                                priceLineVisible: false,
                            });


                            customLineSeries.setData([
                                {
                                    time: pos.entry_time,
                                    value: entryPrice
                                },
                                {
                                    time: pos.exit_time,
                                    value: exitPrice
                                },
                            ]);





                            // // A R E A
                            const areaSeries = chart.addAreaSeries({
                                lineVisible: false,
                                priceLineVisible: false,
                                lastValueVisible: false, // hide the last value marker for this series
                                crosshairMarkerVisible: false, // hide the crosshair marker for this series
                                topColor: color + '20',  // Red top gradient
                                bottomColor: color + '20', // Red bottom gradient
                                // lineColor: 'rgba(255, 99, 132, 1)',    // Red line
                            });
                            // Set the data for the Area Series
                            areaSeries.setData([{ time: pos.entry_time, value: entryPrice }, { time: pos.exit_time, value: exitPrice }]);



                            areaSeries.setMarkers([{
                                time: pos.entry_time,
                                position: "aboveBar",
                                color: "#fff", //pos.type == "long" ? GREEN : RED,
                                shape: pos.type == "long" ? "arrowUp" : "arrowDown",
                                text: pos.type
                            }]);



                        })




                    }

                })
            }



            // const markers = [
            //     {
            //         time: lineData.at(-10).time,
            //         position: 'aboveBar',
            //         color: '#fff',
            //         shape: 'circle',
            //         text: 'Amir Abbasy',
            //     },
            //     // ...{}
            // ];
            // lineSeries.setMarkers(markers);



            // // A R E A
            // const areaSeries = chart.addAreaSeries({
            //     lastValueVisible: false, // hide the last value marker for this series
            //     crosshairMarkerVisible: false, // hide the crosshair marker for this series
            //     lineColor: 'transparent', // hide the line
            //     topColor: 'rgba(56, 33, 110,0.6)',
            //     bottomColor: 'rgba(56, 33, 110, 0.1)',
            // });
            // // Set the data for the Area Series
            // areaSeries.setData(lineData);





            // C U S T O M   T O O L T I P
            // const container = chartContainerRef.current
            // if (candleStickData) crosshairMove(chart, container, candleStickData)



            // // chart.timeScale().fitContent();
            // chart.timeScale().scrollToPosition(-100);
            // // chart.timeScale().scrollToPosition(-candleStickData.length+100);

        }



        return () => {
            // Clean up the chart instance
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [results]);


    return <div ref={chartContainerRef} style={{ width: '100%', height: '50%', backgroundColor: '#fff' }} />
};

export default LightweightChart;
