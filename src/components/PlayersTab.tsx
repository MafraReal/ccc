import React, { useState } from 'react';
import { Users, Search, Ban, XCircle, ShieldAlert, Wifi, Clock, Eye, AlertOctagon } from 'lucide-react';
import { PlayerRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PlayersTabProps {
  players: PlayerRecord[];
  onKickPlayer: (id: string, reason: string) => void;
  onBanPlayer: (player: PlayerRecord, reason: string) => void;
}

export default function PlayersTab({ players = [], onKickPlayer, onBanPlayer }: PlayersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerRecord | null>(null);
  const [kickReason, setKickReason] = useState('Violating server policy');
  const [banReason, setBanReason] = useState('Exploiting/Cheating detected on dashboard');

  const safePlayers = players || [];

  const filteredPlayers = safePlayers.filter(p => {
    const name = p?.name || '';
    const steamId = p?.steamId || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      steamId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getPingColor = (ping: number) => {
    if (!ping) return 'text-zinc-500';
    if (ping < 40) return 'text-emerald-400';
    if (ping < 100) return 'text-amber-400';
    return 'text-rose-400 font-bold';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Active Players</h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time player lobby and stream indicators with direct admin action levers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/20 px-3 py-1.5 rounded-lg border border-purple-500/20 text-xs">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300 font-semibold font-mono">
            Total Lobby: {players.length} players
          </span>
        </div>
      </div>

      {/* Filter and Search Bar row */}
      <div className="relative w-full max-w-md">
        <input
          id="player-search"
          type="text"
          placeholder="Search active players by Name or Steam ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0b0a0f] border border-[#27272a] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List (Col-span 2) */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e24] bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                  <th className="px-5 py-3.5">Active Player</th>
                  <th className="px-5 py-3.5">IDs</th>
                  <th className="px-5 py-3.5 text-center">Ping</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]/60 text-xs">
                {filteredPlayers.map((p) => (
                  <tr 
                    key={p?.id} 
                    onClick={() => setSelectedPlayer(p)}
                    className={`hover:bg-zinc-900/10 transition cursor-pointer ${selectedPlayer?.id === p?.id ? 'bg-purple-950/10' : ''}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-850 flex items-center justify-center text-gray-400 font-display font-semibold text-xs border border-zinc-800">
                          {(p?.name || 'P').charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-200 font-bold">{p?.name || 'Sconosciuto'}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-650" /> Joined {p?.joinTime || 'N/D'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="px-5 py-4 font-mono text-[10px]">
                      <div className="text-gray-400">Steam: <span className="text-gray-500">{p?.steamId ? p.steamId.slice(6, 18) : 'N/D'}...</span></div>
                      <div className="text-gray-400 mt-0.5">Discord: <span className="text-purple-400/80">{p?.discord || 'N/D'}</span></div>
                    </td>

                    {/* Ping */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-gray-600" />
                        <span className={`font-mono font-bold ${getPingColor(p?.ping || 0)}`}>{p?.ping || 0}ms</span>
                      </div>
                    </td>

                    {/* CTA Details Button */}
                    <td className="px-5 py-4 text-right">
                      <button
                        id={`btn-view-${p?.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlayer(p);
                        }}
                        className="text-xs bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-850 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredPlayers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500 font-medium">
                      No active players found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Inspect sidebar panel */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {selectedPlayer ? (
              <motion.div
                key={selectedPlayer.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Upper details */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#1e1e24] pb-3">
                    <h3 className="text-white font-semibold text-sm font-display flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-purple-400" /> Security Inspection
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono font-bold">PID: #{selectedPlayer.id}</span>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">Player Character Name</span>
                      <strong className="text-gray-200 text-sm mt-0.5 block">{selectedPlayer.name}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Discord Tag</span>
                        <span className="text-purple-400 text-xs font-semibold mt-0.5 block">{selectedPlayer.discord}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-mono block">Active Connection Ping</span>
                        <span className={`text-xs font-bold font-mono mt-0.5 block ${getPingColor(selectedPlayer.ping)}`}>{selectedPlayer.ping}ms</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">Steam Hex identifier</span>
                      <code className="text-gray-400 text-[10px] font-mono mt-1 block bg-black/40 p-2 rounded border border-zinc-900 select-all overflow-x-auto">
                        {selectedPlayer.steamId}
                      </code>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-mono block">Hardware Serial Code (HWID)</span>
                      <code className="text-zinc-500 text-[10px] font-mono mt-1 block bg-black/40 p-2 rounded border border-zinc-900 select-all overflow-x-auto">
                        {selectedPlayer.hardwareId}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Action forms */}
                <div className="space-y-4 pt-6 border-t border-[#1e1e24] mt-6">
                  {/* Kick Action */}
                  <div className="space-y-1.5">
                    <input
                      id="inspect-kick-reason"
                      type="text"
                      placeholder="Reason for kick..."
                      value={kickReason}
                      onChange={(e) => setKickReason(e.target.value)}
                      className="w-full bg-[#121118] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      id="btn-kick-action"
                      onClick={() => onKickPlayer(selectedPlayer.id, kickReason)}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white text-xs py-2 px-3 rounded-lg border border-zinc-850 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer font-semibold"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" /> Kick Player
                    </button>
                  </div>

                  {/* Ban Action */}
                  <div className="space-y-1.5 pt-2">
                    <input
                      id="inspect-ban-reason"
                      type="text"
                      placeholder="Reason for ban..."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="w-full bg-[#121118] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      id="btn-ban-action"
                      onClick={() => onBanPlayer(selectedPlayer, banReason)}
                      className="w-full bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 text-xs py-2 px-3 rounded-lg border border-rose-900/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer font-semibold"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-400" /> Ban Player (PowerAC Core)
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-gray-600">
                <AlertOctagon className="w-10 h-10 text-zinc-800 mb-2.5" />
                <h4 className="font-semibold text-sm text-gray-500 font-display">No Player Inspected</h4>
                <p className="text-xs text-zinc-600 mt-1 max-w-[180px]">Select a player from the list to trigger active RCON operations.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
