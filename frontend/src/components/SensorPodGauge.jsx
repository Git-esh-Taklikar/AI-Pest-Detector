import React from 'react';
import { Thermometer, Droplets, Waves, AlertTriangle, ShieldCheck, Flame, Stethoscope, Lightbulb, Sliders } from 'lucide-react';

export default function SensorPodGauge({ sensorData, riskInfo, onManualSensorChange }) {
  const temp = sensorData.temperature || 27.5;
  const humidity = sensorData.humidity || 72.0;
  const soil = sensorData.soil_moisture || 60.0;
  
  const score = riskInfo.risk_score || 45.0;
  const level = riskInfo.risk_level || "MODERATE";
  const diseaseName = riskInfo.disease_name || "Healthy Crop Microclimate";
  const symptoms = riskInfo.symptoms || "No visible plant disease predicted.";
  const farmerAction = riskInfo.farmer_action || "Maintain regular crop health inspection.";

  const getLevelBadge = (lvl) => {
    switch (lvl) {
      case 'LOW':
        return { bg: 'bg-[#17201a] border-[#4a634e] text-[#8a9f65]', label: 'LOW THREAT', icon: ShieldCheck };
      case 'MODERATE':
        return { bg: 'bg-[#211d17] border-[#c99e32] text-[#d4b106]', label: 'MODERATE RISK', icon: AlertTriangle };
      case 'HIGH':
        return { bg: 'bg-[#211917] border-[#b85438] text-[#e06d50]', label: 'HIGH DISEASE THREAT', icon: Flame };
      case 'CRITICAL':
        return { bg: 'bg-[#211917] border-[#b85438] text-[#e06d50]', label: 'CRITICAL THREAT', icon: AlertTriangle };
      default:
        return { bg: 'bg-[#141715] text-slate-300', label: 'MONITORING', icon: ShieldCheck };
    }
  };

  const badgeConfig = getLevelBadge(level);
  const StatusIcon = badgeConfig.icon;

  return (
    <div className="agri-card rounded-lg p-5 border border-[#29312b] flex flex-col gap-4">
      
      {/* Sensor Pod Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29312b]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded bg-[#6e814c]/15 text-[#6e814c] border border-[#6e814c]/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e8e4d9] font-serif-botanical tracking-tight">Crop Health & Microclimate Diagnostic</h2>
            <p className="text-xs text-slate-400 font-mono-spec">FIELD SENSOR TELEMETRY • RISK ENGINE v2.0</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-[#141715] border border-[#29312b] text-xs text-[#8a9f65] font-mono-spec font-bold">
          LINK: ACTIVE
        </div>
      </div>

      {/* Prominent Crop Disease Diagnosis Banner */}
      <div className="p-4 rounded bg-[#141715] border border-[#29312b] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#c99e32] font-mono-spec font-bold text-xs uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>Pathology Diagnosis:</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-xs font-mono-spec font-bold border flex items-center gap-1 ${badgeConfig.bg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {badgeConfig.label}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#e8e4d9] font-serif-botanical">{diseaseName}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 pt-2 border-t border-[#29312b] text-xs">
          <div className="flex items-start gap-1.5 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-[#c99e32] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#c99e32]">Observed Symptoms:</span>
              <p className="text-slate-400">{symptoms}</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-slate-300">
            <Lightbulb className="w-4 h-4 text-[#8a9f65] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#8a9f65]">Agronomic Action Advice:</span>
              <p className="text-slate-400">{farmerAction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Readouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Temperature */}
        <div className="p-3.5 rounded bg-[#141715] border border-[#29312b] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between font-mono-spec">
            <span className="text-xs text-slate-400 uppercase">Air Temp</span>
            <Thermometer className="w-4 h-4 text-[#c99e32]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono-spec text-[#e8e4d9]">{temp}</span>
            <span className="text-xs font-semibold text-[#c99e32]">°C</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-spec">Target Range: 22 - 30°C</span>
        </div>

        {/* Humidity */}
        <div className="p-3.5 rounded bg-[#141715] border border-[#29312b] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between font-mono-spec">
            <span className="text-xs text-slate-400 uppercase">Air Humidity</span>
            <Droplets className="w-4 h-4 text-[#6e814c]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono-spec text-[#e8e4d9]">{humidity}</span>
            <span className="text-xs font-semibold text-[#8a9f65]">%</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-spec">High Risk Threshold: &gt; 70%</span>
        </div>

        {/* Soil Moisture */}
        <div className="p-3.5 rounded bg-[#141715] border border-[#29312b] flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between font-mono-spec">
            <span className="text-xs text-slate-400 uppercase">Soil Moisture</span>
            <Waves className="w-4 h-4 text-[#4a634e]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold font-mono-spec text-[#e8e4d9]">{soil}</span>
            <span className="text-xs font-semibold text-[#8a9f65]">%</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-spec">Ideal Range: 50 - 70%</span>
        </div>

      </div>

      {/* Manual Weather Sliders */}
      <div className="p-3 rounded bg-[#141715] border border-[#29312b] text-xs font-mono-spec flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
          <Sliders className="w-3.5 h-3.5 text-[#6e814c]" />
          <span>Simulate Telemetry Parameters:</span>
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
              className="w-20 accent-[#c99e32] cursor-pointer"
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
              className="w-20 accent-[#6e814c] cursor-pointer"
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
              className="w-20 accent-[#4a634e] cursor-pointer"
            />
          </label>
        </div>
      </div>

    </div>
  );
}
