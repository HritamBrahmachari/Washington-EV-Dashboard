import React, { useEffect, useState, useMemo } from 'react';
import Plotly from 'react-plotly.js';

const MAX_MAKES_DISPLAYED = 8;
const MAX_MODELS_PER_MAKE = 3;

const modelColorPalette = [
  '#4299E1',
  '#63B3ED',
  '#90CDF4',
];
const otherModelColor = '#CBD5E0';

const initialVehicleModelData = [
  { make: "TESLA", model: "MODEL Y", count: 10389 }, { make: "TESLA", model: "MODEL 3", count: 8808 },
  { make: "NISSAN", model: "LEAF", count: 3770 }, { make: "TESLA", model: "MODEL S", count: 2150 },
  { make: "CHEVROLET", model: "BOLT EV", count: 1828 }, { make: "TESLA", model: "MODEL X", count: 1765 },
  { make: "JEEP", model: "WRANGLER", count: 1171 }, { make: "CHEVROLET", model: "VOLT", count: 1085 },
  { make: "VOLKSWAGEN", model: "ID.4", count: 1007 }, { make: "CHRYSLER", model: "PACIFICA", count: 908 },
  { make: "KIA", model: "NIRO", count: 887 }, { make: "FORD", model: "MUSTANG MACH-E", count: 815 },
  { make: "BMW", model: "X5", count: 731 }, { make: "TOYOTA", model: "PRIUS PRIME", count: 662 },
  { make: "RIVIAN", model: "R1S", count: 649 }, { make: "HYUNDAI", model: "IONIQ 5", count: 619 },
  { make: "TOYOTA", model: "RAV4 PRIME", count: 571 }, { make: "CHEVROLET", model: "BOLT EUV", count: 569 },
  { make: "KIA", model: "EV6", count: 564 }, { make: "BMW", model: "I3", count: 546 },
  { make: "RIVIAN", model: "R1T", count: 422 }, { make: "VOLVO", model: "XC90", count: 419 },
  { make: "DODGE", model: "HORNET", count: 412 }, { make: "FORD", model: "FUSION", count: 361 },
  { make: "FORD", model: "C-MAX", count: 345 }, { make: "BMW", model: "I4", count: 325 },
  { make: "VOLVO", model: "XC60", count: 324 }, { make: "SUBARU", model: "SOLTERRA", count: 323 },
  { make: "VOLKSWAGEN", model: "E-GOLF", count: 321 }, { make: "VOLVO", model: "XC40", count: 306 }
];

const ModelDistribution = () => {
  const [plotConfiguration, setPlotConfiguration] = useState({
    categoryLabels: [],
    seriesData: []
  });

  useEffect(() => {
    const makesAggregated = initialVehicleModelData.reduce((accumulator, currentItem) => {
      const makeKey = currentItem.make;
      if (!accumulator.has(makeKey)) {
        accumulator.set(makeKey, { totalCount: 0, modelList: [] });
      }
      const entry = accumulator.get(makeKey);
      entry.totalCount += currentItem.count;
      entry.modelList.push({ name: currentItem.model, number: currentItem.count });
      return accumulator;
    }, new Map());

    const dominantMakes = Array.from(makesAggregated.entries())
      .map(([makeName, details]) => ({ make: makeName, total: details.totalCount, models: details.modelList }))
      .sort((a, b) => b.total - a.total)
      .slice(0, MAX_MAKES_DISPLAYED);

    const makeLabels = dominantMakes.map(item => item.make);

    const stackedBarData = dominantMakes.map(makeInfo => {
      makeInfo.models.sort((a, b) => b.number - a.number);
      const topModels = makeInfo.models.slice(0, MAX_MODELS_PER_MAKE);
      const formattedModels = topModels.map((modelItem, idx) => ({
        modelName: modelItem.name,
        modelCount: modelItem.number,
        assignedColor: modelColorPalette[idx % modelColorPalette.length],
        rank: idx
      }));

      const topModelsSum = topModels.reduce((sum, m) => sum + m.number, 0);
      const otherModelsCount = makeInfo.total - topModelsSum;

      if (otherModelsCount > 0 && makeInfo.models.length > MAX_MODELS_PER_MAKE) {
        formattedModels.push({
          modelName: 'Other Models',
          modelCount: otherModelsCount,
          assignedColor: otherModelColor,
          rank: MAX_MODELS_PER_MAKE
        });
      }

      return {
        makeIdentifier: makeInfo.make,
        modelBreakdown: formattedModels,
        grandTotal: makeInfo.total
      };
    });

    setPlotConfiguration({
      categoryLabels: makeLabels,
      seriesData: stackedBarData
    });

  }, []);

  const plotlyTraces = useMemo(() => {
    const maxPossibleRank = MAX_MODELS_PER_MAKE + 1;
    let traces = [];
    const legendNames = ["Top Model", "2nd Model", "3rd Model", "Other Models"];

    for (let rankIndex = 0; rankIndex < maxPossibleRank; rankIndex++) {
      const yValues = [];
      const xValues = plotConfiguration.categoryLabels;
      const traceColors = [];
      const hoverData = [];

      for (const makeLabel of xValues) {
        const makeData = plotConfiguration.seriesData.find(d => d.makeIdentifier === makeLabel);
        const modelInfo = makeData?.modelBreakdown.find(m => m.rank === rankIndex);

        yValues.push(modelInfo ? modelInfo.modelCount : 0);
        traceColors.push(modelInfo ? modelInfo.assignedColor : 'transparent');
        hoverData.push(modelInfo ? modelInfo.modelName : 'N/A');
      }

      if (yValues.some(y => y > 0)) {
        traces.push({
          type: 'bar',
          name: legendNames[rankIndex] || `Rank ${rankIndex}`,
          x: xValues,
          y: yValues,
          marker: { color: traceColors, line: { width: 0 } },
          customdata: hoverData,
          hovertemplate: '<b>%{x}</b><br>%{customdata}: %{y:,.0f} vehicles<extra></extra>'
        });
      }
    }
    return traces;
  }, [plotConfiguration]);

  const plotlyLayout = useMemo(() => ({
    barmode: 'stack',
    hovermode: 'closest',
    margin: { t: 40, l: 70, r: 25, b: 110 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    showlegend: true,
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: -0.45,
      xanchor: 'center',
      x: 0.5,
      font: { color: '#E2E8F0', size: 10 }
    },
    hoverlabel: {
      bgcolor: 'rgba(30, 40, 50, 0.9)',
      bordercolor: 'transparent',
      font: {
        color: '#EAEAEA',
        size: 13,
        family: 'Inter, sans-serif'
      },
      align: 'auto'
    },
    xaxis: {
      categoryorder: 'array',
      categoryarray: plotConfiguration.categoryLabels,
      tickangle: -50,
      automargin: true,
      tickfont: { color: '#CBD5E0', size: 11 },
      linecolor: '#A0AEC0',
      gridcolor: 'rgba(200, 200, 200, 0.1)'
    },
    yaxis: {
      title: { text: 'Number of Registered Vehicles', font: { color: '#A0AEC0' } },
      gridcolor: 'rgba(200, 200, 200, 0.2)',
      tickfont: { color: '#CBD5E0', size: 11 },
      linecolor: '#A0AEC0',
      zerolinecolor: '#A0AEC0',
      fixedrange: true
    },
    annotations: plotConfiguration.seriesData.map(makeData => ({
      x: makeData.makeIdentifier,
      y: makeData.grandTotal,
      text: makeData.grandTotal.toLocaleString(),
      showarrow: false,
      yshift: 12,
      xanchor: 'center',
      font: { size: 9.5, color: '#CBD5E0' }
    }))
  }), [plotConfiguration.categoryLabels, plotConfiguration.seriesData]);

  const plotlyConfig = useMemo(() => ({
    responsive: true,
    displayModeBar: false
  }), []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">Top Makes & Model Distribution</h2>
      <div className="h-[382px]">
        {plotConfiguration.categoryLabels.length > 0 && (
          <Plotly
            data={plotlyTraces}
            layout={plotlyLayout}
            config={plotlyConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        )}
      </div>
    </div>
  );
};

export default ModelDistribution;