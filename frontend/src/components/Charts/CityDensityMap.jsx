import React, { useEffect, useState, useMemo } from 'react';
import PlotlyMap from 'react-plotly.js';

const MIN_VEHICLES_PER_CITY = 5;

const CityDensityMap = ({ data: vehicleDataInput }) => {
  const [mapPoints, setMapPoints] = useState({
    pointCities: [],
    pointLons: [],
    pointLats: [],
    pointCounts: [],
    pointSizes: [],
    pointTexts: []
  });

  const parseCoordinates = (locationString) => {
    if (!locationString || typeof locationString !== 'string') return null;
    const regex = /POINT \(([-\d\.]+) ([-\d\.]+)\)/;
    const matches = locationString.match(regex);
    if (!matches || matches.length < 3) return null;

    const lonVal = parseFloat(matches[1]);
    const latVal = parseFloat(matches[2]);

    if (!isNaN(lonVal) && !isNaN(latVal)) {
      return { longitude: lonVal, latitude: latVal };
    }
    return null;
  };

  useEffect(() => {
    if (!vehicleDataInput || !Array.isArray(vehicleDataInput) || vehicleDataInput.length === 0) {
      setMapPoints({ pointCities: [], pointLons: [], pointLats: [], pointCounts: [], pointSizes: [], pointTexts: [] });
      return;
    }

    const aggregatedCityData = {};

    vehicleDataInput.forEach(vehicle => {
      const city = vehicle.City;
      const locationStr = vehicle["Vehicle Location"];

      if (!city || !locationStr) return;

      const coords = parseCoordinates(locationStr);
      if (!coords) return;

      if (!aggregatedCityData[city]) {
        aggregatedCityData[city] = { lon: coords.longitude, lat: coords.latitude, count: 0 };
      }
      aggregatedCityData[city].count += 1;
    });

    const citiesList = [];
    const longitudesList = [];
    const latitudesList = [];
    const countsList = [];
    const sizesList = [];
    const textsList = [];

    Object.entries(aggregatedCityData)
      .filter(([cityName, cityDetails]) => cityDetails.count >= MIN_VEHICLES_PER_CITY)
      .forEach(([cityName, cityDetails]) => {
        citiesList.push(cityName);
        longitudesList.push(cityDetails.lon);
        latitudesList.push(cityDetails.lat);
        countsList.push(cityDetails.count);
        sizesList.push(Math.sqrt(cityDetails.count) * 5);
        textsList.push(`${cityName}: ${cityDetails.count} EVs`);
      });

    setMapPoints({
      pointCities: citiesList,
      pointLons: longitudesList,
      pointLats: latitudesList,
      pointCounts: countsList,
      pointSizes: sizesList,
      pointTexts: textsList
    });

  }, [vehicleDataInput]);

  const mapTraceData = useMemo(() => ([{
    type: 'scattergeo',
    mode: 'markers',
    lon: mapPoints.pointLons,
    lat: mapPoints.pointLats,
    text: mapPoints.pointTexts,
    marker: {
      size: mapPoints.pointSizes,
      color: mapPoints.pointCounts,
      colorscale: 'Blues',
      cmin: Math.min(...mapPoints.pointCounts),
      cmax: Math.max(...mapPoints.pointCounts),
      colorbar: {
        title: 'EV Count',
        thickness: 20,
        tickfont: {
          color: '#CBD5E0',
          size: 10
        },
      },
      line: {
        color: 'rgba(0,0,0,0.5)',
        width: 1
      },
      sizemode: 'area'
    },
    hovertemplate: '%{text}<extra></extra>'
  }]), [mapPoints]);

  const mapLayoutConfig = useMemo(() => ({
    autosize: true,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    geo: {
      scope: 'usa',
      center: { lon: -120.5, lat: 47.5 },
      projection: { scale: 7 },
      showland: true,
      landcolor: 'rgb(243, 244, 246)',
      showlakes: true,
      lakecolor: 'rgb(199, 210, 254)',
      subunitcolor: 'rgb(209, 213, 219)',
      countrycolor: 'rgb(209, 213, 219)',
      countrywidth: 0.5,
      subunitwidth: 0.5
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  }), []);

  const mapDisplayOptions = useMemo(() => ({
    responsive: true,
    displayModeBar: false,
  }), []);

  const isDataReady = mapPoints.pointCities.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">City-wise EV Density</h2>
      <div className="h-[500px]">
        {isDataReady ? (
          <PlotlyMap
            data={mapTraceData}
            layout={mapLayoutConfig}
            config={mapDisplayOptions}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Loading map data...
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDensityMap;
