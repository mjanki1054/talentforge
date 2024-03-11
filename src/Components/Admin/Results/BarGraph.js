import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BarGraph = ({ data }) => {
  const chartRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    let chartInstance = null;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy();
    }

    // Get the selected month and year
    const selectedMonth = selectedDate.getMonth();
    // const selectedYear = selectedDate.getFullYear();

    // Filter the data based on the selected month and year
    const filteredLabels = data.labels.slice(0, selectedMonth + 1);
    const filteredValues = data.values.slice(0, selectedMonth + 1);

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Candidate',
            data: filteredValues,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, selectedDate]);

  return (
    <div className="container mb-[60px]">
      <div className="container pl-8 pr-6 mx-auto pt-6">
        <div className="bg-white shadow-lg px-2 pt-4 rounded-md mt-2 px-6 pb-4" style={{ height: '245px', }}>
          
          <div className="ml-auto">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
            />
          </div>

        

        <canvas className="w-full bg:white" ref={chartRef} />
      </div>
      </div>
    </div>

  );
};

export default BarGraph;
