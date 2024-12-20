import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const BoxDrawingChart = () => {
    const chartContainerRef = useRef(null);

    useEffect(() => {

        const chart = createChart(document.getElementById('chart'), {
            width: 800,
            height: 400
        });

        // Add a main series (could be candlestick, line, etc.)
        const mainSeries = chart.addCandlestickSeries();

        // Create the rectangle using PriceLine API
        const rectangle = {
            // Time values for left and right sides of rectangle
            time1: '2024-01-01',
            time2: '2024-02-01',
            // Price levels for top and bottom of rectangle
            price1: 100,
            price2: 120,
        };

        // Draw the top line of the rectangle
        mainSeries.createPriceLine({
            price: rectangle.price1,
            color: '#FF0000',
            lineWidth: 2,
            lineStyle: 2, // Dashed line
            axisLabelVisible: false,
            title: '',
            time: rectangle.time1,
            timeVisible: false,
        });

        // Draw the bottom line of the rectangle
        mainSeries.createPriceLine({
            price: rectangle.price2,
            color: '#FF0000',
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: false,
            title: '',
            time: rectangle.time2,
            timeVisible: false,
        });

        // Add vertical lines for sides using markers
        mainSeries.setMarkers([
            {
                time: rectangle.time1,
                position: 'inBar',
                color: '#FF0000',
                shape: 'vertical-line',
            },
            {
                time: rectangle.time2,
                position: 'inBar',
                color: '#FF0000',
                shape: 'vertical-line',
            }
        ]);

        // Function to update rectangle position
        function updateRectangle(newTime1, newTime2, newPrice1, newPrice2) {
            // Remove existing lines
            mainSeries.removePriceLine(rectangle.topLine);
            mainSeries.removePriceLine(rectangle.bottomLine);

            // Update values
            rectangle.time1 = newTime1;
            rectangle.time2 = newTime2;
            rectangle.price1 = newPrice1;
            rectangle.price2 = newPrice2;

            // Redraw rectangle with new values
            // ... repeat creation code with new values
        }

        // Optional: Add mouse interaction to resize/move rectangle
        chart.subscribeClick((param) => {
            if (param.time && param.price) {
                // Handle click events to modify rectangle
                console.log(`Clicked at time: ${param.time}, price: ${param.price}`);
            }
        });



    }, []);

    return <div ref={chartContainerRef} />;
};

export default BoxDrawingChart;