import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Thermometer, Droplets, Activity, Wind } from 'lucide-react';
import type { SensorData } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  sensorData: SensorData[];
  isLoading: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ sensorData, isLoading }) => {
  const currentData = sensorData.find(d => d.id === 'current');

  const [temperatureTrend, setTemperatureTrend] = useState<number[]>([]);
  const [multiSensorTrend, setMultiSensorTrend] = useState<{ temp: number; hum: number }[]>([]);

  useEffect(() => {
    if (!currentData) return;

    setTemperatureTrend(prev => [...prev, currentData.Temperature].slice(-12));
    setMultiSensorTrend(prev => [...prev, { temp: currentData.Temperature, hum: currentData.Humidity }].slice(-10));

    const interval = setInterval(() => {
      if (currentData) {
        setTemperatureTrend(prev => [...prev, currentData.Temperature].slice(-12));
        setMultiSensorTrend(prev => [...prev, { temp: currentData.Temperature, hum: currentData.Humidity }].slice(-10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentData]);

  if (isLoading || !currentData) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const renderProgressBar = (value: number, max: number, colorClass: string) => {
    const percent = Math.min((value / max) * 100, 100);
    return (
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    );
  };

  const getPumpColor = (status: string) => (status === 'ON' ? 'text-green-400' : 'text-red-400');
  const getWaterAlertColor = (alert: string) => {
    if (alert === 'Normal') return 'text-green-400';
    if (alert === 'Low') return 'text-yellow-400';
    return 'text-red-400';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#ffffff' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
    },
  };

  const tempChartData = {
    labels: temperatureTrend.map((_, i) => `-${temperatureTrend.length - i}s`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureTrend,
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0,229,255,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const multiSensorData = {
    labels: multiSensorTrend.map((_, i) => `-${multiSensorTrend.length - i}s`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: multiSensorTrend.map(d => d.temp),
        backgroundColor: '#FF6B6B',
      },
      {
        label: 'Humidity (%)',
        data: multiSensorTrend.map(d => d.hum),
        backgroundColor: '#4D96FF',
      },
    ],
  };

  const waterSoilData = {
    labels: ['Soil Moisture', 'Water Level'],
    datasets: [
      {
        label: 'Current Values',
        data: [currentData.SoilMoisture, currentData.WaterLevelPercent],
        backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(0,229,255,0.7)'],
      },
    ],
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">IoT Dashboard</h1>
          <p className="text-gray-400">Real-time sensor monitoring for current data</p>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Temperature */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Thermometer className="h-8 w-8 text-red-400" />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{currentData.Temperature.toFixed(1)}°C</p>
                <p className="text-sm text-gray-400">Temperature</p>
              </div>
            </div>
            {renderProgressBar(currentData.Temperature, 50, 'bg-red-500')}
          </div>

          {/* Humidity */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Droplets className="h-8 w-8 text-blue-400" />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{currentData.Humidity.toFixed(0)}%</p>
                <p className="text-sm text-gray-400">Humidity</p>
              </div>
            </div>
            {renderProgressBar(currentData.Humidity, 100, 'bg-blue-500')}
          </div>

          {/* Soil Moisture */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-green-400" />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{currentData.SoilMoisture}</p>
                <p className="text-sm text-gray-400">Soil Moisture</p>
              </div>
            </div>
            {renderProgressBar(currentData.SoilMoisture, 4095, 'bg-green-500')}
          </div>

          {/* Water Level */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Wind className="h-8 w-8 text-cyan-400" />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{currentData.WaterLevelPercent.toFixed(1)}%</p>
                <p className="text-sm text-gray-400">Water Level</p>
              </div>
            </div>
            {renderProgressBar(currentData.WaterLevelPercent, 100, 'bg-cyan-500')}
          </div>

          {/* Pump Status */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-yellow-400" />
              <div className="text-right">
                <p className={`text-2xl font-bold ${getPumpColor(currentData.PumpStatus)}`}>
                  {currentData.PumpStatus}
                </p>
                <p className="text-sm text-gray-400">Pump Status</p>
              </div>
            </div>
          </div>

          {/* Water Alert */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8 text-purple-400" />
              <div className="text-right">
                <p className={`text-2xl font-bold ${getWaterAlertColor(currentData.WaterAlert)}`}>
                  {currentData.WaterAlert}
                </p>
                <p className="text-sm text-gray-400">Water Alert</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Temperature Trend & Multi-Sensor Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Temperature Trend */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Temperature Trend (Last 12 readings)</h3>
            <div className="h-32 w-full">
              <Line data={tempChartData} options={chartOptions} />
            </div>
          </div>

          {/* Multi-Sensor Chart */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
            <h3 className="text-xl font-semibold text-white mb-4">Temperature vs Humidity (Last 10 readings)</h3>
            <div className="h-32 w-full">
              <Bar data={multiSensorData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Water & Soil Insight */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-6 rounded-xl border border-cyan-500/10">
          <h3 className="text-xl font-semibold text-white mb-4">Water & Soil Insight</h3>
          <div className="h-32 w-full">
            <Bar data={waterSoilData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
