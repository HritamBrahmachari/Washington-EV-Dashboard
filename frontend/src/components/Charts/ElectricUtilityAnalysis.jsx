import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const utilityProviderStats = [
  { name: "CITY OF TACOMA - (WA)", count: 37501 },
  { name: "PUGET SOUND ENERGY INC", count: 31616 },
  { name: "CITY OF SEATTLE - (WA)", count: 12454 },
  { name: "BONNEVILLE POWER ADMINISTRATION", count: 5919 },
  { name: "PUD NO 1 OF CLARK COUNTY - (WA)", count: 4838 },
];

const UTILITY_PALETTE = [
  '#3B82F6',
  '#10B981',
  '#6366F1',
  '#8B5CF6',
  '#F43F5E',
];

const TreemapNodeRenderer = (props) => {
  const { x, y, width, height, name, fill } = props;

  const nameValue = name || '';
  const displayLabel = width > 45 && height > 30 && nameValue;
  const truncatedName = displayLabel
    ? (nameValue.length > 11 ? `${nameValue.substring(0, 11)}…` : nameValue)
    : '';

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#FFF"
        strokeWidth={1.5}
      />
      {displayLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#FEFEFE"
          fontSize={width > 90 ? 11.5 : 9.5}
          fontFamily='system-ui, sans-serif'
          fontWeight="500"
          style={{ pointerEvents: 'none' }}
        >
          {truncatedName}
        </text>
      )}
    </g>
  );
};


const ElectricUtilityAnalysis = () => {

  const leadingUtilities = useMemo(() => {
    const sorted = [...utilityProviderStats].sort((a, b) => b.count - a.count);
    return sorted.slice(0, 5);
  }, []);

  const treemapInput = useMemo(() => {
    const topProvidersTotalCount = leadingUtilities.reduce((sum, u) => sum + u.count, 0);

    return leadingUtilities.map((utility, index) => {
      const percentageShare = topProvidersTotalCount > 0
        ? ((utility.count / topProvidersTotalCount) * 100).toFixed(1)
        : 0;

      const assignedColor = index < UTILITY_PALETTE.length
        ? UTILITY_PALETTE[index]
        : '#A5B4FC';

      return {
        id: `util-${index}`,
        name: utility.name,
        size: utility.count,
        percentage: percentageShare,
        fill: assignedColor
      };
    });
  }, [leadingUtilities]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const nodeData = payload[0].payload;
      if (!nodeData) return null;

      return (
        <div className="bg-gray-800 p-3 shadow-lg rounded border border-gray-600 opacity-90">
          <p className="text-sm font-medium text-gray-100">{nodeData.name}</p>
          <p className="text-xs text-gray-300 mt-1">{nodeData.size.toLocaleString()} vehicles</p>
          <p className="text-xs text-gray-300">{nodeData.percentage}% share</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Top Electric Utility Providers</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-5 text-xs uppercase tracking-wider">
        EV Distribution Share (Top 5)
      </p>
      <div className="h-[327px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapInput}
            dataKey="size"
            nameKey="name"
            aspectRatio={1.25}
            stroke="#FFFFFF"
            fill={(data) => data.fill}
            isAnimationActive={true}
            animationDuration={400}
            animationEasing="ease-in-out"
            content={<TreemapNodeRenderer />}
          >
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeWidth: 1 }} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElectricUtilityAnalysis;