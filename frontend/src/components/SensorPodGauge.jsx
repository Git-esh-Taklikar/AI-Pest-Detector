import React from 'react';
import { Thermometer, Droplets, Waves, AlertTriangle, ShieldCheck, Flame, Stethoscope, Lightbulb, Sliders } from 'lucide-react';

export default function SensorPodGauge({ sensorData, riskInfo, onManualSensorChange }) {
  const temp = sensorData.temperature || 26.5;
  const humidity = sensorData.humidity || 68.0;
  const soil = sensorData.soil_moisture || 60.0;
  
  const score = riskInfo.risk_score || 45.0;
  const level = riskInfo.risk_level || "MODERATE";
  const diseaseName = riskInfo.disease_name || "Healthy Crop Microclimate";
  const symptoms = riskInfo.symptoms || "No visible plant disease predicted.";
  const farmerAction = riskInfo.farmer_action || "Maintain regular crop health inspection.";

  const getLevelBadge = (lvl) => {
    switch (lvl) {
      case 'LOW':
        return { bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', label: 'SAFE / LOW THREAT', icon: ShieldCheck };
      case 'MODERATE':
        return { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', label: 'MODERATE RISK', icon: AlertTriangle };
      case 'HIGH':
        return { bg: 'bg-orange-500/20 border-orange-500/50 text-orange-400', label: 'HIGH DISEASE THREAT', icon: Flame };
      case 'CRITICAL':
        return { bg: 'bg-rose-500/20 border-rose-500/60 text-rose-400 animate-pulse', label: 'DANGER / CRITICAL', icon: AlertTriangle };
      default:
        return { bg: 'bg-slate-800 text-slate-300', label: 'MONITORING', icon: ShieldCheck };
    }
  };

  const badgeConfig = getLevelBadge(level);
  const StatusIcon = badgeConfig.icon;

  return (
    <div className="bg-[#080808] rounded-2xl p-5 border border-[#1a1a1a] flex flex-col gap-5">
      
      {/* Sensor Pod Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Crop Health & Disease Monitor</h2>
            <p className="text-xs text-slate-400">Field Climate & Microclimate Disease Risk Assessment</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-[#111] border border-[#222] text-xs text-emerald-400 font-bold">
          Field Sensors: ONLINE 🟢
        </div>
      </div>

      {/* Prominent Crop Disease Diagnosis Banner */}
      <div className="p-4 rounded-xl bg-[#0f0a0a] border border-amber-500/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>Predicted Disease Diagnosis:</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${badgeConfig.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {badgeConfig.label}
          </span>
        </div>

        {/* Disease Name Title */}
        <h3 className="text-lg font-extrabold text-white">{diseaseName}</h3>
        
        {/* Symptoms & Action Advice for Farmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 pt-2 border-t border-[#222] text-xs">
          <div className="flex items-start gap-1.5 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-400">Symptoms to Watch For:</span>
              <p className="text-slate-400">{symptoms}</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-slate-300">
            <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-400">Farmer Action Recommended:</span>
              <p className="text-slate-400">{farmerAction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Field Weather Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Temperature Card */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Air Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-heading text-white">{temp}</span>
            <span className="text-sm font-semibold text-amber-400">°C</span>
          </div>
          <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (temp / 45) * 100)}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-400">Ideal Crop Temp: 22 - 30°C</span>
        </div>

        {/* Humidity Card */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Air Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-heading text-white">{humidity}</span>
            <span className="text-sm font-semibold text-cyan-400">%</span>
          </div>
          <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${humidity}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-400">High Disease Risk: &gt; 70%</span>
        </div>

        {/* Soil Moisture Card */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soil Moisture</span>
            <Waves className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold font-heading text-white">{soil}</span>
            <span className="text-sm font-semibold text-emerald-400">%</span>
          </div>
          <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${soil}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-400">Ideal Moisture: 50 - 70%</span>
        </div>

      </div>

      {/* Interactive Weather Test Sliders for Farmer */}
      <div className="p-3 rounded-xl bg-[#050505] border border-[#1a1a1a] text-xs flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulate Weather & Disease Risk:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 text-slate-300">
            Temp:
            <input
              type="range"
              min="15"
              max="42"
              value={temp}
              onChange={(e) => onManualSensorChange('temperature', parseFloat(e.target.value))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-1.5 text-slate-300">
            Humidity:
            <input
              type="range"
              min="30"
              max="95"
              value={humidity}
              onChange={(e) => onManualSensorChange('humidity', parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-1.5 text-slate-300">
            Soil:
            <input
              type="range"
              min="10"
              max="90"
              value={soil}
              onChange={(e) => onManualSensorChange('soil_moisture', parseFloat(e.target.value))}
              className="w-20 accent-emerald-400 cursor-pointer"
            />
          </label>
        </div>
      </div>

    </div>
  );
}
