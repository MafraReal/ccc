import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Send, Play, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { ConsoleLog } from '../types';
import { motion } from 'motion/react';

interface ConsoleTabProps {
  logs: ConsoleLog[];
  onClearLogs: () => void;
  onSendCommand: (cmdText: string) => void;
}

export default function ConsoleTab({ logs, onClearLogs, onSendCommand }: ConsoleTabProps) {
  const [cmdInput, setCmdInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll terminal to bottom on new log lines
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    onSendCommand(cmdInput);
    setCmdInput('');
  };

  const getLogColorClass = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'info': return 'text-sky-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-rose-400 font-bold';
      case 'success': return 'text-emerald-400';
    }
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'info': return <Info className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
    }
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
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">RCON Console</h2>
          <p className="text-sm text-gray-400 mt-1">
            Live FXServer anticheat hooks streaming outputs and administrative command triggers.
          </p>
        </div>

        <button
          id="btn-clear-terminal"
          onClick={onClearLogs}
          className="bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white border border-zinc-800 font-medium py-2 px-3 rounded-lg flex items-center gap-1.5 transition text-xs cursor-pointer self-start"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Console
        </button>
      </div>

      {/* Terminal Display */}
      <div className="bg-[#050507] border border-[#1b1525] rounded-xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
        {/* Terminal Header Bar */}
        <div className="bg-[#0b0a0e] px-4 py-3 border-b border-[#1b1525] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" /> RCON Stream @ powerac_server_main
            </span>
          </div>
          <span className="text-[10px] bg-emerald-900/20 text-emerald-400 px-2.5 py-0.5 rounded font-mono font-bold border border-emerald-500/10">Connected</span>
        </div>

        {/* Scrollable logs list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2.5 font-mono text-xs select-text">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 py-1 px-1.5 rounded transition">
              <span className="text-gray-600 shrink-0 font-light select-none">{log.timestamp}</span>
              <div className="flex items-center gap-1.5">
                {getLogIcon(log.type)}
                <span className={`${getLogColorClass(log.type)}`}>
                  {log.message}
                </span>
              </div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Form */}
        <form onSubmit={handleSubmitCommand} className="border-t border-[#1b1525] p-3 bg-[#0a090d] flex gap-2">
          <div className="flex-1 relative flex items-center">
            <span className="text-purple-400 font-mono text-xs absolute left-3 select-none">{'>'}</span>
            <input
              id="console-command-input"
              type="text"
              placeholder="Enter RCON command (e.g., powerac status, ban player-name, reload)..."
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              className="w-full bg-[#050507] border border-[#231b30] rounded-lg pl-7 pr-4 py-2.5 text-xs text-purple-300 placeholder-zinc-700 font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-900"
            />
          </div>
          <button
            id="btn-send-command"
            type="submit"
            className="bg-purple-800 hover:bg-purple-700 text-white px-4 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Suggested helper operations */}
      <div className="bg-[#0b0a0f] border border-zinc-900 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide font-mono mb-3">Suggested Quick Commands</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Check Status', cmd: 'powerac status' },
            { label: 'Reload Detections', cmd: 'powerac reload' },
            { label: 'Clear Banned List', cmd: 'powerac clear_bans' },
            { label: 'Sync License Key', cmd: 'powerac sync_license' }
          ].map((item, index) => (
            <button
              id={`suggest-btn-${index}`}
              key={index}
              onClick={() => onSendCommand(item.cmd)}
              className="bg-zinc-950 hover:bg-zinc-900 text-gray-300 hover:text-white border border-zinc-900 px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <Play className="w-2.5 h-2.5 text-purple-400" /> {item.cmd}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
