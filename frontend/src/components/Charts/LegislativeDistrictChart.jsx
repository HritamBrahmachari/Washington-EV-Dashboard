import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const predefinedDistrictStats = [
  { district: '1', count: 2135 }, { district: '2', count: 223 }, { district: '3', count: 2 },
  { district: '5', count: 1707 }, { district: '6', count: 1 }, { district: '7', count: 34 },
  { district: '9', count: 5 }, { district: '10', count: 197 }, { district: '11', count: 3779 },
  { district: '12', count: 5 }, { district: '13', count: 9 }, { district: '14', count: 219 },
  { district: '15', count: 140 }, { district: '16', count: 4 }, { district: '17', count: 1636 },
  { district: '18', count: 2296 }, { district: '19', count: 241 }, { district: '20', count: 368 },
  { district: '21', count: 496 }, { district: '22', count: 983 }, { district: '23', count: 1516 },
  { district: '24', count: 446 }, { district: '26', count: 427 }, { district: '30', count: 719 },
  { district: '31', count: 170 }, { district: '32', count: 1903 }, { district: '33', count: 2024 },
  { district: '34', count: 1315 }, { district: '35', count: 413 }, { district: '36', count: 2715 },
  { district: '37', count: 1659 }, { district: '38', count: 52 }, { district: '39', count: 280 },
  { district: '40', count: 2 }, { district: '41', count: 4887 }, { district: '43', count: 2432 },
  { district: '44', count: 590 }, { district: '45', count: 4396 }, { district: '46', count: 2818 },
  { district: '47', count: 1583 }, { district: '48', count: 4352 }, { district: '49', count: 821 }
];

const LegislativeDistrictChart = ({ data: ignoredPropData }) => {
  const [chartData, setChartData] = useState([]);
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    let itemsToSort = [...predefinedDistrictStats];
    const sortFunction = (a, b) => {
      return sortDirection === 'desc' ? b.count - a.count : a.count - b.count;
    };
    itemsToSort.sort(sortFunction);
    setChartData(itemsToSort);
  }, [sortDirection]);

  const handleSortToggle = useCallback(() => {
    setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
  }, []);

  const tooltipLabelFormatter = useCallback((value, name, props) => {
    if (props && props.payload && props.payload.district) {
      const countFormatted = props.payload.count.toLocaleString ? props.payload.count.toLocaleString() : props.payload.count;
      return [`District ${props.payload.district}: ${countFormatted} EVs`, 'Count'];
    }
    return [`${value} EVs`, 'Count'];
  }, []);

  const xAxisTickFormatter = (value) => {
    return value >= 1000 ? `${value / 1000}k` : value;
  };

  const sortButtonText = useMemo(() => {
    return `Sort ${sortDirection === 'desc' ? 'Ascending ↑' : 'Descending ↓'}`;
  }, [sortDirection]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">EV Count by Legislative District</h2>
        <button
          onClick={handleSortToggle}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {sortButtonText}
        </button>
      </div>
      <div className="h-[375px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.6} horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tickFormatter={xAxisTickFormatter}
              tick={{ fontSize: 11, fill: '#A0AEC0' }}
              stroke="#CBD5E0"
              domain={[0, 'dataMax + 200']}
              allowDecimals={false}
            />
            <YAxis
              hide={true}
              type="category"
              dataKey="district"
            />
            <Tooltip
              formatter={tooltipLabelFormatter}
              cursor={{ fill: 'rgba(200, 210, 220, 0.2)' }}
              contentStyle={{ backgroundColor: 'rgba(30, 40, 50, 0.9)', border: 'none', borderRadius: '5px' }}
              itemStyle={{ color: '#EAEAEA' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="square"
              iconSize={10}
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <Bar
              dataKey="count"
              name="EV Registrations"
              fill="#4F46E5"
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LegislativeDistrictChart;
