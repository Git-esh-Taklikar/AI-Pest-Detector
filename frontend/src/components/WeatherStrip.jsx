import React from 'react';
import { Wind, Thermometer, Droplets, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function WeatherStrip({ temp = 27.5, humidity = 72.0, windSpeed = 8.5 }) {
  // Determine if weather conditions are safe for pesticide spraying
  // Ideal spray conditions: Temp < 28°C, Wind 3-15 km/h, Humidity 40-70%
  const isWindSafe = windSpeed >= 3.0 && windSpeed <= 15.0;
  const isTempSafe = temp <= 30.0;
  const isSafeForSpraying = isWindSafe && isTempSafe;

  return (
    <div className="field-panel rounded-xl px-5 py-3 border border-[#2a322c] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-spec">
      
      {/* Weather Metrics */}
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#d97706]" />
          <span className="text-slate-400">TEMP:</span>
          <span className="font-bold text-white">{temp}°C</span>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">HUMIDITY:</span>
          <span className="font-bold text-white">{humidity}%</span>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-[#708238]" />
          <span className="text-slate-400">WIND DRIFT:</span>
          <span className="font-bold text-white">{windSpeed} km/h</span>
        </div>

      </div>

      {/* Spray Compliance Safety Status */}
      <div className={`px-3 py-1.5 rounded-md border flex items-center gap-2 font-bold ${
        isSafeForSpraying
          ? 'bg-[#152219] border-[#4e8752] text-[#4e8752]'
          : 'bg-[#241513] border-[#c84b31] text-[#c84b31]'
      }`}>
        {isSafeForSpraying ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        <span>
          SPRAY CONDITION: {isSafeForSpraying ? 'OPTIMAL / SAFE FOR SPRAYING' : 'HIGH DRIFT / SPREAD RISK'}
        </span>
      </div>

    </div>
  );
}
