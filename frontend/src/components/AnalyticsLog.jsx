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
    a.download = `crop_health_log_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Real-time Crop Threat Trend Chart */}
      <div className="lg:col-span-2 bg-[#080808] rounded-2xl p-5 border border-[#1a1a1a] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Crop Threat & Disease Timeline</h2>
              <p className="text-xs text-slate-400">Pest Outbreak & Microclimate Risk Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Disease Risk Index (%)
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Spotted Pests
            </span>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Risk Score (%)" />
              <Area type="monotone" dataKey="pests" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorPests)" name="Pest Count" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Alert Feed Log */}
      <div className="bg-[#080808] rounded-2xl p-5 border border-[#1a1a1a] flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Field Log & Crop Alerts</h2>
              <p className="text-xs text-slate-400">Pest Defense Events</p>
            </div>
          </div>
          <button
            onClick={exportLogsCSV}
            className="p-1.5 rounded-lg bg-[#111] hover:bg-[#222] border border-[#222] text-slate-400 hover:text-white transition-all"
            title="Download Crop Health Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Feed List */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {alertLogs && alertLogs.length > 0 ? (
            alertLogs.map((log) => (
              <div 
                key={log.id || Math.random()} 
                className="p-3 rounded-xl bg-[#0f0f0f] border border-[#222] flex flex-col gap-1 text-xs hover:border-[#333] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {log.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-medium">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 text-xs py-10 flex flex-col items-center gap-2">
              <History className="w-6 h-6 text-slate-600" />
              <span>No alerts recorded in current session</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
