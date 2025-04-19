import React, { useState, useEffect, useCallback } from 'react';


import CountyChart from '../Charts/CountyChart';
import EVYearTrend from '../Charts/EVYearTrend';
import ModelDistribution from '../Charts/ModelDistribution';
import EVTypeChart from '../Charts/EVTypeChart';
import RangeDistribution from '../Charts/RangeDistribution';
import CAFVEligibility from '../Charts/CAFVEligibility';
import LegislativeDistrictChart from '../Charts/LegislativeDistrictChart';
import CityDensityMap from '../Charts/CityDensityMap';
import ElectricUtilityAnalysis from '../Charts/ElectricUtilityAnalysis';
import TopModelsChart from '../Charts/TopModelsChart';


import evPopulationJson from '../../Electric_Vehicle_Population_Data.json'; 
const Dashboard = () => {
    
    const [vehiclePopulationData, setVehiclePopulationData] = useState([]);
    const [pageLoading, setPageLoading] = useState(true); 
    const [summaryMetrics, setSummaryMetrics] = useState({ 
        totalCount: 0,
        bevCount: 0,
        phevCount: 0,
        avgRange: 0,
    });

   
    const computeSummaryMetrics = useCallback((dataset) => { 
        if (!dataset || !Array.isArray(dataset) || dataset.length === 0) {
            setSummaryMetrics({ totalCount: 0, bevCount: 0, phevCount: 0, avgRange: 0 });
            return;
        }

        let totalVehicles = dataset.length;
        let bevTotal = 0;
        let phevTotal = 0;
        let cumulativeRange = 0;
        let vehiclesWithRange = 0;

        for (let i = 0; i < dataset.length; i++) {
            const vehicle = dataset[i];
            const vehicleType = vehicle["Electric Vehicle Type"];
            const electricRange = Number(vehicle["Electric Range"]); 

            if (vehicleType) {
                 if (vehicleType.includes('BEV')) {
                    bevTotal++;
                 } else if (vehicleType.includes('PHEV')) {
                    phevTotal++;
                 }
            }

            if (!isNaN(electricRange) && electricRange > 0) {
                cumulativeRange += electricRange;
                vehiclesWithRange++;
            }
        }

        const averageRange = vehiclesWithRange > 0 ? Math.round(cumulativeRange / vehiclesWithRange) : 0;

        setSummaryMetrics({
            totalCount: totalVehicles,
            bevCount: bevTotal,
            phevCount: phevTotal,
            avgRange: averageRange
        });
    }, []); 


    useEffect(() => {
        const initializeDashboardData = () => { 
            try {
                
                setVehiclePopulationData(evPopulationJson);
                computeSummaryMetrics(evPopulationJson); 

            } catch (err) {
                console.error("Failed to load or process EV data:", err);
               
            } finally {
                setPageLoading(false); 
            }
        };

        initializeDashboardData();
        
    }, [computeSummaryMetrics]); 


   


    // Display loading spinner while data is being processed
    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-300">Loading EV Data...</p>
            </div>
        );
    }

    // Main dashboard layout
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
           
           

            {/* Summary Statistics Cards */}
            <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Stat Card: Total EVs */}
                    <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800 border-l-4 border-blue-500 transform hover:scale-105 transition-transform duration-200">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total EVs Registered</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summaryMetrics.totalCount.toLocaleString()}</p>
                    </div>
                    {/* Stat Card: BEVs */}
                    <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800 border-l-4 border-green-500 transform hover:scale-105 transition-transform duration-200">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Battery Electric (BEV)</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{summaryMetrics.bevCount.toLocaleString()}</p>
                    </div>
                    {/* Stat Card: PHEVs */}
                    <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800 border-l-4 border-yellow-500 transform hover:scale-105 transition-transform duration-200">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Plug-in Hybrid (PHEV)</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{summaryMetrics.phevCount.toLocaleString()}</p>
                    </div>
                     {/* Stat Card: Avg Range */}
                    <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800 border-l-4 border-indigo-500 transform hover:scale-105 transition-transform duration-200">
                        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Avg. Electric Range</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {summaryMetrics.avgRange}
                            <span className="text-base font-medium ml-1">mi</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap */}

                {/* Row 1 */}
                <div className="lg:col-span-3 md:col-span-2 col-span-1"> {/* Adjusted span for consistency */}
                    <CountyChart data={vehiclePopulationData} />
                </div>

                {/* Row 2 */}
                <div className="md:col-span-2 col-span-1">
                    <EVYearTrend data={vehiclePopulationData} />
                </div>
                <div className="col-span-1">
                    <EVTypeChart data={vehiclePopulationData} />
                </div>

                {/* Row 3 */}
                 <div className="md:col-span-2 col-span-1">
                    <ModelDistribution data={vehiclePopulationData} />
                </div>
                 <div className="col-span-1">
                    <CAFVEligibility data={vehiclePopulationData} />
                </div>

                {/* Row 4 */}
                 <div className="col-span-1">
                     <ElectricUtilityAnalysis data={vehiclePopulationData} />
                </div>
                <div className="md:col-span-2 col-span-1">
                    <RangeDistribution data={vehiclePopulationData} />
                </div>

                 {/* Row 5 */}
                 <div className="md:col-span-2 col-span-1">
                    <LegislativeDistrictChart data={vehiclePopulationData} />
                </div>
                 <div className="col-span-1">
                    <TopModelsChart data={vehiclePopulationData} />
                </div>

                {/* Row 6 */}
                <div className="lg:col-span-3 md:col-span-2 col-span-1"> {/* Adjusted span for consistency */}
                    <CityDensityMap data={vehiclePopulationData} />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p>Washington State Electric Vehicle Population Dashboard.</p>
                <p>Data Source: data.wa.gov (Snapshot)</p>
                 <p className="mt-1">© {new Date().getFullYear()} - Project for Visualization Practice.</p>
            </footer>
        </div>
    );
};

export default Dashboard;