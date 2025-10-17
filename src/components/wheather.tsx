import React, { useEffect, useState } from 'react';
import { Cloud, Droplets, Sun, Thermometer, Wind, CloudRain, Eye, Gauge, AlertTriangle } from 'lucide-react';

interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: { icon: string; text: string };
  chance_of_rain: number;
}

interface DayForecast {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: { icon: string; text: string };
    daily_chance_of_rain: number;
    avghumidity: number;
  };
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [location, setLocation] = useState<string>('Tirupati');
  const [activeTab, setActiveTab] = useState<'today' | 'hourly' | 'weekly'>('today');
  const API_KEY = '37eaaa6ec2b040318ff12330251710';

  useEffect(() => {
    const fetchWeather = async (city: string) => {
      try {
        // Fetch current weather and 7-day forecast
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=yes`
        );
        const data = await response.json();
        if (data.error) setError(data.error.message);
        else {
          setWeather(data);
          setForecast(data.forecast);
        }
      } catch {
        setError('Failed to fetch weather data.');
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const geoResponse = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes`
        );
        const geoData = await geoResponse.json();
        setWeather(geoData);
        setForecast(geoData.forecast);
        setLocation(geoData.location.name);
        setLoading(false);
      },
      () => fetchWeather(location)
    );
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-[50vh] text-gray-300 text-lg">Loading weather data...</div>;
  if (error) return <div className="text-center text-red-400 mt-10">{error}</div>;

  // Calculate weather condition percentages
  const getWeatherPercentages = () => {
  const current = weather?.current;
  if (!current) return { sunny: 0, cloudy: 0, rainy: 0 };
    let sunny = 0, cloudy = 0, rainy = 0;

    // Base calculations on cloud cover and precipitation
    if (current.precip_mm > 0 || current.condition.text.toLowerCase().includes('rain')) {
      rainy = 70;
      cloudy = 20;
      sunny = 10;
    } else if (current.cloud > 70) {
      cloudy = 70;
      sunny = 20;
      rainy = 10;
    } else if (current.cloud > 30) {
      cloudy = 50;
      sunny = 40;
      rainy = 10;
    } else {
      sunny = 70;
      cloudy = 25;
      rainy = 5;
    }

    return { sunny, cloudy, rainy };
  };

  const weatherPercentages = getWeatherPercentages();

  // Farmer-centric recommendations
  const recommendations: string[] = [];
  if (weather?.current?.temp_c > 35) recommendations.push('High temperature! Irrigate to protect crops.');
  if (weather?.current?.humidity > 80) recommendations.push('High humidity — watch for fungal diseases.');
  if (weather?.current?.wind_kph > 25) recommendations.push('Strong wind expected — avoid spraying pesticides.');
  if (weather?.current?.precip_mm > 0) recommendations.push('Rainfall detected — adjust irrigation accordingly.');
  if (weather?.current?.uv > 7) recommendations.push('High UV index — protect sun-sensitive crops.');
  if ((forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? 0) > 70)
    recommendations.push('High chance of rain — delay fertilizer application and plan drainage.');
  if ((weather?.current?.temp_c ?? 100) < 10)
    recommendations.push('Low temperature — protect frost-sensitive plants and cover seedlings.');

  // Alerts chips for key conditions
  const alerts: { label: string; color: string }[] = [];
  {
    const curr = weather?.current;
    const todayRainChance = (curr?.precip_mm ?? 0) > 0 ? 100 : (forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? 0);
    if ((curr?.temp_c ?? 0) >= 35) alerts.push({ label: 'High Temperature', color: 'bg-red-500/20 text-red-300 border-red-500/30' });
    if ((curr?.humidity ?? 0) >= 80) alerts.push({ label: 'High Humidity', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' });
    if ((curr?.wind_kph ?? 0) >= 25) alerts.push({ label: 'Strong Wind', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' });
    if ((todayRainChance ?? 0) >= 60) alerts.push({ label: 'Rain Likely', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' });
    if ((curr?.uv ?? 0) >= 7) alerts.push({ label: 'High UV', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' });
    if ((curr?.temp_c ?? 100) <= 10) alerts.push({ label: 'Cold Conditions', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' });
  }

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-3">Weather Forecast</h1>
          <div className="flex items-center justify-center gap-2 text-lg mb-2">
            <span className="text-red-500 animate-pulse">Live</span>
            <span className="text-cyan-400 font-semibold">{location}</span>
          </div>
          <p className="text-gray-400">
            {weather?.location?.localtime &&
              new Date(weather.location.localtime).toLocaleString('en-US', {
                weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
              })}
          </p>
          <p className="text-green-400 text-sm mt-2">Live location tracking enabled</p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {alerts.map((a, idx) => (
              <span key={idx} className={`px-3 py-1 rounded-full border text-sm inline-flex items-center gap-1 ${a.color}`}>
                <AlertTriangle className="h-4 w-4" /> {a.label}
              </span>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/60 text-gray-400 hover:bg-slate-800 border border-cyan-500/20'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/60 text-gray-400 hover:bg-slate-800 border border-cyan-500/20'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'weekly'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/60 text-gray-400 hover:bg-slate-800 border border-cyan-500/20'
            }`}
          >
            7 Days
          </button>
        </div>

        {/* Today's Weather */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-2xl border border-cyan-500/20 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <img src={weather.current.condition.icon} alt="weather" className="w-24 h-24" />
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{weather.current.condition.text}</h2>
                    <p className="text-gray-400">Current conditions</p>
                  </div>
                </div>
                <div className="text-center mt-4 md:mt-0">
                  <h3 className="text-7xl font-bold text-cyan-400">{Math.round(weather.current.temp_c)}°</h3>
                  <p className="text-gray-400 mt-2">Feels like {Math.round(weather.current.feelslike_c)}°C</p>
                </div>
              </div>

              {/* Weather Condition Percentages */}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-cyan-500/10 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Weather Conditions</h3>
                <div className="space-y-4">
                  {/* Sunny */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-400" />
                        <span className="text-gray-300">Sunny</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">{weatherPercentages.sunny}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${weatherPercentages.sunny}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Cloudy */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300">Cloudy</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">{weatherPercentages.cloudy}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${weatherPercentages.cloudy}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Rainy */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-300">Rainy</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">{weatherPercentages.rainy}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${weatherPercentages.rainy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Humidity</p>
                  <p className="text-2xl font-bold text-white">{weather.current.humidity}%</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Wind className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Wind</p>
                  <p className="text-2xl font-bold text-white">{weather.current.wind_kph} km/h</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Eye className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Visibility</p>
                  <p className="text-2xl font-bold text-white">{weather.current.vis_km} km</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Gauge className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Pressure</p>
                  <p className="text-2xl font-bold text-white">{weather.current.pressure_mb} mb</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Sun className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">UV Index</p>
                  <p className="text-2xl font-bold text-white">{weather.current.uv}</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <CloudRain className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Precipitation</p>
                  <p className="text-2xl font-bold text-white">{weather.current.precip_mm} mm</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Cloud className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Cloud Cover</p>
                  <p className="text-2xl font-bold text-white">{weather.current.cloud}%</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl text-center border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                  <Thermometer className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Dew Point</p>
                  <p className="text-2xl font-bold text-white">{Math.round(weather.current.dewpoint_c)}°C</p>
                </div>
              </div>
            </div>

            {/* Farmer Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌾</span> Farmer Recommendations
                </h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-cyan-400 mt-1">&bull;</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Hourly Forecast */}
        {activeTab === 'hourly' && forecast && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">24-Hour Forecast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {forecast.forecastday[0].hour.filter((_: any, index: number) => index % 2 === 0).map((hour: HourlyForecast, index: number) => (
                <div
                  key={index}
                  className="bg-slate-800/60 p-4 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">{new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' })}</p>
                  <img src={hour.condition.icon} alt="weather" className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white mb-1">{Math.round(hour.temp_c)}°</p>
                  <div className="flex items-center justify-center gap-1 text-blue-400 text-sm">
                    <Droplets className="h-3 w-3" />
                    <span>{hour.chance_of_rain}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {activeTab === 'weekly' && forecast && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">7-Day Forecast</h2>
            <div className="space-y-3">
              {forecast.forecastday.map((day: DayForecast, index: number) => (
                <div
                  key={index}
                  className="bg-slate-800/60 p-5 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <p className="text-white font-semibold w-24">{getDayName(day.date)}</p>
                      <img src={day.day.condition.icon} alt="weather" className="w-12 h-12" />
                      <p className="text-gray-400 text-sm hidden md:block flex-1">{day.day.condition.text}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-blue-400">
                        <CloudRain className="h-4 w-4" />
                        <span className="text-sm font-semibold">{day.day.daily_chance_of_rain}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-lg">{Math.round(day.day.mintemp_c)}°</span>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"></div>
                        <span className="text-white text-lg font-semibold">{Math.round(day.day.maxtemp_c)}°</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
