import React from 'react';
import BarGraph from './BarGraph';
import RadarChart from './RadarChart';
import ResultTabel from './ResultTabel';

const Result = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [10, 20, 15, 30, 40, 50, 11, 12, 9, 5, 23, 67],
  };

  return (
    <div className="container " style={{ marginBottom: 60 }}>
      <div className="flex justify-between items-stretch"> {/* Wrap in a flex container */}
        <div className="w-1/2"> {/* Set the width of each component */}
          <BarGraph data={data} className="h-full" /> {/* Apply a common height class */}
        </div>
        <div className="w-1/2" > {/* Set the width of each component */}
          <RadarChart className="h-full" /> {/* Apply a common height class */}
        </div>

      </div>
      <div className="">
        <ResultTabel />
      </div>
    </div>
  );
}

export default Result;
