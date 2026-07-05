import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Play, 
  Users, 
  Terminal, 
  Ban, 
  Sliders, 
  CheckCircle, 
  AlertOctagon, 
  Webhook, 
  Clock, 
  Plus, 
  HelpCircle,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerRecord, AnticheatConfig, ConsoleLog } from '../types';

interface SandboxTabProps {
  config: AnticheatConfig;
  players: PlayerRecord[];
  onSimulationComplete: (updatedBans: any[], updatedPlayers: any[], logs: ConsoleLog[]) => void;
}

export default function SandboxTab({ config, players, onSimulationComplete }: SandboxTabProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0]?.name || 'Anticheat_Tester');
  const [cheatType, setCheatType] = useState<string>('lua_executor');
  const [customPlayerName, setCustomPlayerName] = useState<string>('');
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const cheatOptions = [
    { 
      id: 'lua_executor', 
      name: 'Lua Executor Injection', 
      desc: 'Simulates executing a forbidden trigger event, e.g., triggerServerEvent("adminMenu")', 
      policyKey: 'antiTriggerEvent',
      policyName: 'Anti-Trigger Event',
      severity: 'Critical',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'noclip', 
      name: 'NoClip / Fly Hack', 
      desc: 'Simulates flying at speeds exceeding 150 km/h horizontally without a vehicle', 
      policyKey: 'antiNoclip',
      policyName: 'Anti-Noclip Protection',
      severity: 'High',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'give_weapon', 
      name: 'Illegal Weapon Spawner', 
      desc: 'Simulates spawning unauthorized heavy weaponry hash: WEAPON_RPG', 
      policyKey: 'antiGiveWeapon',
      policyName: 'Anti-Give Weapon',
      severity: 'High',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'spectate', 
      name: 'Spectate Mode Bypass', 
      desc: 'Simulates attempts to bypass client network camera bounds to spy on players', 
      policyKey: 'antiSpectate',
      policyName: 'Anti-Spectate Bypass',
      severity: 'Medium',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'cheat_engine', 
      name: 'Memory Hack (Cheat Engine)', 
      desc: 'Simulates altering local health or stamina memory values locally', 
      policyKey: 'antiCheatEngine',
      policyName: 'Anti-Cheat Engine',
      severity: 'Critical',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'vehicle_spam', 
      name: 'Vehicle Spawner Spam', 
      desc: 'Simulates spawning more than 10 vehicles in a timeframe of 2 seconds', 
      policyKey: 'antiVehicleSpam',
      policyName: 'Anti-Vehicle Spam',
      severity: 'Medium',
      action: 'Automatic Permanent Ban'
    },
    { 
      id: 'ping_spike', 
      name: 'Ping Spike warning (Simulate lag)', 
      desc: 'Simulates client packet loss resulting in heavy latency warnings in logs', 
      policyKey: null,
      policyName: 'Basic Connection Monitoring',
      severity: 'Low',
      action: 'Log Warning Alert'
    }
  ];

  const currentCheat = cheatOptions.find(o => o.id === cheatType) || cheatOptions[0];
  const targetPlayerObj = players.find(p => p.name === selectedPlayer) || {
    id: 'sim-99',
    name: selectedPlayer,
    steamId: 'steam:11000018f99ab21',
    discord: 'simulated_user#9999',
    hardwareId: 'hw:8fa92bf...',
    ping: 24,
    joinTime: 'Just now'
  };

  // Check if the specific policy is enabled in the live Dashboard configuration
  const isPolicyEnabled = currentCheat.policyKey 
    ? (config as any)[currentCheat.policyKey] !== false 
    : true;

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimulationResult(null);
    setSimLogs([]);

    const addLogLine = (text: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setSimLogs(prev => [...prev, text]);
          resolve();
        }, delay);
      });
    };

    // Step-by-step visual terminal animation
    await addLogLine(`[0.0s] 🟢 Virtual Server Sandbox booting... Connection link: ESTABLISHED`, 0);
    await addLogLine(`[0.4s] 🔍 Initializing virtual Player Agent: [${targetPlayerObj.name}]`, 350);
    await addLogLine(`[0.8s] 🔑 Checking PowerAC cloud license for linked server... LICENSE ACTIVE`, 400);
    await addLogLine(`[1.2s] ⚙️ Syncing active configuration matrix (Detection Sensitivity: ${config.detectionSensitivity}/10)`, 400);
    
    setSimStep(2);
    if (currentCheat.policyKey) {
      await addLogLine(`[1.6s] 🛡️ Evaluating policy: [${currentCheat.policyName}] ... Status: ${isPolicyEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`, 400);
    } else {
      await addLogLine(`[1.6s] 📊 Evaluating general performance metrics...`, 400);
    }

    setSimStep(3);
    await addLogLine(`[2.2s] ⚡ INJECTING CHEAT ATTEMPT: "${currentCheat.name}" on virtual player...`, 600);

    setSimStep(4);
    if (isPolicyEnabled) {
      await addLogLine(`[2.8s] 🚨 [ALERT TRIGGERED] PowerAC Intercepted malicious activity!`, 600);
      await addLogLine(`[3.2s] 📜 Vector matched pattern code: PAC_DET_HASH_2026_${currentCheat.id.toUpperCase()}`, 400);
      
      setSimStep(5);
      await addLogLine(`[3.8s] ⚡ Action Dispatched: ${currentCheat.action}`, 600);
      
      setSimStep(6);
      await addLogLine(`[4.2s] 🌐 Sychronizing database and dispatching Discord embed webhook alerts...`, 450);
    } else {
      await addLogLine(`[2.8s] ⚠️ [BYPASSED] Player executed cheat but policy "${currentCheat.policyName}" is DISABLED in your Dashboard Config.`, 600);
      await addLogLine(`[3.2s] 📊 Log generated: Cheat flagged but no automated ban dispatched.`, 400);
      setSimStep(5);
    }

    // Connect with backend to save database logs and ban if necessary
    try {
      const response = await fetch('/api/sandbox/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: targetPlayerObj.name,
          steamId: targetPlayerObj.steamId,
          discord: targetPlayerObj.discord,
          cheatType: currentCheat.name,
          reason: isPolicyEnabled ? `Triggered protection policy: ${currentCheat.name}` : `Bypassed disabled policy: ${currentCheat.name}`,
          configUsed: config
        })
      });

      const data = await response.json();
      if (data.success) {
        // Callback to App.tsx to update live list state
        onSimulationComplete(data.bans, data.activePlayers, data.logs);
        setSimulationResult({
          status: 'success',
          actionTaken: isPolicyEnabled ? currentCheat.action : 'Logged Flag',
          isBanned: isPolicyEnabled && currentCheat.id !== 'ping_spike',
          details: data
        });
      }
    } catch (err) {
      console.error('Error recording simulation results:', err);
      await addLogLine(`[Error] Failed to write simulation results to the database.json filesystem.`, 100);
    }

    setSimStep(7);
  };

  const handleAddCustomPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPlayerName.trim()) return;
    setSelectedPlayer(customPlayerName.trim());
    setIsCreatingCustom(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Anticheat Sandbox</h2>
        <p className="text-sm text-gray-400 mt-1">
          Test and verify PowerAC's detection engine rules, logs, and RCON bans instantly without booting a live FiveM server.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-5 md:p-6 space-y-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-zinc-850 pb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Simulator Setup</h3>
                <p className="text-xs text-gray-400">Configure target details & cheat vectors</p>
              </div>
            </div>

            {/* Target Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-300 font-mono flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" /> Target Player
                </label>
                <button
                  id="btn-toggle-custom-player"
                  onClick={() => setIsCreatingCustom(!isCreatingCustom)}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> {isCreatingCustom ? 'Select Active' : 'Custom Name'}
                </button>
              </div>

              {isCreatingCustom ? (
                <form onSubmit={handleAddCustomPlayer} className="flex gap-2">
                  <input
                    id="custom-player-input"
                    type="text"
                    value={customPlayerName}
                    onChange={(e) => setCustomPlayerName(e.target.value)}
                    placeholder="Enter player name (e.g. Cheater_Bob)..."
                    className="flex-1 bg-[#121216] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-100 placeholder-zinc-700 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    id="btn-confirm-custom-player"
                    type="submit"
                    className="bg-purple-800 hover:bg-purple-700 text-white font-mono px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Set
                  </button>
                </form>
              ) : (
                <select
                  id="select-sim-player"
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full bg-[#121216] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-purple-500 font-mono cursor-pointer"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.name}>
                      👤 {p.name} ({p.discord.split('#')[0]})
                    </option>
                  ))}
                  {/* Standby simulator custom player if list empty */}
                  {players.length === 0 && (
                    <option value="Anticheat_Tester">👤 Anticheat_Tester (tester#0001)</option>
                  )}
                  {!players.some(p => p.name === selectedPlayer) && selectedPlayer !== 'Anticheat_Tester' && (
                    <option value={selectedPlayer}>👤 {selectedPlayer} (Custom Target)</option>
                  )}
                </select>
              )}

              {/* Target Metadata Badge Info */}
              <div className="bg-[#050507] rounded-lg p-3 border border-zinc-900 text-[10px] font-mono text-gray-400 space-y-1">
                <div><span className="text-gray-500 font-bold uppercase">Steam Hex:</span> {targetPlayerObj.steamId}</div>
                <div><span className="text-gray-500 font-bold uppercase">HWID Hash:</span> {targetPlayerObj.hardwareId}</div>
                <div><span className="text-gray-500 font-bold uppercase">Discord tag:</span> {targetPlayerObj.discord}</div>
              </div>
            </div>

            {/* Hack Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-300 font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> Cheat Attack Vector
              </label>
              <div className="space-y-2">
                {cheatOptions.map(opt => (
                  <label 
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left cursor-pointer transition ${
                      cheatType === opt.id 
                        ? 'bg-purple-950/20 border-purple-500/50 text-purple-200' 
                        : 'bg-[#121216] border-zinc-900 text-gray-400 hover:border-zinc-800'
                    }`}
                  >
                    <input
                      id={`radio-cheat-${opt.id}`}
                      type="radio"
                      name="cheatType"
                      value={opt.id}
                      checked={cheatType === opt.id}
                      onChange={() => setCheatType(opt.id)}
                      className="mt-0.5 accent-purple-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-200 block font-mono">{opt.name}</span>
                      <p className="text-[10px] leading-tight text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Simulated Live Config Validation Policy Card */}
            <div className="bg-[#121216]/50 border border-zinc-850 rounded-lg p-4 space-y-2 text-xs">
              <h4 className="font-semibold text-gray-300 font-mono flex items-center gap-1.5">
                🛡️ Live Dashboard Rule Check
              </h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                The Sandbox reads your actual <span className="text-purple-400">Configuration</span> tab settings. 
                Disabling a feature there will bypass the automatic ban here, mimicking how FiveM servers communicate.
              </p>
              <div className="flex items-center justify-between border-t border-zinc-850 pt-2 mt-2">
                <span className="text-gray-400 text-[10px] uppercase font-mono font-bold">{currentCheat.policyName} Policy:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isPolicyEnabled 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                }`}>
                  {isPolicyEnabled ? 'ACTIVE (BAN ENFORCED)' : 'INACTIVE (BYPASS ALLOWED)'}
                </span>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              id="btn-trigger-simulation"
              onClick={runSimulation}
              disabled={isSimulating}
              className={`w-full bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-gray-500 font-display font-extrabold text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-[0.98]`}
            >
              <Play className="w-4 h-4 fill-current" /> {isSimulating ? 'SIMULATING HACK ATTEMPT...' : 'LAUNCH SIMULATED ATTACK ⚡'}
            </button>
          </div>
        </div>

        {/* Right Column: Virtual Terminal Screen */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6">
          <div className="bg-[#050507] border border-[#1b1525] rounded-xl flex flex-col h-full min-h-[500px] overflow-hidden shadow-2xl flex-1">
            
            {/* Screen Header Bar */}
            <div className="bg-[#0b0a0e] px-4 py-3 border-b border-[#1b1525] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider ml-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> PowerAC Virtual Game Server Engine
                </span>
              </div>
              <span className="text-[10px] bg-purple-900/20 text-purple-400 px-2.5 py-0.5 rounded font-mono font-bold border border-purple-500/10">Virtual Sandbox</span>
            </div>

            {/* Simulator Output Screen */}
            <div className="flex-1 p-6 flex flex-col bg-[#040406] font-mono text-xs overflow-y-auto min-h-[350px] relative">
              
              {!isSimulating && !simulationResult ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-center text-purple-500 shadow-inner">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-sm font-semibold text-white uppercase font-mono">Sandbox Standby</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Select a virtual player and a cheat vector to launch an attack. You will see real-time execution step logs, network packet validation, and dynamic dashboard sync results.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status Grid Steps */}
                  <div className="grid grid-cols-5 gap-2 border-b border-zinc-900 pb-4">
                    {[
                      { step: 1, label: 'Init' },
                      { step: 2, label: 'Policy' },
                      { step: 3, label: 'Inject' },
                      { step: 4, label: 'Analysis' },
                      { step: 5, label: 'Response' }
                    ].map((stepObj) => {
                      const isActive = simStep >= stepObj.step;
                      const isCompleted = simStep > stepObj.step;
                      return (
                        <div 
                          key={stepObj.step}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                            isActive 
                              ? isCompleted 
                                ? 'bg-purple-950/10 border-purple-500/30 text-purple-400' 
                                : 'bg-purple-800 border-purple-600 text-white font-bold animate-pulse'
                              : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider">{stepObj.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Log Lines Stream */}
                  <div className="space-y-2 min-h-[160px]">
                    {simLogs.map((logLine, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={index} 
                        className={`leading-relaxed text-[11px] ${
                          logLine.includes('🚨') || logLine.includes('BANNED') 
                            ? 'text-rose-400 font-bold' 
                            : logLine.includes('🟢') || logLine.includes('SUCCESS')
                            ? 'text-emerald-400'
                            : logLine.includes('⚡')
                            ? 'text-purple-400'
                            : logLine.includes('⚠️')
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {logLine}
                      </motion.div>
                    ))}
                  </div>

                  {/* Final simulation summary result card */}
                  <AnimatePresence>
                    {simulationResult && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0b0b0f] border border-zinc-850 rounded-xl p-5 mt-6 space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          {simulationResult.isBanned ? (
                            <div className="w-10 h-10 rounded-full bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-rose-400">
                              <Ban className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-950/50 border border-amber-500/40 flex items-center justify-center text-amber-400">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                              Simulation Result: {simulationResult.isBanned ? 'PLAYER PERMANENTLY BANNED' : 'WARNING LOGGED'}
                            </h4>
                            <p className="text-[10px] text-gray-500">
                              Synchronized with dashboard data filesystem successfully!
                            </p>
                          </div>
                        </div>

                        {/* Result Specs List */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-b border-zinc-850/60 py-3 text-[10px] text-gray-400">
                          <div>
                            <span className="text-gray-500 block uppercase font-bold">Target</span>
                            <span className="text-white font-bold">{targetPlayerObj.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block uppercase font-bold">Action Dispatched</span>
                            <span className={`font-bold ${simulationResult.isBanned ? 'text-rose-400' : 'text-amber-400'}`}>
                              {simulationResult.actionTaken}
                            </span>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <span className="text-gray-500 block uppercase font-bold">Discord Integration</span>
                            <span className="text-white flex items-center gap-1">
                              <Webhook className="w-3 h-3 text-purple-400 shrink-0" /> Alert sent to webhook
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400">Where to check the results next:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-[#121216]/60 rounded p-2 border border-zinc-900 text-[10px] leading-relaxed">
                              <span className="font-bold text-gray-300 block">📊 Check Bans Tab</span>
                              The player <span className="text-white font-bold">"{targetPlayerObj.name}"</span> is now registered in the global ban database with full ID hashes.
                            </div>
                            <div className="bg-[#121216]/60 rounded p-2 border border-zinc-900 text-[10px] leading-relaxed">
                              <span className="font-bold text-gray-300 block">📟 Check Console Tab</span>
                              Real-time packet logs and the RCON punishment trace have been appended to the stream log.
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Webhook Log Card */}
            <div className="bg-[#0b0a0e] p-4 border-t border-[#1b1525] flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Discord webhook simulation URL link:</span>
                <span className="text-zinc-600 truncate max-w-xs">{config.discordLogWebhook}</span>
              </div>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1 select-none">
                <Clock className="w-3.5 h-3.5" /> Live synchronization enabled
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
