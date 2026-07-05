import React, { useState } from 'react';
import { CircleDollarSign, ShieldCheck, AlertTriangle, TrendingUp, Key, Search, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TransactionRecord {
  id: string;
  playerName: string;
  action: string;
  amount: number;
  status: 'safe' | 'flagged' | 'blocked';
  time: string;
}

const INITIAL_TRANS: TransactionRecord[] = [
  { id: '1', playerName: 'LuigiV', action: 'Sell Cargo Vehicle', amount: 15000, status: 'safe', time: '14:42' },
  { id: '2', playerName: 'Mario_Rossi', action: 'ATM Cash Withdrawal', amount: 5000, status: 'safe', time: '14:39' },
  { id: '3', playerName: 'GamerGod_99', action: 'Modify Bank Account via Lua', amount: 999999, status: 'blocked', time: '14:38' },
  { id: '4', playerName: 'Spammer90', action: 'Infinite Item Loop Sell', amount: 450000, status: 'flagged', time: '13:12' }
];

export default function EconomyTab() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANS);
  const [search, setSearch] = useState('');
  const [maxThreshold, setMaxThreshold] = useState(100000);

  const filteredTrans = transactions.filter(t => 
    t.playerName.toLowerCase().includes(search.toLowerCase()) ||
    t.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Economy Safeguard</h2>
          <p className="text-sm text-gray-400 mt-1">Audit real-time transaction amounts and trigger instant blocks on infinite cash injection loops.</p>
        </div>

        {/* Global Protection badge */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2.5 self-start">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase font-bold text-emerald-500 tracking-wider">Economy Lock</div>
            <div className="text-xs text-gray-200 font-bold">GUARDING TRANS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threshold Adjustment Card */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm font-display flex items-center gap-2">
            <CircleDollarSign className="w-4.5 h-4.5 text-purple-400" /> Threshold Watch
          </h3>
          <p className="text-xs text-gray-500 leading-normal">
            Transactions that exceed this threshold automatically flag or suspend the player until review.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold text-gray-400">
              <span>Immediate Flag Threshold</span>
              <span className="text-purple-400">${maxThreshold.toLocaleString()}</span>
            </div>
            <input
              id="econ-threshold-slider"
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={maxThreshold}
              onChange={(e) => setMaxThreshold(Number(e.target.value))}
              className="w-full accent-purple-600 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[10px] text-gray-500 flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Recommended limit is $150,000 for standard roleplay servers to prevent false triggers during mansion or supercar buy loops.</span>
          </div>
        </div>

        {/* Audit Search Bar */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-white font-semibold text-sm font-display mb-1">Live Bank Audit</h3>
            <p className="text-xs text-gray-500">Search transactions streamed over linked FXServer.</p>
          </div>
          
          <div className="relative w-full">
            <input
              id="econ-search"
              type="text"
              placeholder="Filter by player, transaction description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121118] border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-4 h-4 text-gray-600 absolute left-3 top-2.5" />
          </div>
        </div>

      </div>

      {/* Transaction Feed */}
      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e24] bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Transaction Action</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Security Hook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]/60 text-xs">
              {filteredTrans.map((tr) => (
                <tr key={tr.id} className="hover:bg-zinc-900/10 transition">
                  <td className="px-6 py-4.5 font-bold text-gray-200">{tr.playerName}</td>
                  <td className="px-6 py-4.5 text-gray-400 font-mono text-[11px]">{tr.action}</td>
                  <td className="px-6 py-4.5 text-right font-bold font-mono text-gray-300">
                    ${tr.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4.5 font-mono text-gray-500 text-[10px]">Today, {tr.time}</td>
                  <td className="px-6 py-4.5 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tr.status === 'safe' ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/10' :
                      tr.status === 'flagged' ? 'bg-amber-950/30 text-amber-500 border border-amber-900/10' :
                      'bg-rose-950/30 text-rose-400 border border-rose-900/10'
                    }`}>
                      {tr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
