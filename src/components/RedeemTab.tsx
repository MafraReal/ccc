import React, { useState } from 'react';
import { 
  Key, 
  Link2, 
  Copy, 
  Check, 
  Shield, 
  Zap, 
  Crown, 
  AlertCircle,
  HelpCircle,
  Clock,
  Server,
  X
} from 'lucide-react';
import { LicenseKey, FiveMServer } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface RedeemTabProps {
  servers: FiveMServer[];
  selectedServer: FiveMServer;
  keys: LicenseKey[];
  unredeemedKeys?: any[];
  onRedeem: (input: string, serverId: string) => Promise<{ success: boolean; message: string; key?: LicenseKey }> | { success: boolean; message: string; key?: LicenseKey };
  onAddUnredeemedKey?: (key: string, tier: string, duration: string) => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
  onDeleteUnredeemedKey?: (key: string) => void;
  user?: any;
  onRefreshData?: () => void;
}

export default function RedeemTab({ 
  servers, 
  selectedServer, 
  keys, 
  unredeemedKeys = [],
  onRedeem,
  onAddUnredeemedKey,
  onDeleteUnredeemedKey,
  user,
  onRefreshData
}: RedeemTabProps) {
  const [targetServerId, setTargetServerId] = useState<string>(selectedServer?.id || (servers[0]?.id || ''));
  
  React.useEffect(() => {
    if (selectedServer?.id) {
      setTargetServerId(selectedServer.id);
    } else if (servers[0]?.id) {
      setTargetServerId(servers[0].id);
    }
  }, [selectedServer, servers]);
  const [inputVal, setInputVal] = useState<string>('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Free lifetime key state
  const [isGeneratingFreeKey, setIsGeneratingFreeKey] = useState(false);
  const [freeKeyError, setFreeKeyError] = useState('');
  const [freeKeySuccess, setFreeKeySuccess] = useState('');

  const handleGenerateFreeLifetimeKey = async () => {
    if (!user) return;
    setIsGeneratingFreeKey(true);
    setFreeKeyError('');
    setFreeKeySuccess('');
    try {
      const res = await fetch('/api/keys/generate-free-lifetime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, username: user.username })
      });
      const data = await res.json();
      if (data.success) {
        setFreeKeySuccess(`Chiave Free Lifetime creata con successo!`);
        setInputVal(data.key.key); // Autocomplete the input field
        if (onRefreshData) onRefreshData();
      } else {
        setFreeKeyError(data.message || 'Errore nella generazione.');
      }
    } catch (err) {
      setFreeKeyError('Impossibile connettersi al server.');
    } finally {
      setIsGeneratingFreeKey(false);
    }
  };
  
  // Manual key generator states
  const [newKeyInput, setNewKeyInput] = useState('');
  const [newKeyTier, setNewKeyTier] = useState('Premium');
  const [newKeyDuration, setNewKeyDuration] = useState('30 Days');
  const [manualStatus, setManualStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Status feedback
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleAutoGenerateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 20; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewKeyInput(`VAC-${rand}`);
  };

  const handleAddManualKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) {
      setManualStatus({ type: 'error', message: 'Please enter or generate a key.' });
      return;
    }
    if (!onAddUnredeemedKey) return;

    const res = await onAddUnredeemedKey(newKeyInput.trim().toUpperCase(), newKeyTier, newKeyDuration);
    if (res.success) {
      setManualStatus({ type: 'success', message: `Key ${newKeyInput.trim().toUpperCase()} registered successfully!` });
      setNewKeyInput('');
    } else {
      setManualStatus({ type: 'error', message: res.message });
    }

    setTimeout(() => {
      setManualStatus({ type: null, message: '' });
    }, 5000);
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setStatus({ type: 'error', message: 'Please enter a valid Tebex order ID or license key.' });
      return;
    }

    try {
      const res = await onRedeem(inputVal, targetServerId);
      if (res.success) {
        setStatus({ 
          type: 'success', 
          message: res.message || `Successfully linked key ${res.key?.key} to server #${targetServerId}!`
        });
        setInputVal('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error or invalid key format.' });
    }

    // Auto clear status after 6 seconds
    setTimeout(() => {
      setStatus(prev => prev.type ? { type: null, message: '' } : prev);
    }, 6000);
  };

  const handleCopyKey = (licenseKey: LicenseKey) => {
    navigator.clipboard.writeText(licenseKey.key);
    setCopiedKeyId(licenseKey.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Helper to render Tier Badges/Icons
  const getTierIcon = (tier: 'Free' | 'Premium' | 'Exclusive') => {
    switch (tier) {
      case 'Free': return <Shield className="w-5 h-5 text-gray-400" />;
      case 'Premium': return <Zap className="w-5 h-5 text-purple-400 animate-pulse" />;
      case 'Exclusive': return <Crown className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Redeem</h2>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-2xl">
          Enter a Tebex order number or license key — we'll handle the rest.
        </p>
      </div>

      {/* Main Redeem & Link Card */}
      <div className="bg-[#0b0a0f] border border-[#1b1525] rounded-xl p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Subtle decorative purple glow background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <form onSubmit={handleRedeemSubmit} className="space-y-6 relative z-10">
          
          {/* Server Selector Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono flex items-center gap-1.5">
              Server <HelpCircle className="w-3.5 h-3.5 text-gray-600 cursor-help" title="Select the server you want to link this key to" />
            </label>
            <div className="relative">
              <select
                id="redeem-server-select"
                value={targetServerId}
                onChange={(e) => setTargetServerId(e.target.value)}
                className="w-full bg-[#121118] border border-[#272036] rounded-xl px-4 py-3.5 text-sm text-gray-200 font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900/30 transition-all cursor-pointer appearance-none"
              >
                {servers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b0a0f] py-2">
                    🖥️ {s.name} ({s.ip})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Key Input Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase font-mono">
              Tebex Order # or License Key
            </label>
            <div className="relative">
              <input
                id="license-key-input"
                type="text"
                placeholder="tbx-123456789 or PWR-XXXX-XXXX-XXXX"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-[#121118] border border-[#272036] rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 font-mono tracking-wide focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900/30 transition-all"
              />
              <div className="absolute inset-y-0 right-4 flex items-center text-gray-600 font-mono text-[10px] pointer-events-none uppercase">
                Redeem codes are case-sensitive
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            id="redeem-submit-btn"
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(109,40,217,0.3)] transition-all duration-200 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] active:scale-[0.99] cursor-pointer"
          >
            <Link2 className="w-4 h-4 text-purple-200" />
            <span className="font-semibold text-sm">Redeem & Link</span>
          </button>
        </form>

        {/* Feedback Messages */}
        <AnimatePresence mode="wait">
          {status.type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 z-10 relative"
            >
              <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                status.type === 'success' 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
              }`}>
                {status.type === 'success' ? (
                  <Check className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                )}
                <div>
                  <h4 className="font-semibold text-sm">
                    {status.type === 'success' ? 'Redemption Successful' : 'Failed to Redeem'}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1">{status.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual Level Tiers Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier Free */}
        <div className="bg-[#0b0a0f] border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:border-zinc-800 transition duration-200 group">
          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-white font-semibold text-sm font-display mt-1">Free</h3>
          <p className="text-xs text-gray-500">Base detections</p>
        </div>

        {/* Tier Premium */}
        <div className="bg-[#0b0a0f] border border-purple-950/40 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:border-purple-900/60 transition duration-200 group relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          <div className="w-12 h-12 rounded-full bg-purple-950/20 border border-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-purple-300 font-semibold text-sm font-display mt-1">Premium</h3>
          <p className="text-xs text-gray-500">All detections + extras</p>
        </div>

        {/* Tier Exclusive */}
        <div className="bg-[#0b0a0f] border border-zinc-900 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 hover:border-zinc-800 transition duration-200 group">
          <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-amber-500 font-semibold text-sm font-display mt-1">Exclusive</h3>
          <p className="text-xs text-gray-500">Premium + bot, setup</p>
        </div>
      </div>

      {/* Free Lifetime Key Generator Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-purple-950/20 to-zinc-950 border border-purple-950/40 rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="bg-purple-900/30 text-purple-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-purple-500/25 font-mono">
              Offerta Esclusiva
            </span>
            <span className="text-emerald-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/25 border border-emerald-500/35 font-mono">
              Lifetime
            </span>
          </div>
          <h4 className="text-white font-display font-bold text-base mt-1">Ottieni la tua Chiave Free Lifetime</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
            Ogni account può richiedere gratuitamente 1 chiave di licenza di livello <strong>Free</strong> con durata <strong>Lifetime</strong> direttamente sul nostro portale. Una volta generata, comparirà automaticamente nel database e potrai risvattarla sul tuo server.
          </p>
          
          {freeKeyError && (
            <p className="text-xs text-rose-400 font-medium mt-2 flex items-center gap-1.5 justify-center md:justify-start">
              <AlertCircle className="w-4.5 h-4.5" /> {freeKeyError}
            </p>
          )}
          {freeKeySuccess && (
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1.5 justify-center md:justify-start">
              <Check className="w-4.5 h-4.5 text-emerald-400" /> {freeKeySuccess}
            </p>
          )}
        </div>

        <button
          onClick={handleGenerateFreeLifetimeKey}
          disabled={isGeneratingFreeKey || keys.some(k => k.tier === 'Free') || unredeemedKeys.some(uk => uk.tier === 'Free' && uk.createdBy === `User-${user?.id}`)}
          className={`shrink-0 px-6 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition cursor-pointer ${
            keys.some(k => k.tier === 'Free') || unredeemedKeys.some(uk => uk.tier === 'Free' && uk.createdBy === `User-${user?.id}`)
              ? 'bg-zinc-900 border border-zinc-800 text-gray-500 cursor-not-allowed'
              : 'bg-purple-700 hover:bg-purple-600 text-white shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          }`}
        >
          {isGeneratingFreeKey ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generazione...</span>
            </>
          ) : keys.some(k => k.tier === 'Free') || unredeemedKeys.some(uk => uk.tier === 'Free' && uk.createdBy === `User-${user?.id}`) ? (
            <>
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Già Richiesta</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              <span>Genera Chiave Free</span>
            </>
          )}
        </button>
      </div>

      {/* YOUR KEYS Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase font-mono">Your Keys</h3>
        
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {keys.map((k) => (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-4 flex items-center justify-between gap-4 hover:border-zinc-800 transition"
              >
                {/* Left side: Icon */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                    k.tier === 'Free' ? 'bg-zinc-900/40 border-zinc-800 text-gray-400' :
                    k.tier === 'Premium' ? 'bg-purple-950/30 border-purple-900/30 text-purple-400' :
                    'bg-amber-950/20 border-amber-900/30 text-amber-500'
                  }`}>
                    {getTierIcon(k.tier)}
                  </div>
                  
                  {/* Middle details */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-200 tracking-wide truncate">
                        {k.key}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        k.tier === 'Free' ? 'bg-zinc-800 text-gray-400' :
                        k.tier === 'Premium' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' :
                        'bg-amber-950 text-amber-500 border border-amber-500/30'
                      }`}>
                        {k.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <Clock className="w-3.5 h-3.5" />
                        {k.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-gray-600" />
                        <span>Linked Server: <span className="font-mono text-gray-300">#{k.linkedServer}</span></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  id={`btn-copy-${k.id}`}
                  onClick={() => handleCopyKey(k)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white p-2.5 rounded-lg border border-[#27272a] transition active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedKeyId === k.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {keys.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#27272a] rounded-xl bg-zinc-950/20">
              <Key className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">No license keys linked yet.</p>
              <p className="text-xs text-gray-600 mt-1">Redeem an order code above to link your first server.</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel: Manual Key Generation */}
      {user && (user.role === 'admin' || user.username?.toLowerCase() === 'mafra') && (
        <div className="border-t border-[#1e1e24] pt-8 mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Admin: License Key Generator
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">
              Manually create and pre-register license keys. This allows you to generate new keys or pre-register keys generated by the Discord Bot so they can be redeemed on the web panel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Generator Form */}
            <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-4 h-fit">
              <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-mono">Create Unredeemed Key</h4>
              
              <form onSubmit={handleAddManualKeySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 font-mono">License Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="VAC-XXXXXXXXXXXXXXXXXXXX"
                      value={newKeyInput}
                      onChange={(e) => setNewKeyInput(e.target.value)}
                      className="flex-1 bg-[#121118] border border-[#272036] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleAutoGenerateKey}
                      className="bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/20 hover:border-purple-500/35 text-purple-400 px-3 py-2 rounded-lg text-xs font-mono font-bold transition active:scale-95 cursor-pointer shrink-0"
                      title="Generate random VAC- key"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 font-mono">Tier</label>
                    <select
                      value={newKeyTier}
                      onChange={(e) => setNewKeyTier(e.target.value)}
                      className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium">Premium</option>
                      <option value="Exclusive">Exclusive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 font-mono">Duration</label>
                    <select
                      value={newKeyDuration}
                      onChange={(e) => setNewKeyDuration(e.target.value)}
                      className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3 py-2 text-xs text-gray-200 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="30 Days">30 Days</option>
                      <option value="90 Days">90 Days</option>
                      <option value="Lifetime">Lifetime</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition active:scale-98 cursor-pointer mt-2"
                >
                  Register Unredeemed Key
                </button>
              </form>

              {manualStatus.type && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                  manualStatus.type === 'success' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                }`}>
                  {manualStatus.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{manualStatus.message}</span>
                </div>
              )}
            </div>

            {/* Unredeemed Keys List */}
            <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-4 flex flex-col">
              <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase font-mono flex items-center justify-between">
                <span>Unredeemed Database Keys</span>
                <span className="bg-purple-950 text-purple-400 px-2 py-0.5 rounded-full text-[10px] border border-purple-500/20">
                  {unredeemedKeys.length} keys
                </span>
              </h4>

              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 flex-1">
                {unredeemedKeys.map((uk) => (
                  <div key={uk.key} className="bg-[#121118]/60 border border-zinc-900/60 rounded-lg p-3 flex items-center justify-between gap-4 hover:border-zinc-800 transition">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-200 select-all">{uk.key}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          uk.tier === 'Free' ? 'bg-zinc-800 text-gray-400' :
                          uk.tier === 'Premium' ? 'bg-purple-900/20 text-purple-400 border border-purple-500/10' :
                          'bg-amber-950/20 text-amber-500 border border-amber-500/10'
                        }`}>
                          {uk.tier}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-500/85">
                          <Clock className="w-3 h-3" /> {uk.duration}
                        </span>
                        <span>By: {uk.createdBy || 'Discord Bot'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(uk.key);
                          alert(`Copied key: ${uk.key}`);
                        }}
                        className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-zinc-850 transition cursor-pointer"
                        title="Copy Key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteUnredeemedKey && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete/revoke unredeemed key ${uk.key}?`)) {
                              onDeleteUnredeemedKey(uk.key);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-400 p-1.5 rounded hover:bg-rose-950/20 transition cursor-pointer"
                          title="Delete Key"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {unredeemedKeys.length === 0 && (
                  <div className="text-center py-10 text-gray-600 text-xs">
                    <Key className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    No unredeemed keys in database.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Custom simple Chevron Down icon for select dropdown
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
