import React, { useState } from 'react';
import { BookOpen, ZoomIn, ArrowRight, Share2, AlertCircle, FileText, Check } from 'lucide-react';

export default function BotanicalLedger({ detectionMeta }) {
  const [activeTab, setActiveTab] = useState('taxonomy'); // 'taxonomy', 'vector', 'loupe'
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });

  // Sample botanical specimens database
  const SPECIMEN = {
    common_name: "Potato & Tomato Late Blight / Aphid Vector",
    taxonomic_name: "Phytophthora infestans / Aphis gossypii",
    family: "Peronosporaceae / Aphididae",
    pathology_stage: "ADVANCED LESION SPORULATION",
    vector_pathway: "Airborne sporangia & sap-sucking insect vectors",
    confidence_breakdown: [
      { name: "Late Blight (P. infestans)", prob: 84.2, color: "#c84b31" },
      { name: "Septoria Leaf Spot", prob: 11.5, color: "#d97706" },
      { name: "Nutrient Nitrogen Deficiency", prob: 4.3, color: "#708238" }
    ],
    disease_cycle: [
      { step: "01", title: "Spore Germination", desc: "Zoospore encystment on wet leaf cuticle (< 2h free moisture)" },
      { step: "02", title: "Leaf Penetration", desc: "Appressorium formation and direct stomatal hyphal penetration" },
      { step: "03", title: "Lesion Expansion", desc: "Necrotic cell collapse creating dark water-soaked leaf margins" },
      { step: "04", title: "Secondary Sporulation", desc: "White sporangiophores emerge under high humidity (> 80% RH)" }
    ]
  };

  return (
    <div className="field-panel rounded-xl p-5 border border-[#2a322c] flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2a322c]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-[#4e8752]/15 text-[#4e8752] border border-[#4e8752]/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-serif-botanical tracking-tight">Botanical Ledger & Pathology Specimen Index</h3>
            <p className="text-xs text-slate-400 font-mono-spec">TAXONOMIC REPOSITORY • HERBARIUM REF #8492-AG</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#121513] rounded-lg border border-[#2a322c] text-xs">
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`px-3 py-1 rounded font-mono-spec transition-all ${
              activeTab === 'taxonomy' ? 'bg-[#4e8752] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Index Card
          </button>
          <button
            onClick={() => setActiveTab('vector')}
            className={`px-3 py-1 rounded font-mono-spec transition-all ${
              activeTab === 'vector' ? 'bg-[#4e8752] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vector Cycle
          </button>
          <button
            onClick={() => setActiveTab('loupe')}
            className={`px-3 py-1 rounded font-mono-spec transition-all ${
              activeTab === 'loupe' ? 'bg-[#4e8752] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Micro-Loupe
          </button>
        </div>
      </div>

      {/* Tab 1: Botanical Index Card & Probability Breakdown */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Botanical Reference Card */}
          <div className="p-4 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-spec uppercase tracking-wider text-[#708238]">TAXONOMY RECORD</span>
              <span className="text-[10px] font-mono-spec px-2 py-0.5 rounded bg-[#241513] border border-[#c84b31] text-[#c84b31]">
                STAGE: {SPECIMEN.pathology_stage}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-serif-botanical">{SPECIMEN.common_name}</h4>
              <p className="text-sm font-serif-botanical italic text-[#4e8752]">{SPECIMEN.taxonomic_name}</p>
              <p className="text-xs text-slate-500 font-mono-spec mt-0.5">Family: {SPECIMEN.family}</p>
            </div>

            <div className="text-xs text-slate-300 pt-2 border-t border-[#2a322c]">
              <span className="font-semibold text-slate-400">Primary Transmission Vector:</span>
              <p className="text-slate-400 mt-0.5">{SPECIMEN.vector_pathway}</p>
            </div>
          </div>

          {/* Probability Distribution Bar & Fallback Option */}
          <div className="p-4 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-spec text-slate-400">Pathology Probability Distribution:</span>
              <span className="text-xs font-mono-spec text-[#4e8752]">CONF: 94.2%</span>
            </div>

            <div className="flex flex-col gap-2">
              {SPECIMEN.confidence_breakdown.map((item) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono-spec">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.prob}%</span>
                  </div>
                  <div className="w-full bg-[#181c19] h-1.5 rounded-full overflow-hidden border border-[#2a322c]">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.prob}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fallback Option */}
            <div className="p-2.5 rounded bg-[#181c19] border border-[#2a322c] flex items-center justify-between text-xs">
              <span className="text-slate-400">Unsure of diagnosis?</span>
              <button
                onClick={() => alert("Specimen packet dispatched to Agronomic Extension Officer.")}
                className="px-2.5 py-1 rounded bg-[#708238]/20 border border-[#708238]/40 text-[#708238] font-mono-spec hover:bg-[#708238] hover:text-black transition-all flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                Forward to Extension Officer
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Vector Path Cycle Diagram */}
      {activeTab === 'vector' && (
        <div className="p-4 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col gap-3">
          <span className="text-xs font-mono-spec text-[#708238] uppercase">DISEASE CYCLE VECTOR DIAGRAM</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SPECIMEN.disease_cycle.map((phase) => (
              <div key={phase.step} className="p-3 rounded bg-[#181c19] border border-[#2a322c] flex flex-col gap-2 relative">
                <span className="text-xs font-mono-spec text-[#4e8752] font-bold">{phase.step}.</span>
                <h5 className="text-sm font-bold text-white font-serif-botanical">{phase.title}</h5>
                <p className="text-xs text-slate-400">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Micro-Loupe Loupe Inspection */}
      {activeTab === 'loupe' && (
        <div className="p-4 rounded-lg bg-[#121513] border border-[#2a322c] flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-full md:w-1/2 aspect-video bg-[#000] rounded overflow-hidden border border-[#2a322c]">
            <img 
              src="https://images.unsplash.com/photo-1599598425947-0206579698d3?auto=format&fit=crop&w=600&q=80" 
              alt="Macro Leaf View" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono-spec text-slate-300">
              MACRO FIELD VIEW (1X)
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-2 text-xs">
            <span className="text-xs font-mono-spec text-[#d4b106] uppercase flex items-center gap-1">
              <ZoomIn className="w-4 h-4" /> CELLULAR TEXTURE MAGNIFICATION (40X)
            </span>
            <p className="text-slate-300">
              Microscopic inspection reveals intercellular hyphal branching and collapsed mesophyll cell walls characteristic of active sporangia sporulation.
            </p>
            <div className="p-3 rounded bg-[#181c19] border border-[#2a322c] font-mono-spec text-[11px] text-slate-400">
              <div>LESION MARGIN: <span className="text-[#c84b31] font-bold">ACTIVE WATER-SOAKED</span></div>
              <div>CELL DAMAGE: <span className="text-[#d4b106] font-bold">NECROTIC COLLAPSE</span></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
