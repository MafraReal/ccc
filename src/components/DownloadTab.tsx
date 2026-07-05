import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  ShieldAlert, 
  FileCode, 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  Zap, 
  Crown, 
  Shield, 
  AlertTriangle, 
  Settings2, 
  Link2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FiveMServer, LicenseKey } from '../types';

interface DownloadTabProps {
  servers: FiveMServer[];
  keys: LicenseKey[];
  onUpdateIP: (key: string, ip: string) => Promise<{ success: boolean; message: string }>;
}

export default function DownloadTab({ servers, keys, onUpdateIP }: DownloadTabProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);
  
  // Interactive generator states
  const [selectedKeyStr, setSelectedKeyStr] = useState<string>(keys[0]?.key || '');
  const [manualIp, setManualIp] = useState<string>('');
  const [ipUpdateStatus, setIpUpdateStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isUpdatingIp, setIsUpdatingIp] = useState<boolean>(false);

  const installCommand = 'ensure powerac';

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(installCommand);
    setCopiedCmd('install');
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const activeKeyObj = keys.find(k => k.key === selectedKeyStr) || keys[0];

  const handleSaveIpLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKeyObj) return;
    setIsUpdatingIp(true);
    setIpUpdateStatus({ type: null, message: '' });

    try {
      const res = await onUpdateIP(activeKeyObj.key, manualIp.trim());
      if (res.success) {
        setIpUpdateStatus({ type: 'success', message: 'IP Lock successfully updated on web database!' });
      } else {
        setIpUpdateStatus({ type: 'error', message: res.message || 'Failed to update IP lock.' });
      }
    } catch (err) {
      setIpUpdateStatus({ type: 'error', message: 'Connection error while saving IP.' });
    } finally {
      setIsUpdatingIp(false);
      setTimeout(() => {
        setIpUpdateStatus({ type: null, message: '' });
      }, 5000);
    }
  };

  // Get current Panel URL for config.lua
  const panelUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  // Generated config.lua text
  const generatedConfigLua = `-- =========================================================================
--             PowerAC CORE CONFIGURATION & LICENSE KEYS
-- =========================================================================

Config = {}

-- [LICENSE KEY] Insert the license key you obtained (linked to this server)
Config.LicenseKey = "${activeKeyObj ? activeKeyObj.key : 'VAC-INSERISCI-QUI'}"

-- [PANEL URL] The public address of your Web Dashboard so the anticheat can authorize actions
Config.PanelURL = "${panelUrl}"

-- [INFO] Auto-IP Lock: If your IP is set to "0.0.0.0" in the Web Dashboard,
-- the anticheat will automatically lock itself to your server's public IP upon the first launch!
`;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(generatedConfigLua);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  // Helper to render Tier Badges/Icons
  const getTierIcon = (tier: 'Free' | 'Premium' | 'Exclusive') => {
    switch (tier) {
      case 'Free': return <Shield className="w-4 h-4 text-gray-400" />;
      case 'Premium': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'Exclusive': return <Crown className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight font-sans">Download & Setup</h2>
        <p className="text-sm text-gray-400 mt-1">
          Install the anticheat on your FiveM server and configure the real-time licensing system.
        </p>
      </div>

      {/* Warning banner if they don't have active keys yet */}
      {keys.length === 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 text-amber-200">
          <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">No Active Licenses Redeemed Yet!</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Before configuring your files, you need to redeem your license key inside the <strong className="text-amber-400">Redeem</strong> tab. 
              This links the license to a specific virtual server in our web backend.
            </p>
          </div>
        </div>
      )}

      {/* Interactive License Configurator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Setup Configurator Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-900/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-400">
                <Settings2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">1. Choose License</h3>
                <p className="text-xs text-gray-400">Generate your personalized config.lua</p>
              </div>
            </div>

            {/* Selector Field */}
            {keys.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider block">
                    Select Active Key
                  </label>
                  <select
                    id="setup-license-select"
                    value={selectedKeyStr}
                    onChange={(e) => {
                      setSelectedKeyStr(e.target.value);
                      const keyObj = keys.find(k => k.key === e.target.value);
                      if (keyObj) setManualIp(keyObj.ip || '0.0.0.0');
                    }}
                    className="w-full bg-[#121118] border border-[#272036] rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {keys.map(k => (
                      <option key={k.id} value={k.key}>
                        🔑 {k.key.substring(0, 15)}... ({k.tier})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Key Metadata Metrics */}
                {activeKeyObj && (
                  <div className="bg-[#121118]/50 border border-zinc-900 rounded-xl p-4 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <span className="text-gray-500 uppercase font-bold text-[9px] font-mono">Tier level</span>
                      <span className="flex items-center gap-1 text-purple-300 font-bold uppercase font-mono">
                        {getTierIcon(activeKeyObj.tier)} {activeKeyObj.tier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                      <span className="text-gray-500 uppercase font-bold text-[9px] font-mono">Duration</span>
                      <span className="text-white font-mono font-semibold">{activeKeyObj.duration}</span>
                    </div>

                    {/* IP Lock & Auto lock section */}
                    <div className="space-y-3.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 uppercase font-bold text-[9px] font-mono">Database IP Lock</span>
                        {(!activeKeyObj.ip || activeKeyObj.ip === '0.0.0.0' || activeKeyObj.ip === '') ? (
                          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase animate-pulse">
                            ⚡ Auto-Lock Enabled
                          </span>
                        ) : (
                          <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                            🔒 {activeKeyObj.ip}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        <strong>Automatic Setup (Consigliato):</strong> Lascia l'IP vuoto o imposta "0.0.0.0". 
                        L'anticheat collegherà la licenza in automatico al primo avvio del tuo server FiveM prendendo il suo IP pubblico!
                      </p>

                      {/* Edit IP Lock Form */}
                      <form onSubmit={handleSaveIpLock} className="space-y-2 pt-1 border-t border-zinc-850/60">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono block">
                          Imposta IP manualmente (Opzionale)
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="setup-ip-input"
                            type="text"
                            placeholder="es. 185.223.15.42 o 0.0.0.0 per auto-lock"
                            value={manualIp}
                            onChange={(e) => setManualIp(e.target.value)}
                            className="flex-1 bg-[#121118] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500"
                          />
                          <button
                            id="setup-ip-submit-btn"
                            type="submit"
                            disabled={isUpdatingIp}
                            className="bg-purple-850 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            {isUpdatingIp ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Save'}
                          </button>
                        </div>
                      </form>

                      {/* Feedback for IP saving */}
                      <AnimatePresence mode="wait">
                        {ipUpdateStatus.type && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-2 rounded text-[10px] border ${
                              ipUpdateStatus.type === 'success' 
                                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-950/20 border-rose-500/20 text-rose-400'
                            }`}
                          >
                            {ipUpdateStatus.message}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl space-y-2">
                <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="text-xs text-gray-400">Non hai licenze attive riscattate.</p>
                <p className="text-[10px] text-gray-600">Inserisci una chiave Tebex o Discord nel tab "Redeem" prima.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Config File Generator Block */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6">
          <div className="bg-[#050507] border border-[#1b1525] rounded-xl flex flex-col h-full overflow-hidden shadow-2xl flex-1">
            
            {/* File header tab */}
            <div className="bg-[#0b0a0e] px-4 py-3 border-b border-[#1b1525] flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" /> file di configurazione: config.lua
              </span>
              <button
                id="btn-copy-config-lua"
                onClick={handleCopyConfig}
                className="text-[10px] bg-purple-950/40 border border-purple-500/20 hover:bg-purple-900/40 text-purple-300 font-mono font-bold px-3 py-1 rounded flex items-center gap-1 transition cursor-pointer"
              >
                {copiedConfig ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400 font-bold" /> Copiato!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copia Codice
                  </>
                )}
              </button>
            </div>

            {/* Code Block Content */}
            <div className="flex-1 p-5 bg-[#040406] font-mono text-xs overflow-x-auto select-all leading-relaxed whitespace-pre min-h-[250px] text-gray-300">
              {generatedConfigLua}
            </div>

            <div className="bg-[#0b0a0e] px-4 py-3 border-t border-[#1b1525] text-[10px] text-gray-500 font-mono">
              Salva questo codice come <strong className="text-gray-300">config.lua</strong> all'interno della risorsa <strong className="text-gray-300">powerac/</strong> sul tuo server FiveM.
            </div>
          </div>
        </div>
      </div>

      {/* Main Files Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Zip Download */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-center text-purple-400">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Scarica Risorsa FiveM (Core ZIP)</h3>
                <p className="text-xs text-gray-500">Contiene gli script core lua per il tuo server.</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pt-2">
              Pacchetto pronto per l'avvio con server_scripts configurati e i file principali per caricare dinamicamente le impostazioni anticheat in tempo reale.
            </p>
          </div>

          <div className="pt-2">
            <button 
              id="btn-download-core-zip"
              onClick={() => alert('Download simulato avviato correttamente. Puoi anche ispezionare la cartella "fivem-resource" nel workspace per vedere i file reali!')}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Core Resource ZIP (v2.0)
            </button>
          </div>
        </div>

        {/* Server CFG code append */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" /> Avvio automatico: server.cfg
            </h3>
            <p className="text-xs text-gray-500">
              Aggiungi questa riga nel file <code className="text-gray-300 font-mono">server.cfg</code> del tuo FXServer per caricare la risorsa all'avvio.
            </p>

            <div className="bg-[#121118] border border-[#272036] rounded-lg p-3.5 flex items-center justify-between mt-2.5">
              <code className="text-xs text-purple-400 font-mono">{installCommand}</code>
              <button 
                id="btn-copy-install-cmd"
                onClick={handleCopyCmd}
                className="text-gray-500 hover:text-white transition cursor-pointer"
              >
                {copiedCmd === 'install' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 flex items-start gap-1.5 pt-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Assicurati di rinominare la cartella in <code className="text-gray-300 font-mono">powerac</code> senza spazi o caratteri speciali.</span>
          </p>
        </div>

      </div>

      {/* Setup Guide Steps */}
      <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6">
        <h3 className="text-white font-semibold text-base font-display mb-6">Guida Completa all'Installazione</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-950/50 border border-purple-900/50 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              1
            </div>
            <h4 className="text-sm font-semibold text-gray-200">1. Riscatta Licenza</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Copia il codice licenza ricevuto via bot Discord o Tebex ed effettua il <strong className="text-purple-400">Redeem</strong> associandolo a un server virtuale.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-950/50 border border-purple-900/50 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              2
            </div>
            <h4 className="text-sm font-semibold text-gray-200">2. Crea i File</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Estrai i file ZIP nella cartella <code className="text-gray-300">resources/powerac</code> del tuo server. Salva il file <code className="text-gray-300">config.lua</code> generato sopra in questa cartella.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-950/50 border border-purple-900/50 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              3
            </div>
            <h4 className="text-sm font-semibold text-gray-200">3. Avvio & Auto-IP</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Lascia l'IP a <code className="text-gray-300">0.0.0.0</code> sul pannello. Quando avvierai il server FiveM, questo si autenticherà bloccando in automatico il proprio IP pubblico sul database!
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-950/50 border border-purple-900/50 text-purple-400 flex items-center justify-center font-mono font-bold text-xs">
              4
            </div>
            <h4 className="text-sm font-semibold text-gray-200">4. Monitora i Log</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Se la verifica è positiva, vedrai l'anticheat avviarsi nel server. Tutti i log dei cheat o connessioni verranno sincronizzati in diretta sui tab del sito!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
