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
    <div className={`rounded-lg p-5 border transition-all duration-200 ${
      deterrentActive 
        ? 'bg-[#211917] border-[#b85438]' 
        : 'bg-[#1a1e1b] border-[#29312b]'
    }`}>
      
      {/* Component Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#29312b]">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded border ${
            deterrentActive ? 'bg-[#b85438]/20 text-[#e06d50] border-[#b85438]' : 'bg-[#6e814c]/15 text-[#6e814c] border-[#6e814c]/30'
          }`}>
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e8e4d9] font-serif-botanical tracking-tight">Active Preventative Emitter Unit</h2>
            <p className="text-xs text-slate-400 font-mono-spec">CHEMICAL-FREE PEST REPELLER • ACOUSTIC WAVES & STROBE LIGHT</p>
          </div>
        </div>

        {/* Auto Defense Switch */}
        <button
          onClick={() => setAutoEnabled(!autoEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono-spec font-semibold transition-all ${
            autoEnabled 
              ? 'bg-[#17201a] border-[#4a634e] text-[#8a9f65]' 
              : 'bg-[#141715] border-[#29312b] text-slate-400'
          }`}
        >
          {autoEnabled ? <ToggleRight className="w-4 h-4 text-[#8a9f65]" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
          <span>AUTOMATIC REPELLER: {autoEnabled ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-mono-spec text-xs">
        
        {/* Sound Emitter Control */}
        <div className="p-4 rounded bg-[#141715] border border-[#29312b] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <Volume2 className="w-4 h-4 text-[#8a9f65]" />
              <span>High-Frequency Sound Emitter</span>
            </div>
            <span className="font-bold text-[#8a9f65]">{frequencyKhz} kHz</span>
          </div>
          <input
            type="range"
            min="18.0"
            max="40.0"
            step="0.5"
            value={frequencyKhz}
            onChange={(e) => setFrequencyKhz(parseFloat(e.target.value))}
            className="w-full accent-[#6e814c] cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Emits targeted acoustic frequencies to distress insect acoustic receptors.</span>
        </div>

        {/* Flashing Light Strobe Control */}
        <div className="p-4 rounded bg-[#141715] border border-[#29312b] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-[#c99e32]" />
              <span>Strobe Light Flash Speed</span>
            </div>
            <span className="font-bold text-[#c99e32]">{strobeHz} Hz</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="25.0"
            step="1.0"
            value={strobeHz}
            onChange={(e) => setStrobeHz(parseFloat(e.target.value))}
            className="w-full accent-[#c99e32] cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Pulsating light beam disrupts nocturnal foliage pests.</span>
        </div>

      </div>

      {/* Manual Defense Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded bg-[#141715] border border-[#29312b] font-mono-spec text-xs">
        <div className="text-slate-400">
          <span className="font-semibold text-slate-200">Emitter Status:</span>{' '}
          {deterrentActive ? (
            <span className="text-[#e06d50] font-bold">ACTIVE EMITTING (SOUND & LIGHT REPELLER ON)</span>
          ) : (
            <span>Ready for manual deployment or automated AI trigger.</span>
          )}
        </div>

        <button
          onClick={handleManualToggle}
          className={`w-full sm:w-auto px-5 py-2 rounded font-bold transition-all flex items-center justify-center gap-2 ${
            deterrentActive 
              ? 'bg-[#b85438] hover:bg-[#9e432a] text-white' 
              : 'bg-[#6e814c] hover:bg-[#8a9f65] text-[#141715]'
          }`}
        >
          <Activity className="w-4 h-4" />
          {deterrentActive ? 'DISARM REPELLER' : 'ACTIVATE PEST DEFENSE NOW'}
        </button>
      </div>

    </div>
  );
}
