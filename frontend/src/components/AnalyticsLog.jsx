import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Bell, ShieldAlert, History, Download } from 'lucide-react';

export default function AnalyticsLog({ historyData, alertLogs }) {
  const chartData = historyData && historyData.length > 0 ? historyData : [
    { time: '12:00', pests: 0, risk: 25 },
    { time: '12:05', pests: 1, risk: 32 },
    { time: '12:10', pests: 3, risk: 58 },
    { time: '12:15', pests: 6, risk: 78 },
    { time: '12:20', pests: 2, risk: 45 },
    { time: '12:25', pests: 0, risk: 30 }
  ];

  const exportLogsCSV = () => {
    const jsonStr = JSON.stringify(alertLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agri_spec_log_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Telemetry Timeline Chart */}
      <div className="lg:col-span-2 agri-card rounded-lg p-5 border border-[#29312b] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#29312b]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-[#6e814c]/15 text-[#6e814c] border border-[#6e814c]/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e8e4d9] font-serif-botanical tracking-tight">Crop Threat & Disease Timeline</h2>
              <p className="text-xs text-slate-400 font-mono-spec">TELEMETRY MATRIX • REAL-TIME EPIDEMIC MONITOR</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-spec">
            <span className="flex items-center gap-1 text-[#8a9f65]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6e814c]"></span> Disease Risk Index (%)
            </span>
            <span className="flex items-center gap-1 text-[#e06d50]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b85438]"></span> Spotted Pests
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6e814c" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6e814c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b85438" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#b85438" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#29312b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141715', borderColor: '#29312b', borderRadius: '4px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                itemStyle={{ color: '#e8e4d9' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#6e814c" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Disease Risk (%)" />
              <Area type="monotone" dataKey="pests" stroke="#b85438" strokeWidth={2} fillOpacity={1} fill="url(#colorPests)" name="Spotted Pests" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field Log Feed */}
      <div className="agri-card rounded-lg p-5 border border-[#29312b] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#29312b]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-[#c99e32]/15 text-[#c99e32] border border-[#c99e32]/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e8e4d9] font-serif-botanical tracking-tight">Field Station Event Log</h2>
              <p className="text-xs text-slate-400 font-mono-spec">TIMESTAMPED RECORDS</p>
            </div>
          </div>
          <button
            onClick={exportLogsCSV}
            className="p-1.5 rounded bg-[#141715] hover:bg-[#29312b] border border-[#29312b] text-slate-400 hover:text-white transition-all"
            title="Download Agronomic Log"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 font-mono-spec">
          {alertLogs && alertLogs.length > 0 ? (
            alertLogs.map((log) => (
              <div 
                key={log.id || Math.random()} 
                className="p-2.5 rounded bg-[#141715] border border-[#29312b] flex flex-col gap-1 text-xs hover:border-[#4a634e] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#e06d50] flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {log.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono-spec">{log.timestamp}</span>
                </div>
                <p className="text-slate-300">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 text-xs py-10 flex flex-col items-center gap-2 font-mono-spec">
              <History className="w-6 h-6 text-slate-600" />
              <span>No field events logged in current session</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
