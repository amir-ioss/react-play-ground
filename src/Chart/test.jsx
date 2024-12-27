import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import data from './data/data.json'



// Custom shapes manager class
class ShapesManager {
    constructor(chartContainer, chartInstance) {
      if (!chartContainer || !chartInstance) {
        throw new Error('Chart container and instance are required');
      }
  
      this.chart = chartInstance;
      this.shapes = new Map();
      this.container = document.createElement('div');
      this.setupContainer(chartContainer);
    }
  
    setupContainer(chartContainer) {
      this.container.style.position = 'absolute';
      this.container.style.pointerEvents = 'none';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      
      chartContainer.appendChild(this.container);
    }
  
    updateShapePosition(id) {
      const shape = this.shapes.get(id);
      if (!shape || !this.chart) return;
  
      try {
        const coordinate = this.chart.timeScale().timeToCoordinate(shape.time);
        const priceCoordinate = this.chart.priceScale('right').priceToCoordinate(shape.price);
  
        if (coordinate === null || priceCoordinate === null) {
          shape.element.style.display = 'none';
          return;
        }
  
        shape.element.style.display = 'block';
        shape.element.style.left = `${coordinate - shape.width / 2}px`;
        shape.element.style.top = `${priceCoordinate - shape.height / 2}px`;
      } catch (error) {
        console.error('Error updating shape position:', error);
      }
    }
  
    updateAllShapes = () => {
      for (const id of this.shapes.keys()) {
        this.updateShapePosition(id);
      }
    }
  
    addRectangle({ time, price, width, height, color }) {
      const id = `rect-${Date.now()}`;
      const element = document.createElement('div');
      
      element.style.position = 'absolute';
      element.style.background = color || 'rgba(76, 175, 80, 0.3)';
      element.style.border = `1px solid ${color || 'rgb(76, 175, 80)'}`;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      
      this.shapes.set(id, {
        type: 'rectangle',
        element,
        time,
        price,
        width,
        height
      });
      
      this.container.appendChild(element);
      this.updateShapePosition(id);
      
      return id;
    }
  
    addSVG({ time, price, svg, width, height }) {
      const id = `svg-${Date.now()}`;
      const element = document.createElement('div');
      
      element.style.position = 'absolute';
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.innerHTML = svg;
      
      this.shapes.set(id, {
        type: 'svg',
        element,
        time,
        price,
        width,
        height
      });
      
      this.container.appendChild(element);
      this.updateShapePosition(id);
      
      return id;
    }
  
    removeShape(id) {
      const shape = this.shapes.get(id);
      if (shape) {
        shape.element.remove();
        this.shapes.delete(id);
      }
    }
  
    clear() {
      for (const id of this.shapes.keys()) {
        this.removeShape(id);
      }
    }
  
    destroy() {
      this.clear();
      if (this.container && this.container.parentNode) {
        this.container.remove();
      }
    }
  }
  
  // Main Chart Component
  const ChartWithShapes = ({ data, shapes, width = 800, height = 400 }) => {
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const shapesManagerRef = useRef(null);
    const [isChartReady, setIsChartReady] = useState(false);
  
    // Initialize chart
    useEffect(() => {
      if (!chartContainerRef.current) return;
  
      // Create and set up the chart
      const chartContainer = chartContainerRef.current;
      const chart = createChart(chartContainer, {
        width,
        height,
        layout: {
          background: { type: 'solid', color: '#ffffff' },
          textColor: '#333',
        }
      });
  
      const mainSeries = chart.addCandlestickSeries();
      mainSeries.setData(data);
  
      // Store chart instance
      chartInstanceRef.current = chart;
  
      // Initialize shapes manager after a short delay to ensure chart is mounted
      setTimeout(() => {
        try {
          if (!shapesManagerRef.current && chartContainer && chart) {
            shapesManagerRef.current = new ShapesManager(chartContainer, chart);
            
            // Set up event listeners
            const handleUpdates = shapesManagerRef.current.updateAllShapes;
            chart.subscribeCrosshairMove(handleUpdates);
            chart.timeScale().subscribeVisibleTimeRangeChange(handleUpdates);
            
            setIsChartReady(true);
          }
        } catch (error) {
          console.error('Error initializing shapes manager:', error);
        }
      }, 100);
  
      // Cleanup
      return () => {
        if (shapesManagerRef.current) {
          shapesManagerRef.current.destroy();
        }
        chart.remove();
        setIsChartReady(false);
      };
    }, [width, height]);
  
    // Update shapes when they change
    useEffect(() => {
      if (!shapesManagerRef.current || !isChartReady) return;
  
      try {
        shapesManagerRef.current.clear();
  
        shapes.forEach(shape => {
          if (shape.type === 'rectangle') {
            shapesManagerRef.current.addRectangle(shape);
          } else if (shape.type === 'svg') {
            shapesManagerRef.current.addSVG(shape);
          }
        });
      } catch (error) {
        console.error('Error updating shapes:', error);
      }
    }, [shapes, isChartReady]);
  
    return (
      <div 
        ref={chartContainerRef} 
        style={{ position: 'relative' }}
      />
    );
  };




const App = () => {
    const candleStickData = data.slice(0, 1000).map(_ => ({ time: _[0], open: _[1], high: _[2], low: _[3], close: _[4] }))
    const sampleData = [
        { time: '2024-01-01', open: 100, high: 105, low: 95, close: 102 },
        // ... more candlestick data
    ];

    const sampleShapes = [
        {
            type: 'rectangle',
            time: data[0][0],
            price: data[0][3],
            width: 500,
            height: 300,
            color: 'rgba(255, 0, 0, 0.3)'
        },
        {
            type: 'svg',
            time: '2024-01-20',
            price: 105,
            svg: `<svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="gold" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>`,
            width: 24,
            height: 24
        }
    ];

    console.log({ sampleShapes });

    return <ChartWithShapes
        data={candleStickData}
        shapes={sampleShapes}
        width={1000}
        height={500}
    />;
};



export default App