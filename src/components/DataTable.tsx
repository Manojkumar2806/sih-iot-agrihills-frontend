import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import type { SensorData } from '../types';
import { format } from 'date-fns';

interface DataTableProps {
  sensorData: SensorData[];
}

const DataTable: React.FC<DataTableProps> = ({ sensorData }) => {
  const [filteredData, setFilteredData] = useState<SensorData[]>(sensorData);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<keyof SensorData>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let data = [...sensorData];

    // Keep 'current' as first row and sort remaining by ascending ID
    const currentRow = data.find(row => row.id === 'current');
    const otherRows = data.filter(row => row.id !== 'current').sort((a, b) => Number(a.id) - Number(b.id));
    if (currentRow) data = [currentRow, ...otherRows];

    // Apply search/filter
    if (searchTerm) {
      data = data.filter(row =>
        String(row[searchField]).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(data);
    setCurrentPage(1); // reset to first page on search/filter change
  }, [sensorData, searchTerm, searchField]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); // placeholder for actual fetch
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Temperature', 'Humidity', 'Soil Moisture', 'Pump Status', 'Water Level %', 'Water Alert'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.id,
        row.Temperature,
        row.Humidity,
        row.SoilMoisture,
        row.PumpStatus,
        row.WaterLevelPercent,
        row.WaterAlert
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPumpColor = (status: string) => status === 'ON' ? 'text-green-400' : 'text-red-400';
  const getWaterAlertColor = (alert: string) => {
    if (alert === 'Normal') return 'text-green-400';
    if (alert === 'Low') return 'text-yellow-400';
    return 'text-red-400';
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sensor Data Table</h1>
          <p className="text-gray-400">Real-time sensor data from Firebase with advanced filtering and export capabilities</p>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 flex-col sm:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search by ${searchField}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-full"
              />
            </div>

            {/* Field select */}
            <select
              value={searchField}
              onChange={e => setSearchField(e.target.value as keyof SensorData)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              <option value="id">ID</option>
              <option value="PumpStatus">Pump Status</option>
              <option value="WaterAlert">Water Alert</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg text-white transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl border border-cyan-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Humidity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Soil Moisture</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pump Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Water Level %</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Water Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-800/30 transition-colors ${row.id === 'current' ? 'bg-blue-900/40 font-bold' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Temperature.toFixed(1)}°C</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.Humidity.toFixed(0)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.SoilMoisture}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPumpColor(row.PumpStatus)}`}>{row.PumpStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.WaterLevelPercent.toFixed(1)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getWaterAlertColor(row.WaterAlert)}`}>{row.WaterAlert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-800/30 px-6 py-4 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
