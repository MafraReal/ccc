import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  TrendingUp, 
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  Crown
} from 'lucide-react';
import { FiveMServer, LicenseKey, BanRecord } from '../types';
import { motion } from 'motion/react';

interface DashboardTabProps {
  selectedServer: FiveMServer;
  keys: LicenseKey[];
  bans: BanRecord[];
}

const detectionData = [
  { day: 'Mon', detections: 4 },
  { day: 'Tue', detections: 12 },
  { day: 'Wed', detections: 8 },
  { day: 'Thu', detections: 15 },
  { day: 'Fri', detections: 22 },
  { day: 'Sat', detections: 34 },
  { day: 'Sun', detections: 18 }
];

export default function DashboardTab({ selectedServer, keys, bans }: DashboardTabProps) {
  const activeKey = selectedServer ? (keys.find(k => k.linkedServer === selectedServer.id) || keys[0]) : keys[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Overview</h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time status overview and cheat vector tracking metrics.
          </p>
        </div>

        {/* Global Protection badge */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2.5 self-start">
          <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase font-bold text-emerald-500 tracking-wider">Anticheat Core</div>
            <div className="text-xs text-gray-200 font-bold">ACTIVE & GUARDING</div>
          </div>
        </div>
      </div>

      {/* Grid of 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Players</span>
            <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-1.5">
              {selectedServer?.status === 'online' ? selectedServer.playersCount : 0}
              <span className="text-xs text-gray-500 font-normal">/ {selectedServer?.maxPlayers || 128}</span>
            </div>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live on server
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Blocks</span>
            <div className="text-2xl font-bold font-mono text-white">
              {bans.filter(b => b.active).length}
            </div>
            <p className="text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +14% this week
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Server CPU Load</span>
            <div className="text-2xl font-bold font-mono text-white">
              {selectedServer?.status === 'online' ? '1.4%' : '0%'}
            </div>
            <p className="text-[10px] text-gray-500">Extremely optimized native code</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-gray-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active License</span>
            <div className="text-lg font-bold text-purple-400 truncate max-w-[120px] font-mono">
              {activeKey ? activeKey.tier : 'None'}
            </div>
            <p className="text-[10px] text-gray-500">
              {activeKey ? `${activeKey.duration} subscription` : 'Redeem a key first'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            activeKey?.tier === 'Exclusive' ? 'bg-amber-950/20 border-amber-900/30 text-amber-500' :
            activeKey?.tier === 'Premium' ? 'bg-purple-950/20 border-purple-900/30 text-purple-400' :
            'bg-zinc-900 border-zinc-800 text-gray-400'
          }`}>
            {activeKey?.tier === 'Exclusive' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Main Layout Grid: Chart & Live Detections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Detection Chart Card (Recharts) */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-base font-display">Cheat Detections (Last 7 Days)</h3>
              <p className="text-xs text-gray-500 mt-1">Real-time vector trigger counts</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-950/30 text-purple-400 border border-purple-900/30 font-bold font-mono">
              Weekly sum: 103
            </span>
          </div>

          <div className="h-64 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="detectionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis dataKey="day" stroke="#52525b" tickLine={false} />
                <YAxis stroke="#52525b" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                  labelClassName="text-purple-400 font-bold font-display"
                />
                <Area 
                  type="monotone" 
                  dataKey="detections" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#detectionGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Protection Status / Actions card */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-base font-display mb-4">Live Guard Shield</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950 border border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Executor Blocker</h4>
                    <p className="text-[10px] text-gray-500">Inject security hooks</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase font-mono">Guarded</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950 border border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Noclip Safeguard</h4>
                    <p className="text-[10px] text-gray-500">Velo-limit triggers</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-900/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase font-mono">Active</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950 border border-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/20 border border-purple-900/30 flex items-center justify-center text-purple-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-purple-300">Anti Spectate Hack</h4>
                    <p className="text-[10px] text-gray-500">Premium camera shield</p>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-900/20 text-purple-400 px-2 py-0.5 rounded font-bold uppercase font-mono">Premium</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#1e1e24] pt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">Anti-DDoS Core Firewall</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 0.0ms delay
            </span>
          </div>
        </div>
      </div>

      {/* Recent Ban Event list */}
      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6">
        <h3 className="text-white font-semibold text-base font-display mb-4">Recent Blocks (Live Stream)</h3>
        
        <div className="divide-y divide-zinc-900/80">
          {bans.slice(0, 3).map((ban) => (
            <div key={ban.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-rose-400 font-bold font-mono mr-2">[BLOCKED]</span>
                <span className="text-gray-200 font-semibold">{ban.playerName}</span>
                <span className="text-gray-500 font-mono ml-2">({ban.steamId})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-[#181116] text-rose-400 px-2.5 py-1 rounded font-mono text-[10px] max-w-[200px] sm:max-w-none truncate">
                  {ban.reason}
                </span>
                <span className="text-gray-500 font-mono text-[10px]">{ban.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
