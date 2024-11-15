import React, { useEffect, useRef, useState } from "react";
import {
    calculatePercentage,
    percentageChange,
    log
} from "../_fun/helpers.js";
import {
    findHigherHighsAndLowerLows,
    pivothigh,
    pivotlow,
} from "../_fun/hhll.js";
import { Mark } from '../_fun/draw.js'
import test_data from "../2023-07-01.json";
import '../App.css'
import DoubleTop from "./DoubleTop.js";


const upColor = "#089981";
const downColor = "#f23645";
const bgColor = "#161a25";


// clickEventListener = ()=>{
//   // Add a click event listener to the canvas
//   canvas.addEventListener('click', (event) => {
//     const mouseX = event.clientX - canvas.offsetLeft;
//     const mouseY = event.clientY - canvas.offsetTop;

//     // Check if the click event occurred within the rectangle
//     if (
//       mouseX >= rectX &&
//       mouseX <= rectX + rectWidth &&
//       mouseY >= rectY &&
//       mouseY <= rectY + rectHeight
//     ) {
//       // Alert the value or perform any other action
//       alert('You clicked the rectangle!');
//     }
//   });
// }

const CustomCandlestickChart = ({
    data,
    hhs,
    lls,
    hls,
    lhs,
}) => {
    const canvasRef = useRef(null);
    const drawCandlestickChart = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Replace these values with your desired dimensions
        const chartWidth = window.innerWidth;
        const chartHeight = window.innerHeight;
        const padding = 0;

        // Calculate candlestick dimensions
        const numDatacands = data.length;
        // const candleWidth = (chartWidth - padding * 2) / numDatacands;
        const candleWidth = 10;
        const maxPrice = Math.max(...data.map((cand) => cand.h));
        const minPrice = Math.min(...data.map((cand) => cand.l));
        const priceRange = maxPrice - minPrice;

        // D R A W   V A R S
        const priceCandle = (price, x, price2 = null, x2 = null) => ({
            price,
            price2,
            x1: padding + x * candleWidth,
            y1: padding + (1 - (price - minPrice) / priceRange) * chartHeight,
            x2: padding + numDatacands * candleWidth,
            y2: padding + (1 - (price - minPrice) / priceRange) * chartHeight,
        });

        // D R A W   V A R S
        const getChartPoints = (x, price, x2 = null, price2 = null) => ([
            padding + x * candleWidth,
            padding + (1 - (price - minPrice) / priceRange) * chartHeight,
            padding + (x2 ?? numDatacands) * candleWidth,
            padding + (1 - ((price2 ?? price) - minPrice) / priceRange) * chartHeight,
        ]);



        // S T R A T E G Y   V A R S
        let hh = [];
        let ll = [];
        let hl = []; // on trading range
        let lh = []; // on trading range
        var hllh = []



        // Draw the candlestick chart
        data.forEach((cand, index) => {

            const x = padding + index * candleWidth;
            const yHigh = padding + (1 - (cand.h - minPrice) / priceRange) * chartHeight;
            const yLow = padding + (1 - (cand.l - minPrice) / priceRange) * chartHeight;
            const yOpen = padding + (1 - (cand.o - minPrice) / priceRange) * chartHeight;
            const yClose = padding + (1 - (cand.c - minPrice) / priceRange) * chartHeight;


            // Mark(ctx,priceCandle(hls_tmp[hls_tmp.length - 1], index),"#cccccc30",4,1);
            // Mark(ctx,priceCandle(lhs_tmp[lhs_tmp.length - 1], index),"#cccccc30",4,1);


            var day = new Date(cand["t"]).getDay();
            var isHolyday = day == 5 || day == 6; // SAT, SUN
            // if (isHolyday) Mark(ctx, { x1: x, y1: 30 }, "yellow", 4, 1)


            // S & R
            // Mark(ctx, priceCandle(resistBoxEnd_price, index), upColor + 40, candleWidth, 1);
            // Mark(ctx, priceCandle(resistBoxStart_price, index), upColor + 90, candleWidth, 1);
            // Mark(ctx, priceCandle(supportBoxStart_price, index), downColor + 90, candleWidth, 1);
            // Mark(ctx, priceCandle(supportBoxEnd_price, index), downColor + 40, candleWidth, 1);

            // var hl_reverse = hl.slice(-10).reverse()
            // var lh_reverse = lh.slice(-10).reverse()
            var dataPattern = hllh.slice(-10).reverse()
            if (index == numDatacands - 1) {
                const doubleTop = DoubleTop({ ctx, data: dataPattern, getChartPoints, last: { cand, index } })
                // console.log({ doubleTop });
            }





























            // // High Low shadow
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.strokeStyle = cand.o <= cand.c ? isHolyday ? upColor + 40 : upColor : isHolyday ? downColor + 40 : downColor;
            ctx.stroke();

            // Open Close body
            ctx.fillStyle = cand.o <= cand.c ? isHolyday ? upColor + 40 : upColor : isHolyday ? downColor + 40 : downColor;
            ctx.fillRect(x - 2.5, yOpen, 5, yClose - yOpen);

            // Add text elements
            // ctx.translate(x, 0);
            ctx.font = "12px Arial";
            ctx.fillStyle = "#ffffff20";
            // X-axis label
            ctx.fillText(index, x - 2.5, yOpen - 400);

            // DRAW INDICATORS
            // HL 10
            if (hls[index]) {
                ctx.fillStyle = upColor;
                ctx.fillRect(x, yClose, 15, 15);
                hl.push({ index, x, yClose, cand }); // 🔴
                hllh.push({ index, x, yClose, cand }); // 🔴
            }
            // LH 10
            if (lhs[index]) {
                ctx.fillStyle = downColor;
                ctx.fillRect(x, yClose, 15, 15);
                lh.push({ index, x, yClose, cand }); // 🔴
                hllh.push({ index, x, yClose, cand }); // 🔴
            }

            // HH
            if (hhs[index]) {
                hh.push({ x, yClose }); // 🔴

                ctx.beginPath();
                ctx.arc(x, yClose, 25, 0, 2 * Math.PI);
                ctx.stroke();
            }
            // LL
            if (lls[index]) {
                ll.push({ x, yClose }); // 🔴

                ctx.beginPath();
                ctx.arc(x, yClose, 25, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }); // END CANDLE LOOP
    };

    useEffect(() => {
        drawCandlestickChart();
    }, [data]);

    return (
        <canvas
            ref={canvasRef}
            width={window.innerWidth * 20}
            height={window.innerHeight}
            style={{
                backgroundColor: bgColor,
            }}
        />
    );
};







const data_offet = 0;
const data_len = 150; //700
const speed = 1

const App = () => {
    const [data, setData] = useState([]);
    const [tradeConfig, setTradeConfig] = useState({
        data_offet,
        data_len,
        speed
    });

    const modifyData = ohlcv_data => ohlcv_data.slice(tradeConfig.data_offet, tradeConfig.data_len)
        .map((_) => ({
            t: new Date(_.time_open).getTime(),
            o: _.price_open,
            h: _.price_high,
            l: _.price_low,
            c: _.price_close,
            v: _.volume_traded,
        }));

    async function getOhlcv() {
        const ohlcv = test_data;
        setData(modifyData(ohlcv));
    }

    useEffect(() => {
        getOhlcv();
        // var data = test_data.slice(tradeConfig.data_offet, tradeConfig.data_len).map((_, k) => ({
        //   t: _[0],
        //   o: _[1],
        //   h: _[2],
        //   l: _[3],
        //   c: _[4],
        // }));
        // setData(data);
    }, [tradeConfig.data_len, tradeConfig.data_offet]);


    // HORIZONTAL SCROLL
    const scrollableRef = useRef(null);
    useEffect(() => {
        const handleScroll = (event) => {
            event.preventDefault();
            const container = scrollableRef.current;
            const speed = event.shiftKey ? 0.5 : 3;
            container.scrollLeft += event.deltaY * speed;
        };

        // Add the event listener with passive: false option
        scrollableRef.current.addEventListener("wheel", handleScroll, {
            passive: false,
        });

        // Clean up the event listener when the component unmounts
        return () => {
            scrollableRef.current.removeEventListener("wheel", handleScroll);
        };
    }, []);

    // console.log("-", findHigherHighsAndLowerLows(data));

    var close = data.map((_, k) => _.c);

    const hhs = pivothigh(close, 100, 100);
    const lls = pivotlow(close, 100, 100);
    // console.log("Pivot Highs:", hhs);
    // console.log("Pivot Lows:", lls);
    const hls = pivothigh(
        close,
        10,
        10
    );
    const lhs = pivotlow(
        close,
        10,
        10
    );

    return <div>
        <div className="dashboard">
            <input
                value={tradeConfig.data_offet}
                placeholder="*"
                onChange={(e) =>
                    setTradeConfig({ ...tradeConfig, data_offet: e.target.value })
                }
            />
            <input
                value={tradeConfig.data_len}
                placeholder="*"
                onChange={(e) =>
                    setTradeConfig({
                        ...tradeConfig,
                        data_len: e.target.value == "" ? 1000 : e.target.value,
                    })
                }
            />
            <button
                onClick={() => {
                    setTradeConfig({
                        ...tradeConfig,
                        data_len: parseInt(tradeConfig.data_len) - tradeConfig.speed,
                    });
                }}
                style={{ paddingLeft: 40, paddingRight: 40 }}
            >
                -
            </button>
            <button
                onClick={() => {
                    setTradeConfig({
                        ...tradeConfig,
                        data_len: parseInt(tradeConfig.data_len) + tradeConfig.speed,
                    });
                }}
                style={{ paddingLeft: 40, paddingRight: 40 }}
            >
                +
            </button>


            {[1, 5, 10, 50, 100, 500].map((spd, idx) => {
                return <button key={'speed_' + idx}
                    onClick={() => setTradeConfig({ ...tradeConfig, speed: spd })}
                    style={{ paddingLeft: 10, paddingRight: 10, color: tradeConfig.speed == spd ? 'black' : '#aaa' }}
                >{spd}</button>
            })}
            <button
                onClick={() => {
                    console.log(data.length);
                    setTradeConfig({
                        ...tradeConfig,
                        data_len,
                    });
                }}
                style={{ paddingLeft: 10, paddingRight: 10 }}
            >
                reset
            </button>
        </div>
        <div className="horizontal-scroll-container" ref={scrollableRef}>
            <CustomCandlestickChart
                data={data}
                hhs={hhs}
                lls={lls}
                hls={hls}
                lhs={lhs}
            />
        </div>
    </div>
};

export default App