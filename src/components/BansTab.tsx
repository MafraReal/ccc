import React, { useState } from 'react';
import { Ban, Search, UserCheck, ShieldAlert, Filter, Plus, Calendar, ShieldCheck } from 'lucide-react';
import { BanRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BansTabProps {
  bans: BanRecord[];
  onToggleBanStatus: (id: string) => void;
  onAddBan: (ban: Omit<BanRecord, 'id' | 'date'>) => void;
}

export default function BansTab({ bans = [], onToggleBanStatus, onAddBan }: BansTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  
  // New Ban form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newSteamId, setNewSteamId] = useState('');
  const [newReason, setNewReason] = useState('Manual Ban from Dashboard');

  const filteredBans = (bans || []).filter(ban => {
    const playerName = ban?.playerName || '';
    const steamId = ban?.steamId || '';
    const matchesSearch = 
      playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      steamId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterActive === 'all') return matchesSearch;
    if (filterActive === 'active') return matchesSearch && ban?.active;
    return matchesSearch && !ban?.active;
  });

  const handleAddNewBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || !newSteamId.trim()) {
      alert('Please fill out the player name and steam ID.');
      return;
    }

    onAddBan({
      playerName: newPlayerName,
      steamId: newSteamId,
      reason: newReason,
      bannedBy: 'Dashboard Admin',
      active: true
    });

    setNewPlayerName('');
    setNewSteamId('');
    setNewReason('Manual Ban from Dashboard');
    setShowAddForm(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Ban Database</h2>
          <p className="text-sm text-gray-400 mt-1">
            Global ban registry syncing real-time player bans across connected servers.
          </p>
        </div>

        <button
          id="btn-trigger-add-ban"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-700 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 transition active:scale-95 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" /> Add Manual Ban
        </button>
      </div>

      {/* Manual Ban Insertion form drawer */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#0b0a0f] border border-[#272036] rounded-xl p-5 relative z-10"
          >
            <h3 className="text-white font-semibold text-sm mb-4">Add Manual Security Block</h3>
            <form onSubmit={handleAddNewBan} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Player Name</label>
                <input
                  id="ban-new-player-name"
                  type="text"
                  placeholder="e.g., ToxicGamer99"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Steam Hex ID</label>
                <input
                  id="ban-new-steam-id"
                  type="text"
                  placeholder="steam:1100001xxxxxxxx"
                  value={newSteamId}
                  onChange={(e) => setNewSteamId(e.target.value)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Ban Reason</label>
                <input
                  id="ban-new-reason"
                  type="text"
                  placeholder="e.g., Resource Stopper Executor"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-zinc-900 text-gray-400 border border-zinc-800 py-2 px-4 rounded-lg text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-ban"
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-600 text-white py-2 px-4 rounded-lg text-xs font-semibold"
                >
                  Confirm Ban
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar row */}
      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            id="ban-search"
            type="text"
            placeholder="Search Player, Steam ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121118] border border-[#27272a] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500 mr-1" />
          {(['all', 'active', 'inactive'] as const).map((mode) => (
            <button
              id={`filter-ban-${mode}`}
              key={mode}
              onClick={() => setFilterActive(mode)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                filterActive === mode 
                  ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

      </div>

      {/* Bans Table List */}
      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e24] bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                <th className="px-6 py-4">Player Details</th>
                <th className="px-6 py-4">Detection / Reason</th>
                <th className="px-6 py-4">Banned By</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]/60 text-xs">
              <AnimatePresence initial={false}>
                {filteredBans.map((ban) => (
                  <motion.tr
                    key={ban?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-zinc-900/10 group"
                  >
                    {/* Player Name and Steam ID */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          ban?.active ? 'bg-rose-950/20 border border-rose-900/30 text-rose-400' : 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400'
                        }`}>
                          <Ban className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-gray-200 font-bold">{ban?.playerName || 'Sconosciuto'}</div>
                          <div className="text-[10px] font-mono text-gray-500 mt-0.5">{ban?.steamId || 'N/D'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="px-6 py-4.5">
                      <span className="font-semibold text-gray-300 max-w-[220px] inline-block truncate" title={ban?.reason}>
                        {ban?.reason || 'Nessun motivo'}
                      </span>
                    </td>

                    {/* Admin Banned By */}
                    <td className="px-6 py-4.5">
                      <span className="text-gray-400 font-mono text-[11px]">{ban?.bannedBy || 'Sistema'}</span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4.5 text-gray-500 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-600" />
                        {ban?.date || 'N/D'}
                      </div>
                    </td>

                    {/* Active/Revoked Badge */}
                    <td className="px-6 py-4.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ban?.active 
                          ? 'bg-rose-950/30 text-rose-400 border border-rose-900/20' 
                          : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/20'
                      }`}>
                        {ban?.active ? 'Active' : 'Revoked'}
                      </span>
                    </td>

                    {/* Actions: Unban/Ban toggle button */}
                    <td className="px-6 py-4.5 text-right">
                      <button
                        id={`btn-unban-${ban?.id}`}
                        onClick={() => onToggleBanStatus(ban?.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-[11px] transition cursor-pointer ${
                          ban?.active
                            ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-900/20'
                            : 'bg-rose-950/30 text-rose-400 border border-rose-900/30 hover:bg-rose-900/20'
                        }`}
                      >
                        {ban?.active ? (
                          <>
                            <UserCheck className="w-3 h-3" /> Revoke Ban
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3" /> Re-Ban
                          </>
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filteredBans.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                    No bans found matching search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
