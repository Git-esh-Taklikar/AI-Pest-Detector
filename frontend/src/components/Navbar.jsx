import React from 'react';
import { ShieldCheck, Video, Radio, Zap, Activity } from 'lucide-react';

export default function Navbar({ backendOnline, mqttConnected, yoloLoaded, deterrentActive, onEmergencyStop }) {
  return (
    <header className="bg-[#1a1e1b] border-b border-[#29312b] sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Station Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded bg-[#6e814c] text-[#141715] font-bold">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-serif-botanical text-[#e8e4d9] tracking-tight">
                AGRI-SPEC
              </h1>
              <span className="text-[10px] font-mono-spec font-semibold tracking-wider px-2 py-0.5 rounded bg-[#6e814c]/20 text-[#8a9f65] border border-[#6e814c]/40">
                FIELD STATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-spec">Agronomic Crop Diagnostic Station & Defense Console</p>
          </div>
        </div>

        {/* Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-spec">
          
          {/* Camera Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#141715] border border-[#29312b]">
            <Video className="w-3.5 h-3.5 text-[#6e814c]" />
            <span className="text-slate-400">OPTIC SENSOR:</span>
            <span className="font-bold text-[#8a9f65]">
              {yoloLoaded ? 'ONLINE' : 'INITIALIZING'}
            </span>
          </div>

          {/* Telemetry Link Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#141715] border border-[#29312b]">
            <Radio className="w-3.5 h-3.5 text-[#6e814c]" />
            <span className="text-slate-400">FIELD LINK:</span>
            <span className="font-bold text-[#8a9f65]">
              {mqttConnected ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>

          {/* Active Deterrent Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
            deterrentActive 
              ? 'bg-[#211917] border-[#b85438] text-[#e06d50]' 
              : 'bg-[#17201a] border-[#4a634e] text-[#8a9f65]'
          }`}>
            <Zap className="w-3.5 h-3.5" />
            <span className="font-bold">
              PEST DEFENSE: {deterrentActive ? 'ACTIVE REPELLING' : 'STANDBY'}
            </span>
          </div>

          {/* Emergency Disarm Button */}
          {deterrentActive && (
            <button
              onClick={onEmergencyStop}
              className="px-3 py-1.5 rounded bg-[#b85438] hover:bg-[#9e432a] text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              STOP DEFENSE
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
