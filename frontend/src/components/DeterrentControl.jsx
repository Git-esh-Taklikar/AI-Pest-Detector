import React from 'react';
import { Zap, Volume2, Sparkles, ToggleLeft, ToggleRight, Activity } from 'lucide-react';

export default function DeterrentControl({
  deterrentActive,
  autoEnabled,
  setAutoEnabled,
  frequencyKhz,
  setFrequencyKhz,
  strobeHz,
  setStrobeHz,
  onTriggerDeterrent
}) {

  const handleManualToggle = () => {
    onTriggerDeterrent(!deterrentActive, frequencyKhz, strobeHz, "FARMER_OVERRIDE");
  };

  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 ${
      deterrentActive 
        ? 'bg-[#140505] border-rose-600 shadow-lg shadow-rose-950/50' 
        : 'bg-[#080808] border-[#1a1a1a]'
    }`}>
      
      {/* Component Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border transition-all ${
            deterrentActive ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Crop Defense Unit</h2>
            <p className="text-xs text-slate-400">Chemical-Free Pest Repeller (High-Frequency Sound & Bright Flashing Light)</p>
          </div>
        </div>

        {/* Auto Defense Switch */}
        <button
          onClick={() => setAutoEnabled(!autoEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            autoEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-[#111] border-[#222] text-slate-400'
          }`}
        >
          {autoEnabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
          <span>Automatic Defense: {autoEnabled ? 'ON 🟢' : 'OFF ⚪'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        
        {/* Sound Repeller Control */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>High-Frequency Sound Emitter</span>
            </div>
            <span className="text-xs font-bold text-cyan-400">Pest Distress Level</span>
          </div>
          <input
            type="range"
            min="18.0"
            max="40.0"
            step="0.5"
            value={frequencyKhz}
            onChange={(e) => setFrequencyKhz(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">Emits acoustic waves that drive away crop-damaging insects.</span>
        </div>

        {/* Flashing Light Deterrent Control */}
        <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Flashing Light Strobe</span>
            </div>
            <span className="text-xs font-bold text-amber-400">Flash Speed</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="25.0"
            step="1.0"
            value={strobeHz}
            onChange={(e) => setStrobeHz(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <span className="text-[11px] text-slate-400">Flashes bright light pulses to deter night-active crop pests.</span>
        </div>

      </div>

      {/* Manual Defense Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#050505] border border-[#1c1c1c]">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Defense System Status:</span>{' '}
          {deterrentActive ? (
            <span className="text-rose-400 font-bold">REPELLING PESTS (SOUND & LIGHT ACTIVE)</span>
          ) : (
            <span>Ready to activate on demand or automatically.</span>
          )}
        </div>

        <button
          onClick={handleManualToggle}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
            deterrentActive 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 animate-pulse' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
          }`}
        >
          <Activity className="w-4 h-4" />
          {deterrentActive ? 'TURN OFF PEST DEFENSE' : 'RUN PEST DEFENSE NOW ⚡'}
        </button>
      </div>

    </div>
  );
}
