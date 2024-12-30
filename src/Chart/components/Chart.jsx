
import React, { useEffect, useRef, useState } from 'react';
import { convertTimestampToDate, calculateSMA, calculateRSI } from '../utils/helpers';
import { sma, ema } from '../data/dataProcessor'


var initialCandleWidth = 5

const Chart = ({ data = [] }) => {
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

        const padding = { top: 0, bottom: 50, right: 0, left: 0 };
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

        // ctx.beginPath();
        // ctx.rect(padding.left, 100, chartWidth, 100);
        // ctx.fillStyle = '#ef535050';
        // ctx.fill();

        // ctx.beginPath();
        // ctx.rect(0, 0, canvasWidth, 100);
        // ctx.fillStyle = '#eee35050';
        // ctx.fill();



        // Calculate price range for visible data
        const visibleData = data.slice(
            Math.max(0, startIndex),
            Math.min(data.length, startIndex + maxVisibleCandles)
        );

        const highPrice = Math.max(...visibleData.map((d) => d.high));
        const lowPrice = Math.min(...visibleData.map((d) => d.low));
        const priceRange = (highPrice - lowPrice) * 1.1; // Add 10% padding

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
            if (i >= 0 && i < data.length) {
                const x = canvasWidth - (i * totalCandleWidth) + chartOffsetX;
                if (x >= padding.left && x <= canvasWidth - padding.right) {
                    ctx.moveTo(x, padding.top);
                    ctx.lineTo(x, canvasHeight - padding.bottom);

                    // Time labels
                    const timeLabel = convertTimestampToDate(data[i].time)['time']
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

            if (dataIndex < 0 || dataIndex >= data.length) continue;

            const candleData = data[dataIndex];
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




        // Draw EMA line
        ctx.beginPath();
        ctx.strokeStyle = '#219600';
        ctx.lineWidth = 1;

        for (let index = 0; index < maxVisibleCandles; index++) {
            const dataIndex = index + startIndex;
            if (dataIndex < 0 || dataIndex >= data.length || !ema[dataIndex]) continue;

            const x = chartWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
            if (x < padding.left || x > canvasWidth - padding.right) continue;

            const y = padding.top + ((highPrice - ema[dataIndex]) / priceRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.lineWidth = 1;










        // Calculate and Draw RSI below the price chart
        const rsi = calculateRSI(data)
        const rsiHeight = 100; // height of RSI chart below the main chart
        var rsiPaddingTop = canvasHeight - rsiHeight - padding.bottom
        // rsiPaddingTop = rsiPaddingTop - (rsiHeight*4);

        // Draw RSI axis
        ctx.beginPath();
        ctx.strokeStyle = '#00000050';
        ctx.lineWidth = '0.5';

        const rsiLines = 5;
        for (let i = 0; i <= rsiLines; i++) {
            const y = rsiPaddingTop + (i * rsiHeight) / rsiLines;
            const value = 100 - (i * 100) / rsiLines;

            ctx.moveTo(padding.left, y);
            ctx.lineTo(canvasWidth - padding.right, y);

            ctx.fillStyle = '#444';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(0), canvasWidth - padding.right-100, y + 4);
        }
        ctx.stroke();


        // Draw RSI line
        ctx.beginPath();
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        for (let i = 0; i < rsi.length; i++) {
            if (i < startIndex || i >= startIndex + maxVisibleCandles) continue;

            const x = chartWidth - ((i) * totalCandleWidth) + chartOffsetX;
            const y = rsiPaddingTop + ((100 - rsi[i]) / 100) * rsiHeight;

            if (i === startIndex) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();





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