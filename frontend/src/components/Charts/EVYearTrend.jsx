import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ModelYearTrendChart = ({ data: vehicleInputData }) => {
    const [trendPoints, setTrendPoints] = useState([]);

    useEffect(() => {
        if (!vehicleInputData || !vehicleInputData.length) {
            setTrendPoints([]);
            return;
        }

        const vehicleCountsPerYear = new Map();
        vehicleInputData.forEach(item => {
            const modelYear = item["Model Year"];
            if (modelYear && !isNaN(parseInt(modelYear, 10))) {
                const yearNum = parseInt(modelYear, 10);
                vehicleCountsPerYear.set(yearNum, (vehicleCountsPerYear.get(yearNum) || 0) + 1);
            }
        });

        const aggregatedYears = Array.from(vehicleCountsPerYear.entries())
            .map(([yearValue, numVehicles]) => ({ year: yearValue, registrations: numVehicles }))
            .sort((entryA, entryB) => entryA.year - entryB.year);

        const filteredYears = aggregatedYears.filter(item => item.year > 1995);

        setTrendPoints(filteredYears);
    }, [vehicleInputData]);

    const formatTooltipValue = useCallback((value, name, props) => {
        const formattedCount = value.toLocaleString ? value.toLocaleString() : value;
        return [`${formattedCount} registrations`, 'Count'];
    }, []);

    const formatTooltipLabel = useCallback((label) => `Model Year: ${label}`, []);

    const formatYAxisTick = useCallback((tickValue) => {
        if (tickValue >= 10000) {
            return `${(tickValue / 1000).toFixed(0)}k`;
        }
        if (tickValue >= 1000) {
            return `${(tickValue / 1000).toFixed(1)}k`;
        }
        return tickValue.toString();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">EV Registrations by Model Year</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={trendPoints}
                        margin={{ top: 15, right: 35, left: 5, bottom: 5 }}
                        syncId="anyId"
                    >
                        <defs>
                            <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#A5B4FC" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.4} />
                        <XAxis
                            dataKey="year"
                            tick={{ fontSize: 11, fill: '#A0AEC0' }}
                            stroke="#CBD5E0"
                            padding={{ left: 10, right: 10 }}
                            tickMargin={5}
                        />
                        <YAxis
                            tickFormatter={formatYAxisTick}
                            tick={{ fontSize: 11, fill: '#A0AEC0' }}
                            stroke="#CBD5E0"
                            width={50}
                            allowDecimals={false}
                        />
                        <Tooltip
                            formatter={formatTooltipValue}
                            labelFormatter={formatTooltipLabel}
                            contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.85)', borderColor: '#4B5563', borderRadius: '6px' }}
                            itemStyle={{ color: '#D1D5DB' }}
                            labelStyle={{ color: '#F9FAFB', marginBottom: '4px' }}
                            cursor={{ stroke: '#6366F1', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconSize={12}
                            wrapperStyle={{ paddingBottom: '10px' }}
                        />
                        <Area
                            type="natural"
                            dataKey="registrations"
                            name="EV Registrations"
                            stroke="#4F46E5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRegistrations)"
                            activeDot={{ r: 6, strokeWidth: 2, fill: '#FFFFFF', stroke: '#4338CA' }}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ModelYearTrendChart;
