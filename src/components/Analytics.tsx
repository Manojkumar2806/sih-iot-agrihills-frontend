import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import type { SensorData } from '../types';

interface AnalyticsProps {
  sensorData: SensorData[];
}

const Analytics: React.FC<AnalyticsProps> = ({ sensorData }) => {
  const analytics = useMemo(() => {
    if (sensorData.length < 2) return null;

    const latest = sensorData[sensorData.length - 1];
    const previous = sensorData[sensorData.length - 2];

    return {
      temperatureTrend: latest.Temperature - previous.Temperature,
      humidityTrend: latest.Humidity - previous.Humidity,
      averageTemperature: sensorData.reduce((sum, d) => sum + d.Temperature, 0) / sensorData.length,
      averageHumidity: sensorData.reduce((sum, d) => sum + d.Humidity, 0) / sensorData.length,
      maxTemperature: Math.max(...sensorData.map(d => d.Temperature)),
      minTemperature: Math.min(...sensorData.map(d => d.Temperature)),
      motionEvents: sensorData.filter(d => d.MotionDetected).length,
    };
  }, [sensorData]);

  if (!analytics) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#ffffff' } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
    },
  };

  // Mini Temperature Trend with new color
  const tempChartData = {
    labels: sensorData.slice(-12).map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorData.slice(-12).map(d => d.Temperature),
        borderColor: '#FFA500', // changed to orange
        backgroundColor: 'rgba(255,165,0,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Multi-Sensor: Temperature vs Humidity
  const multiSensorData = {
    labels: sensorData.slice(-10).map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: sensorData.slice(-10).map(d => d.Temperature),
        borderColor: '#FF5555',
        backgroundColor: 'rgba(255, 85, 85, 0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: sensorData.slice(-10).map(d => d.Humidity),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Water & Soil single bar
  const waterSoilData = {
    labels: ['Soil Moisture', 'Water Level'],
    datasets: [
      {
        label: 'Current Value',
        data: sensorData.length
          ? [
              sensorData[sensorData.length - 1].SoilMoisture,
              sensorData[sensorData.length - 1].WaterLevelPercent,
            ]
          : [0, 0],
        backgroundColor: ['#22c55e', '#0ea5e9'],
      },
    ],
  };

  // New: Soil & Water Health Trend
  const soilWaterTrendData = {
    labels: sensorData.slice(-10).map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Soil Moisture',
        data: sensorData.slice(-10).map(d => d.SoilMoisture),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Water Level (%)',
        data: sensorData.slice(-10).map(d => d.WaterLevelPercent),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: sensorData.slice(-10).map(d => d.Humidity),
        borderColor: '#FACC15',
        backgroundColor: 'rgba(250,204,21,0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400 mb-8">Insights from real-time IoT sensor data</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Avg Temperature</h3>
              {analytics.temperatureTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
            <p className="text-2xl font-bold text-white">{analytics.averageTemperature.toFixed(1)}°C</p>
            <p className={`text-sm ${analytics.temperatureTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.temperatureTrend > 0 ? '+' : ''}{analytics.temperatureTrend.toFixed(1)}° from last
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Avg Humidity</h3>
              {analytics.humidityTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
            <p className="text-2xl font-bold text-white">{analytics.averageHumidity.toFixed(1)}%</p>
            <p className={`text-sm ${analytics.humidityTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.humidityTrend > 0 ? '+' : ''}{analytics.humidityTrend.toFixed(1)}% from last
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Temperature Range</h3>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {analytics.minTemperature.toFixed(1)}° - {analytics.maxTemperature.toFixed(1)}°C
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Motion Events</h3>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analytics.motionEvents}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Temperature Trend (Last 12 readings)</h3>
            <div className="h-48 w-full">
              <Line data={tempChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Temperature vs Humidity (Last 10 readings)</h3>
            <div className="h-48 w-full">
              <Line data={multiSensorData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Water & Soil Insight</h3>
            <div className="h-48 w-full">
              <Bar data={waterSoilData} options={chartOptions} />
            </div>
          </div>

          {/* New Dashboard */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Soil & Water Health Trend</h3>
            <div className="h-48 w-full">
              <Line data={soilWaterTrendData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
