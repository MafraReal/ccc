import React, { useState } from 'react';
import { Shield, Search, Plus, UserX, UserCheck, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminUser {
  id: string;
  name: string;
  steamHex: string;
  role: 'Owner' | 'SuperAdmin' | 'Admin';
  addedAt: string;
}

interface AdminsTabProps {
  admins: AdminUser[];
  onAddAdmin: (name: string, steamHex: string, role: string) => void;
  onRemoveAdmin: (id: string) => void;
}

export default function AdminsTab({ admins = [], onAddAdmin, onRemoveAdmin }: AdminsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [steamHex, setSteamHex] = useState('');
  const [role, setRole] = useState<'Owner' | 'SuperAdmin' | 'Admin'>('Admin');

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !steamHex.trim()) {
      alert('Please fill out admin details.');
      return;
    }

    onAddAdmin(name, steamHex, role);
    setName('');
    setSteamHex('');
    setShowForm(false);
  };

  const safeAdmins = admins || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Authorized Admins</h2>
          <p className="text-sm text-gray-400 mt-1">Specify which staff members bypass detection loops and execute console orders.</p>
        </div>

        <button
          id="btn-add-admin"
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-700 hover:bg-purple-600 text-white font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 transition active:scale-95 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" /> Add Admin Bypass
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#0b0a0f] border border-[#272036] rounded-xl p-5"
          >
            <h3 className="text-white font-semibold text-sm mb-4">Authorize Admin Account</h3>
            <form onSubmit={handleAddAdminSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Staff Name</label>
                <input
                  id="admin-new-name"
                  type="text"
                  placeholder="e.g., Alex Staff"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Steam Hex ID</label>
                <input
                  id="admin-new-hex"
                  type="text"
                  placeholder="steam:1100001xxxxxxxx"
                  value={steamHex}
                  onChange={(e) => setSteamHex(e.target.value)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Bypass Tier Role</label>
                <select
                  id="admin-new-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Admin">Admin (Bypasses Lua detect)</option>
                  <option value="SuperAdmin">SuperAdmin (RCON Access)</option>
                  <option value="Owner">Owner (All Perms)</option>
                </select>
              </div>

              <button
                id="btn-confirm-add-admin"
                type="submit"
                className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Perm
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e1e24] bg-zinc-950/40 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Steam Hex ID</th>
                <th className="px-6 py-4">Bypass Scope Role</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4 text-right">Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]/60 text-xs">
              {safeAdmins.map((adm) => (
                <tr key={adm?.id} className="hover:bg-zinc-900/10 transition">
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/30 border border-purple-900/40 text-purple-400 flex items-center justify-center font-display font-semibold">
                        {(adm?.name || 'A').charAt(0)}
                      </div>
                      <span className="text-gray-200 font-bold">{adm?.name || 'Staff Bypass'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4.5">
                    <code className="text-[10px] font-mono text-gray-500">{adm?.steamHex || 'N/D'}</code>
                  </td>

                  <td className="px-6 py-4.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      adm?.role === 'Owner' ? 'bg-amber-950 text-amber-500 border border-amber-500/20' :
                      adm?.role === 'SuperAdmin' ? 'bg-purple-950 text-purple-400 border border-purple-500/20' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700/20'
                    }`}>
                      <Shield className="w-3 h-3" /> {adm?.role || 'Admin'}
                    </span>
                  </td>

                  <td className="px-6 py-4.5 font-mono text-gray-500">{adm?.addedAt || 'N/D'}</td>

                  <td className="px-6 py-4.5 text-right">
                    {adm?.role !== 'Owner' ? (
                      <button
                        id={`btn-remove-adm-${adm?.id}`}
                        onClick={() => onRemoveAdmin(adm?.id)}
                        className="text-rose-400 hover:text-rose-300 transition text-[11px] font-semibold cursor-pointer"
                      >
                        Remove Perm
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-600 italic">Unrestricted</span>
                    )}
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
