import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MIN_MODEL_COUNT_THRESHOLD = 5;
const TOP_MODELS_LIMIT = 10;

const TopModelsByRangeChart = ({ data: vehicleDataSource }) => {
    const [chartPlotData, setChartPlotData] = useState([]);

    useEffect(() => {
        if (!vehicleDataSource || !vehicleDataSource.length) {
            setChartPlotData([]);
            return;
        }

        const rangeTotals = new Map();
        const vehicleCounts = new Map();

        vehicleDataSource.forEach(vehicleRecord => {
            const makeName = vehicleRecord.Make || 'N/A';
            const modelName = vehicleRecord.Model || 'N/A';
            const electricRange = Number(vehicleRecord["Electric Range"]);

            if (!isNaN(electricRange) && electricRange > 0) {
                const modelIdentifier = `${makeName} ${modelName}`;

                const currentSum = rangeTotals.get(modelIdentifier) || 0;
                const currentCount = vehicleCounts.get(modelIdentifier) || 0;

                rangeTotals.set(modelIdentifier, currentSum + electricRange);
                vehicleCounts.set(modelIdentifier, currentCount + 1);
            }
        });

        const averageRanges = [];
        rangeTotals.forEach((totalRange, modelKey) => {
             const count = vehicleCounts.get(modelKey);
             if (count > 0) {
                 averageRanges.push({
                    modelKey: modelKey,
                    avgRange: totalRange / count,
                    vehicleNum: count
                 });
             }
        });

        const significantModels = averageRanges.filter(item => item.vehicleNum >= MIN_MODEL_COUNT_THRESHOLD);

        significantModels.sort((a, b) => b.avgRange - a.avgRange);

        const leadingModels = significantModels.slice(0, TOP_MODELS_LIMIT);

        setChartPlotData(leadingModels);

    }, [vehicleDataSource]);

    const formatTooltipValue = useCallback((value, name, props) => {
        return [`${Math.round(value)} miles`, 'Avg. Range'];
    }, []);

    const formatTooltipLabel = useCallback((label) => {
        return `Model: ${label}`;
    }, []);

    const formatXAxisLabel = (value) => {
        return `${value} mi`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Top {TOP_MODELS_LIMIT} EV Models by Average Range</h2>
            <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartPlotData}
                        layout="vertical"
                        margin={{ top: 5, right: 40, left: 10, bottom: 25 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="4 4" horizontal={true} vertical={false} strokeOpacity={0.5} />
                        <XAxis
                            type="number"
                            label={{
                                value: 'Avg. Electric Range (miles)',
                                position: 'insideBottom',
                                offset: -10,
                                fill: '#A0AEC0',
                                fontSize: 12
                            }}
                            tickFormatter={formatXAxisLabel}
                            tick={{ fontSize: 11, fill: '#A0AEC0' }}
                            stroke="#CBD5E0"
                            domain={[0, 'dataMax + 20']}
                            allowDecimals={false}
                        />
                        <YAxis
                            dataKey="modelKey"
                            type="category"
                            tick={{ fontSize: 10, fill: '#A0AEC0' }}
                            stroke="#CBD5E0"
                            width={110}
                            interval={0}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            formatter={formatTooltipValue}
                            labelFormatter={formatTooltipLabel}
                            cursor={{ fill: 'rgba(200, 210, 220, 0.15)' }}
                            contentStyle={{ backgroundColor: 'rgba(30, 40, 50, 0.9)', border: 'none', borderRadius: '4px' }}
                            itemStyle={{ color: '#E1E8F0' }}
                            labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
                        />
                        <Legend
                           wrapperStyle={{ bottom: 0, paddingTop: '5px' }}
                           iconType="circle"
                           iconSize={8}
                        />
                        <Bar
                            dataKey="avgRange"
                            name="Avg. Range"
                            fill="#10B981"
                            radius={[0, 3, 3, 0]}
                         />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopModelsByRangeChart;