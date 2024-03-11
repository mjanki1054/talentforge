import React, { useRef, useEffect } from 'react';
import {Chart} from 'chart.js';

const RadarChart = () => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const data = {
      labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
      datasets: [
        {
          label: 'Dataset',
          data: [5, 3, 7, 2, 6],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scale: {
        ticks: {
          beginAtZero: true,
          max: 10,
        },
      },
    };

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy previous chart instance
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy(); // Clean up on unmount
      }
    };
  }, []);

  return (
    <div className="container mb-[60px]">
      <div className="container pl-8 pr-6 mx-auto pt-6 flex items-center">
        <div className="bg-white shadow-lg px-2 pt-4 rounded-md mt-2 px-6 pb-4" style={{ height: '245px', }}>
          <canvas ref={chartRef} ></canvas>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
