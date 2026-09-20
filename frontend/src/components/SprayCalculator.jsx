import React, { useState } from 'react';
import { Calculator, ShieldAlert, Clock, Droplet, Layers, CheckCircle } from 'lucide-react';

export default function SprayCalculator({ activeDisease }) {
  const [acreage, setAcreage] = useState(2.5); // Acres
  const [growthStage, setGrowthStage] = useState('Vegetative'); // Vegetative, Flowering, Fruiting
  const [sprayType, setSprayType] = useState('Biopesticide'); // Biopesticide, Fungicide

  // Agronomic dosage calculations
  const dilutionRate = sprayType === 'Biopesticide' ? 3.5 : 2.0; // ml per Litre of water
  const waterRatePerAcre = growthStage === 'Vegetative' ? 120 : growthStage === 'Flowering' ? 160 : 200; // Litres/acre
  const totalWaterLitres = Math.round(acreage * waterRatePerAcre);
  const totalChemicalMl = Math.round(totalWaterLitres * dilutionRate);
  const totalChemicalL = (totalChemicalMl / 1000).toFixed(2);

  // Pre-Harvest Interval (PHI / WHP)
  const preHarvestDays = sprayType === 'Biopesticide' ? 3 : 7;

  return (
    <div className="field-panel rounded-xl p-5 border border-[#2a322c] flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2a322c]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-[#708238]/15 text-[#708238] border border-[#708238]/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Prescriptive Dosage & Spray Calculator</h3>
            <p className="text-xs text-slate-400 font-mono-spec">AGRONOMIC DOSAGE ENGINE • CALC-SPEC v2.1</p>
          </div>
        </div>

        {/* Pre-Harvest Interval (WHP/PHI) Compliance Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#241513] border border-[#c84b31] text-xs text-[#c84b31] font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>WHP / PHI: {preHarvestDays}-Day Safety Interval</span>
        </div>
      </div>

      {/* Inputs: Acreage, Spray Type, Growth Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Acreage Slider */}
        <div className="p-3.5 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Crop Field Area:</span>
            <span className="font-mono-spec font-bold text-[#4e8752]">{acreage} Acres</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="25.0"
            step="0.5"
            value={acreage}
            onChange={(e) => setAcreage(parseFloat(e.target.value))}
            className="accent-[#4e8752] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-spec">
            <span>0.5 Ac</span>
            <span>{(acreage * 0.404686).toFixed(1)} Hectares</span>
            <span>25 Ac</span>
          </div>
        </div>

        {/* Crop Growth Stage */}
        <div className="p-3.5 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col gap-2">
          <span className="text-xs text-slate-400 font-medium">Crop Growth Stage:</span>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {['Vegetative', 'Flowering', 'Fruiting'].map(stage => (
              <button
                key={stage}
                onClick={() => setGrowthStage(stage)}
                className={`py-1 rounded font-medium text-[11px] transition-all ${
                  growthStage === stage
                    ? 'bg-[#4e8752] text-slate-950 font-bold'
                    : 'bg-[#181c19] text-slate-400 hover:text-white border border-[#2a322c]'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Agent Type */}
        <div className="p-3.5 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col gap-2">
          <span className="text-xs text-slate-400 font-medium">Treatment Formula:</span>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {['Biopesticide', 'Fungicide'].map(type => (
              <button
                key={type}
                onClick={() => setSprayType(type)}
                className={`py-1 rounded font-medium text-[11px] transition-all ${
                  sprayType === type
                    ? 'bg-[#d4b106] text-slate-950 font-bold'
                    : 'bg-[#181c19] text-slate-400 hover:text-white border border-[#2a322c]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Dosage Output Strip */}
      <div className="p-4 rounded-lg bg-[#152219] border border-[#4e8752]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-md bg-[#4e8752]/20 border border-[#4e8752]/30 text-[#4e8752]">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono-spec tracking-wider">Required Mix Volume:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono-spec text-white">{totalWaterLitres} L</span>
              <span className="text-xs text-slate-400">Water Tank</span>
              <span className="text-slate-600">+</span>
              <span className="text-xl font-bold font-mono-spec text-[#d4b106]">{totalChemicalL} L</span>
              <span className="text-xs text-[#d4b106]">{sprayType} Concentrate</span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs font-mono-spec text-slate-400 border-t md:border-t-0 md:border-l border-[#2a322c] pt-2 md:pt-0 md:pl-4">
          <div>DILUTION: <span className="text-white font-bold">{dilutionRate} mL / L</span></div>
          <div>COVERAGE: <span className="text-white font-bold">{waterRatePerAcre} L/Acre</span></div>
        </div>

      </div>

    </div>
  );
}
