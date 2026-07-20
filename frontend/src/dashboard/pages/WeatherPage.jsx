import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Sunset,
  Sunrise,
  Compass,
  AlertTriangle,
  Lightbulb,
  Compass as UvIcon
} from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { dashboardService } from '../services/dashboardService';

export const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const profileRes = await dashboardService.getDashboard();
      const location = profileRes.success ? profileRes.data.profile.location : 'Ludhiana, India';
      
      const res = await weatherService.getWeather(location);
      if (res.success) {
        setWeather(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve weather forecast metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getForecastIcon = (cond) => {
    const name = cond?.toLowerCase();
    if (name?.includes('sunny') || name?.includes('clear')) {
      return <Sun className="w-8 h-8 text-amber-400" />;
    }
    if (name?.includes('rain') || name?.includes('drizzle')) {
      return <CloudRain className="w-8 h-8 text-sky-400" />;
    }
    return <CloudSun className="w-8 h-8 text-primary" />;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-1/4 bg-card rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-card rounded-2xl" />
          <div className="h-64 bg-card rounded-2xl" />
        </div>
        <div className="h-40 bg-card rounded-2xl" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
        {error || 'Failed to fetch weather logs.'}
      </div>
    );
  }

  const current = weather.current;
  const forecast = weather.forecast || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Weather Diagnostics Board</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Hyperlocal farming indices. Check sun parameters, humidity cycles, and storm forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-premium relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {weather.source}
              </span>
              <h2 className="text-2xl font-black text-white mt-3 font-display">{weather.location}</h2>
              <span className="block text-4.5xl font-black text-text mt-3 font-display">
                {current.temp}°C
              </span>
              <span className="text-sm font-bold text-text/60 block capitalize mt-0.5">
                {current.description}
              </span>
            </div>
            <div className="p-4 bg-surface/80 border border-border/40 rounded-2xl shadow-inner">
              {getForecastIcon(current.icon)}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 border-t border-border/40 pt-6">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-primary" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Humidity</span>
                <span className="block text-sm font-bold text-text mt-0.5">{current.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-accent" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Wind speed</span>
                <span className="block text-sm font-bold text-text mt-0.5">{current.windSpeed} km/h</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-sky-400" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Rain Chance</span>
                <span className="block text-sm font-bold text-text mt-0.5">{current.rainChance}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-amber-400" />
              <div>
                <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">UV Index</span>
                <span className="block text-sm font-bold text-text mt-0.5">{current.uvIndex} (High)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset Widget */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-premium flex flex-col justify-between">
          <h3 className="font-bold text-sm text-text">Sun Cycle Parameters</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex items-center justify-between p-3.5 bg-surface/50 border border-border/40 rounded-xl">
              <div className="flex items-center gap-3">
                <Sunrise className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-text/70">Sunrise Time</span>
              </div>
              <span className="text-sm font-mono font-bold text-text">{current.sunrise}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface/50 border border-border/40 rounded-xl">
              <div className="flex items-center gap-3">
                <Sunset className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-xs font-bold text-text/70">Sunset Time</span>
              </div>
              <span className="text-sm font-mono font-bold text-text">{current.sunset}</span>
            </div>
          </div>

          <p className="text-[10px] text-text/40 leading-relaxed font-semibold">
            * Day duration matches ideal sowing hours for summer crops.
          </p>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-text/50 uppercase tracking-wider">7-Day Sowing Forecast</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className="bg-card border border-border hover:border-primary/20 rounded-2xl p-4 text-center space-y-3.5 shadow-premium flex flex-col justify-between"
            >
              <div>
                <span className="block text-xs font-black text-text">{day.day}</span>
                <span className="block text-[9px] text-text/40 mt-0.5">{day.description}</span>
              </div>
              
              <div className="flex justify-center items-center py-1">
                {getForecastIcon(day.condition)}
              </div>

              <div className="space-y-1">
                <span className="block text-sm font-extrabold text-text font-display">{day.temp}°C</span>
                <span className="block text-[9px] text-sky-400 font-bold">🌧 {day.rainChance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agronomist Advisories */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-premium">
        <h4 className="font-bold text-sm text-text flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" /> Agronomic Directives
        </h4>
        <ul className="mt-4 space-y-3 text-xs font-semibold text-text/80">
          <li className="flex items-start gap-2.5">
            <span className="text-primary mt-0.5">✓</span>
            <span>With precipitation indices hitting {current.rainChance}%, defer chemical fertilizer sprays on Paddy crops by 48 hours to avoid wash-offs.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-primary mt-0.5">✓</span>
            <span>Optimal temperature thresholds (around {current.temp}°C) are excellent for standard weed removal operations.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherPage;
