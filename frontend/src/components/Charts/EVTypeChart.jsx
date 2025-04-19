import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SEGMENT_COLORS = ['#2563EB', '#059669'];

const EVTypeChart = ({ data: vehicleDataset }) => {
  const [pieChartSegments, setPieChartSegments] = useState([]);

  useEffect(() => {
    if (!vehicleDataset || !vehicleDataset.length) {
      setPieChartSegments([]);
      return;
    }

    const typeTally = new Map();
    const fallbackType = 'Other';

    vehicleDataset.forEach(vehicle => {
      const rawEvType = vehicle["Electric Vehicle Type"];
      if (!rawEvType) return;

      const upperType = rawEvType.toUpperCase();
      let category = fallbackType;

      if (upperType.includes('BEV')) {
        category = 'BEV';
      } else if (upperType.includes('PHEV')) {
        category = 'PHEV';
      }

      typeTally.set(category, (typeTally.get(category) || 0) + 1);
    });

    const processedSegments = Array.from(typeTally.entries()).map(([typeKey, count]) => {
      let longName = 'Other / Unknown';
      if (typeKey === 'BEV') longName = 'Battery Electric Vehicle';
      if (typeKey === 'PHEV') longName = 'Plug-in Hybrid Electric Vehicle';

      return {
        shortName: typeKey,
        segmentValue: count,
        fullName: longName,
      };
    }).sort((a, b) => b.segmentValue - a.segmentValue);

    setPieChartSegments(processedSegments);

  }, [vehicleDataset]);

  const renderPieLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="11px"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }, []);

  const totalVehicles = useMemo(() => {
    return pieChartSegments.reduce((sum, segment) => sum + segment.segmentValue, 0);
  }, [pieChartSegments]);

  const formatPieTooltip = useCallback((value, name, props) => {
    if (!props || !props.payload) return ['', ''];
    const percentage = totalVehicles > 0 ? ((value / totalVehicles) * 100).toFixed(1) : 0;
    const countFormatted = value.toLocaleString ? value.toLocaleString() : value;
    return [
      `${countFormatted} vehicles (${percentage}%)`,
      props.payload.fullName
    ];
  }, [totalVehicles]);

  const formatPieLegend = useCallback((value, entry) => {
    return entry?.payload?.fullName || value;
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Vehicle Types (BEV vs PHEV)</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <Pie
              data={pieChartSegments}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderPieLabel}
              outerRadius={85}
              innerRadius={45}
              fill="#8884d8"
              dataKey="segmentValue"
              nameKey="shortName"
              startAngle={90}
              endAngle={450}
            >
              {pieChartSegments.map((entry, index) => (
                <Cell key={`cell-${entry.shortName}-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={formatPieTooltip}
              contentStyle={{ backgroundColor: 'rgba(30, 40, 50, 0.9)', border: 'none', borderRadius: '5px' }}
              itemStyle={{ color: '#EAEAEA' }}
              labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Legend
              formatter={formatPieLegend}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '15px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EVTypeChart;
