import React from 'react';
import { Wind, Thermometer, Droplets, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function WeatherStrip({ temp = 27.5, humidity = 72.0, windSpeed = 8.5 }) {
  const isWindSafe = windSpeed >= 3.0 && windSpeed <= 15.0;
  const isTempSafe = temp <= 30.0;
  const isSafeForSpraying = isWindSafe && isTempSafe;

  return (
    <div className="agri-card px-5 py-3 border border-[#29312b] flex flex-wrap items-center justify-between gap-4 text-xs font-mono-spec">
      
      {/* Field Weather Readout */}
      <div className="flex flex-wrap items-center gap-6">
        
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#c99e32]" />
          <span className="text-slate-400">FIELD TEMP:</span>
          <span className="font-bold text-[#e8e4d9]">{temp}°C</span>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#6e814c]" />
          <span className="text-slate-400">AIR HUMIDITY:</span>
          <span className="font-bold text-[#e8e4d9]">{humidity}%</span>
        </div>

        {/* Wind Speed */}
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">WIND DRIFT:</span>
          <span className="font-bold text-[#e8e4d9]">{windSpeed} km/h</span>
        </div>

      </div>

      {/* Spray Compliance Safety Status */}
      <div className={`px-3 py-1.5 rounded border flex items-center gap-2 font-bold ${
        isSafeForSpraying
          ? 'bg-[#17201a] border-[#4a634e] text-[#8a9f65]'
          : 'bg-[#211917] border-[#b85438] text-[#e06d50]'
      }`}>
        {isSafeForSpraying ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        <span>
          SPRAY CONDITION: {isSafeForSpraying ? 'OPTIMAL / SAFE FOR APPLICATION' : 'HIGH WIND DRIFT RISK'}
        </span>
      </div>

    </div>
  );
}
