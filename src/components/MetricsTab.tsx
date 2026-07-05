import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, ShieldAlert, Award, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const vectorData = [
  { name: 'Lua Executors', count: 48, color: '#a855f7' },
  { name: 'Noclip Hack', count: 32, color: '#3b82f6' },
  { name: 'Weapon Spawning', count: 18, color: '#f59e0b' },
  { name: 'Speed Bypass', count: 12, color: '#ef4444' },
  { name: 'Spectate Cam', count: 6, color: '#10b981' }
];

export default function MetricsTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Security Metrics</h2>
        <p className="text-sm text-gray-400 mt-1">Analytical breakdown of blocked cheat types across servers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart card */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-white font-semibold text-base font-display">Common Hack Vectors (This Month)</h3>
            <p className="text-xs text-gray-500 mt-1">Distribution of triggers caught in-game by the anti-cheat hooks.</p>
          </div>

          <div className="h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tickLine={false} />
                <YAxis stroke="#52525b" tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#18181b', opacity: 0.3 }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {vectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit summary */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base font-display flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-purple-400" /> Vector Breakdown
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              {vectorData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-900">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.count} blocks</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 flex items-center gap-2 text-[10px] text-gray-500">
            <AlertCircle className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Lua executors still hold the highest threat index for modern FiveM roleplay servers.</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
