import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MAX_COUNTIES_TO_SHOW = 15;

const CountyChart = ({ data: vehicleRecords }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    if (!vehicleRecords || !vehicleRecords.length) {
      setBarChartData([]);
      return;
    }

    const countyTally = new Map();
    vehicleRecords.forEach(record => {
      const countyName = record.County;
      if (countyName) {
        countyTally.set(countyName, (countyTally.get(countyName) || 0) + 1);
      }
    });

    const countyList = Array.from(countyTally.entries())
      .map(([name, total]) => ({ countyName: name, vehicleCount: total }));

    countyList.sort((a, b) => b.vehicleCount - a.vehicleCount);

    const topCounties = countyList.slice(0, MAX_COUNTIES_TO_SHOW);

    setBarChartData(topCounties);

  }, [vehicleRecords]);

  const tooltipFormatter = (value, name, props) => {
    const formattedValue = value.toLocaleString ? value.toLocaleString() : value;
    return [`${formattedValue} vehicles`, 'Count'];
  };

  const yAxisTickFormatter = (tickValue) => {
    if (tickValue >= 1000) {
      return `${(tickValue / 1000).toFixed(0)}k`;
    }
    return tickValue;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Top Counties by EV Registrations</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 10, right: 25, left: 15, bottom: 25 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="countyName"
              angle={-50}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fontSize: 11, fill: '#D1D5DB' }}
              stroke="#9CA3AF"
            />
            <YAxis
              tickFormatter={yAxisTickFormatter}
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#D1D5DB' }}
              stroke="#9CA3AF"
              width={40}
            />
            <Tooltip
              cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
              formatter={tooltipFormatter}
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '4px' }}
              labelStyle={{ color: '#F9FAFB' }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Legend verticalAlign="bottom" height={6} iconType="circle" iconSize={10} />
            <Bar
              dataKey="vehicleCount"
              name="EV Count"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CountyChart;
