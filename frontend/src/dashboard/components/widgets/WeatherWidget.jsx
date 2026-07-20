import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, CloudRain, Sun, Wind, Droplets, ArrowRight } from 'lucide-react';

export const WeatherWidget = ({ weather = {} }) => {
  const current = weather.current || {
    temp: '--',
    description: 'Fetching forecast...',
    humidity: '--',
    windSpeed: '--',
    rainChance: '--',
    uvIndex: '--',
    icon: 'cloudy'
  };

  const getWeatherIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-12 h-12 text-amber-400 animate-spin-slow" />;
      case 'rainy':
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-12 h-12 text-sky-400 animate-bounce" />;
      default:
        return <CloudSun className="w-12 h-12 text-primary" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-premium space-y-4 relative overflow-hidden">
      {/* Decorative sun glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Live Farm Weather</span>
          <h4 className="font-extrabold text-sm text-text mt-0.5">{weather.location || 'Ludhiana, India'}</h4>
          <span className="block text-2xl font-black text-text mt-3 font-display">
            {current.temp}°C
          </span>
          <span className="block text-xs font-semibold text-text/60 mt-0.5 capitalize">
            {current.description}
          </span>
        </div>
        <div className="shrink-0 pt-2">
          {getWeatherIcon(current.icon)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center pt-2">
        <div className="p-2 bg-surface/50 border border-border/40 rounded-xl">
          <Droplets className="w-4 h-4 text-primary mx-auto mb-1.5" />
          <span className="block text-[8px] font-bold text-text/40 uppercase tracking-wider">Humidity</span>
          <span className="block text-xs font-bold text-text mt-0.5">{current.humidity}%</span>
        </div>
        <div className="p-2 bg-surface/50 border border-border/40 rounded-xl">
          <Wind className="w-4 h-4 text-accent mx-auto mb-1.5" />
          <span className="block text-[8px] font-bold text-text/40 uppercase tracking-wider">Wind</span>
          <span className="block text-xs font-bold text-text mt-0.5">{current.windSpeed} km/h</span>
        </div>
        <div className="p-2 bg-surface/50 border border-border/40 rounded-xl">
          <CloudRain className="w-4 h-4 text-sky-400 mx-auto mb-1.5" />
          <span className="block text-[8px] font-bold text-text/40 uppercase tracking-wider">Rain %</span>
          <span className="block text-xs font-bold text-text mt-0.5">{current.rainChance}%</span>
        </div>
      </div>

      <Link
        to="/farmer/weather"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-surface hover:bg-border text-xs font-semibold text-text border border-border rounded-xl transition-all group"
      >
        <span>7-Day Full Forecast</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default WeatherWidget;
