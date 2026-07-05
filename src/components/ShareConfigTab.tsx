import React, { useState } from 'react';
import { Share2, Code, Copy, Check, UploadCloud, RefreshCw, FileText } from 'lucide-react';
import { AnticheatConfig } from '../types';
import { motion } from 'motion/react';

interface ShareConfigTabProps {
  config: AnticheatConfig;
}

export default function ShareConfigTab({ config }: ShareConfigTabProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const configJson = JSON.stringify({
    powerac_version: "2.4.1",
    protection_matrix: {
      anti_noclip: config.antiNoclip,
      anti_spectate: config.antiSpectate,
      anti_weapon_give: config.antiGiveWeapon,
      anti_cheat_engine: config.antiCheatEngine,
      anti_trigger_event: config.antiTriggerEvent,
      anti_vehicle_spam: config.antiVehicleSpam,
      sensitivity_level: config.detectionSensitivity
    },
    webhook_settings: {
      active: !!config.discordLogWebhook,
      rate_limit: "30s"
    }
  }, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(configJson);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText("https://poweranticheat.com/share/cfg-222a-99b1");
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Share Config</h2>
        <p className="text-sm text-gray-400 mt-1">Export your fine-tuned rules as raw JSON, or grab a fast-loading community share link.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Json Viewer */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-base flex items-center gap-2">
                <Code className="w-4.5 h-4.5 text-purple-400" /> Export JSON
              </h3>
              <button
                id="btn-copy-json"
                onClick={handleCopyJson}
                className="bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>

            <pre className="bg-[#050507] border border-zinc-900 rounded-xl p-4 overflow-x-auto text-[11px] font-mono text-purple-300 leading-normal max-h-96">
              <code>{configJson}</code>
            </pre>
          </div>
        </div>

        {/* Right Side: Community Export Link */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <Share2 className="w-4.5 h-4.5 text-purple-400" /> Shareable URL
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Generate a fast import hash to easily paste into your server’s command prompt or share with other server directors.
            </p>

            <div className="bg-[#121118] border border-[#272036] rounded-xl p-3.5 flex items-center justify-between">
              <code className="text-xs text-purple-400 font-mono">cfg-222a-99b1</code>
              <button 
                id="btn-copy-share"
                onClick={handleCopyShareLink}
                className="text-gray-500 hover:text-white transition cursor-pointer"
              >
                {copiedShareLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="border-t border-[#1e1e24] pt-4">
            <button
              id="btn-import-cfg"
              onClick={() => alert("Simulation: Community JSON Import drawer is ready to read raw configurations.")}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs"
            >
              <UploadCloud className="w-4 h-4 text-purple-400" /> Import Community Config
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
