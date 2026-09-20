import React from 'react';
import { ShieldAlert, Video, Radio, Zap, Activity } from 'lucide-react';

export default function Navbar({ backendOnline, mqttConnected, yoloLoaded, deterrentActive, onEmergencyStop }) {
  return (
    <header className="bg-[#121513] border-b border-[#2a322c] sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-[#4e8752] text-slate-950 shadow-md">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#708238] animate-ping"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif-botanical text-slate-100 tracking-tight">
                AGRI-SPEC
              </h1>
              <span className="text-[10px] font-mono-spec font-bold tracking-wider px-2 py-0.5 rounded bg-[#4e8752]/20 text-[#4e8752] border border-[#4e8752]/30">
                FIELD STATION v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-spec">Agronomic Diagnostic Tool & Prescriptive Defense Station</p>
          </div>
        </div>

        {/* Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono-spec">
          
          {/* Camera Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#181c19] border border-[#2a322c]">
            <Video className="w-4 h-4 text-[#4e8752]" />
            <span className="text-slate-400">OPTIC MATRIX:</span>
            <span className="font-bold text-[#4e8752]">
              {yoloLoaded ? 'ONLINE' : 'CONNECTING...'}
            </span>
          </div>

          {/* Sensor Pod Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#181c19] border border-[#2a322c]">
            <Radio className={`w-4 h-4 ${mqttConnected ? 'text-[#4e8752] animate-pulse' : 'text-[#c84b31]'}`} />
            <span className="text-slate-400">TELEMETRY LINK:</span>
            <span className={`font-bold ${mqttConnected ? 'text-[#4e8752]' : 'text-[#c84b31]'}`}>
              {mqttConnected ? 'ACTIVE' : 'CONNECTING...'}
            </span>
          </div>

          {/* Active Deterrent Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
            deterrentActive 
              ? 'bg-[#241513] border-[#c84b31] text-[#c84b31] animate-pulse' 
              : 'bg-[#152219] border-[#4e8752] text-[#4e8752]'
          }`}>
            <Zap className={`w-4 h-4 ${deterrentActive ? 'text-[#c84b31]' : 'text-[#4e8752]'}`} />
            <span className="font-bold">
              PREVENTATIVE REPELLER: {deterrentActive ? 'EMITTING' : 'STANDBY'}
            </span>
          </div>

          {/* Disarm Button */}
          {deterrentActive && (
            <button
              onClick={onEmergencyStop}
              className="px-3 py-1.5 rounded bg-[#c84b31] hover:bg-[#a33b25] text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              DISARM REPELLER
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
