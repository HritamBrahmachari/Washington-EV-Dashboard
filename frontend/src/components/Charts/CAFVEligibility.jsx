
import React, { useEffect, useState } from 'react';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend as RechartsLegend } from 'recharts';

const PIE_SLICE_COLORS = ['#10B981', '#F59E0B', '#EF4444'];


const CAFVEligibility = () => {

  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    const rawEligibilityStats = [
      { name: 'Unknown', value: 26031 },
      { name: 'Eligible', value: 18749 },
      { name: 'Not Eligible', value: 5220 }
    ];


    const categoryOrder = { 'Eligible': 1, 'Unknown': 2, 'Not Eligible': 3 };


    const sortedStats = [...rawEligibilityStats].sort((itemA, itemB) => {
      return (categoryOrder[itemA.name] || 99) - (categoryOrder[itemB.name] || 99);
    });

    setChartData(sortedStats);


  }, []);


  const renderInnerLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;


    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const xPos = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const yPos = cy + radius * Math.sin(-midAngle * (Math.PI / 180));


    if (percent < 0.03) {
      return null;
    }

    return (
      <text
        x={xPos}
        y={yPos}
        fill="#FFF"
        textAnchor={xPos > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12px"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  const formatTooltip = (value, name) => {

    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
    if (total === 0) return [`${value} vehicles (N/A)`, name];

    const percentage = ((value / total) * 100).toFixed(1);
    return [`${value.toLocaleString()} vehicles (${percentage}%)`, name];
  }

  return (

    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        CAFV Eligibility Distribution
      </h2>

      <div className="h-[382px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderInnerLabel}
              outerRadius={90}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={1}
            >

              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_SLICE_COLORS[index % PIE_SLICE_COLORS.length]} />

              ))}
            </Pie>


            <Tooltip formatter={formatTooltip}
              cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
              contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '4px' }}
              labelStyle={{ color: '#F9FAFB' }}
              itemStyle={{ color: '#E5E7EB' }}
            />

            <RechartsLegend />

          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CAFVEligibility;




