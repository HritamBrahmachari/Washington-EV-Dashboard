import React, { useEffect, useState, useMemo } from 'react';
import PlotlyInstance from 'react-plotly.js';

const RangeDistribution = ({ data: inputVehicleData }) => {
  const [histogramValues, setHistogramValues] = useState([]);

  useEffect(() => {
    if (inputVehicleData && inputVehicleData.length) {
      const ranges = inputVehicleData
        .map(vehicle => Number(vehicle["Electric Range"]))
        .filter(range => !isNaN(range) && range > 0);

      setHistogramValues(ranges);
    } else {
      setHistogramValues([]);
    }
  }, [inputVehicleData]);

  const histogramTrace = useMemo(() => ([{
    x: histogramValues,
    type: 'histogram',
    marker: {
      color: '#3B82F6',
      line: {
        color: '#F9FAFB',
        width: 0.5
      }
    },
    xbins: {
      size: 25
    },
    hovertemplate: '<b>Range:</b> %{x} miles<br><b>Count:</b> %{y}<extra></extra>'
  }]), [histogramValues]);

  const chartLayoutConfig = useMemo(() => ({
    autosize: true,
    margin: { l: 80, r: 30, t: 40, b: 60 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      title: {
        text: 'Electric Range (miles)',
        standoff: 15,
        font: { size: 13, color: '#D1D5DB' }
      },
      tickfont: { color: '#A0AEC0', size: 11 },
      linecolor: '#A0AEC0',
      tickcolor: '#A0AEC0',
      gridcolor: 'rgba(203, 213, 225, 0.15)',
      zerolinecolor: 'rgba(203, 213, 225, 0.3)'
    },
    yaxis: {
      title: {
        text: 'Number of Vehicles',
        standoff: 15,
        font: { size: 13, color: '#D1D5DB' }
      },
      tickfont: { color: '#A0AEC0', size: 11 },
      linecolor: '#A0AEC0',
      tickcolor: '#A0AEC0',
      gridcolor: 'rgba(203, 213, 225, 0.2)',
      zerolinecolor: 'rgba(203, 213, 225, 0.3)'
    },
    bargap: 0.05,
    hovermode: 'closest',
    hoverlabel: {
      bgcolor: 'rgba(30, 40, 50, 0.9)',
      font: {
        color: '#EAEAEA',
        size: 13,
        family: 'Inter, sans-serif',
      },
      bordercolor: 'transparent',
      align: 'auto'
    }
  }), []);

  const chartDisplayOptions = useMemo(() => ({
    responsive: true,
    displayModeBar: false,
  }), []);

  const hasSufficientData = histogramValues.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Electric Range Distribution</h2>
      <div className="h-[355px]">
        {hasSufficientData && (
          <PlotlyInstance
            data={histogramTrace}
            layout={chartLayoutConfig}
            config={chartDisplayOptions}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        )}
        {!hasSufficientData && (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Awaiting Range Data...
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeDistribution;
