
import React, { useEffect, useRef, useState } from 'react';
import { convertTimestampToDate, calculateSMA, drawCircle } from '../utils/helpers';
import { sma, ema } from '../data/dataProcessor'


const Chart = ({ data = [] }) => {
    const canvasRef = useRef(null);
    const [chartOffsetX, setChartOffsetX] = useState(0);
    const [zoomFactor, setZoomFactor] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startDragX, setStartDragX] = useState(0);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
    const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
    const [mousePos, setMousePos] = useState({ x: null, y: null });


    const sma20 = sma

    useEffect(() => {
        const handleResize = () => {
            setCanvasWidth(window.innerWidth);
            setCanvasHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderChart = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const padding = { top: 50, right: 60, bottom: 50, left: 60 };
        const chartWidth = canvasWidth - padding.left - padding.right;
        const chartHeight = canvasHeight - padding.top - padding.bottom;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw chart background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

        const candleWidth = 50 * zoomFactor;
        const margin = 1;
        const totalCandleWidth = candleWidth + margin;

        const startIndex = Math.floor(chartOffsetX / totalCandleWidth);
        const maxVisibleCandles = Math.ceil(chartWidth / totalCandleWidth);

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
        const priceLines = 15;
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
            const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;

            if (x < padding.left || x > canvasWidth - padding.right) continue;

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

        // Draw SMA line
        ctx.beginPath();
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;

        for (let index = 0; index < maxVisibleCandles; index++) {
            const dataIndex = index + startIndex;
            if (dataIndex < 0 || dataIndex >= data.length || !sma20[dataIndex]) continue;

            const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
            if (x < padding.left || x > canvasWidth - padding.right) continue;

            const y = padding.top + ((highPrice - sma20[dataIndex]) / priceRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.lineWidth = 1;








        // Draw EMA line
        ctx.beginPath();
        ctx.strokeStyle = '#219600';
        ctx.lineWidth = 2;

        for (let index = 0; index < maxVisibleCandles; index++) {
            const dataIndex = index + startIndex;
            if (dataIndex < 0 || dataIndex >= data.length || !ema[dataIndex]) continue;

            const x = canvasWidth - ((index + startIndex) * totalCandleWidth) + chartOffsetX;
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




        // Draw circle
        const index_circle = 10
        const firstCandle = data[index_circle]; // The first visible candle

        if (firstCandle) {
            const CircleX = (canvasWidth - ((index_circle) * totalCandleWidth) + chartOffsetX) + (totalCandleWidth / 2)
            const CircleY = padding.top + ((highPrice - firstCandle.close) / priceRange) * chartHeight; // Y-position based on price
            // Ensure CircleX is within the visible chart area
            if (CircleX >= padding.left && CircleX <= canvasWidth - padding.right) {
                ctx.beginPath();
                ctx.arc(CircleX, CircleY, 5, 0, 2 * Math.PI); // Circle with radius 5
                ctx.fillStyle = "#FF0000"; // Red color
                ctx.fill();
                ctx.strokeStyle = "#000000"; // Black border
                ctx.stroke();
            }
        }







        const renderCrosshair = (ctx, mouseX, mouseY) => {
            if (mouseX === null || mouseY === null) return; // No crosshair if mouse is outside canvas

            // Draw vertical line
            ctx.beginPath();
            ctx.moveTo(mouseX, padding.top);
            ctx.lineTo(mouseX, canvasHeight - padding.bottom);
            ctx.strokeStyle = "#000"; // Crosshair line color
            ctx.setLineDash([6, 6]); // Set dashed line pattern
            ctx.lineWidth = 0.5;
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
            // const candleIndex = (canvasWidth - ((index_circle) * totalCandleWidth) + chartOffsetX)
            const candleIndex = Math.floor((mouseX - padding.left - chartOffsetX) / totalCandleWidth);
            const dataIndex = candleIndex + startIndex;
            if (dataIndex >= 0 && dataIndex < data.length) {
                const timeLabel = convertTimestampToDate(data[dataIndex].time);
                // Set font and alignment for text
                ctx.font = "12px Arial";
                ctx.textAlign = "center";

                // Measure the text to determine the width for the background
                const text = timeLabel['date'] + timeLabel['time'];
                const textWidth = ctx.measureText(text).width;
                const textHeight = 30; // Approximate height for a 12px font

                // Set background position and dimensions
                const bgX = mouseX - textWidth / 2 - 5; // Center the rectangle around the text
                const bgY = canvasHeight - padding.bottom + 0; // Position slightly above the text
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

        // Draw the crosshair
        renderCrosshair(ctx, mousePos.x, mousePos.y);


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
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [isDragging, chartOffsetX]);
    return (
        <div className="relative w-full h-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </div>
    );
};


export default Chart