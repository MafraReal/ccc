import React, { useState } from 'react';
import { Sliders, Save, ShieldAlert, Key, Webhook, Zap, Settings, RefreshCw } from 'lucide-react';
import { AnticheatConfig } from '../types';
import { motion } from 'motion/react';

interface ConfigurationTabProps {
  config: AnticheatConfig;
  onSaveConfig: (updatedConfig: AnticheatConfig) => void;
}

export default function ConfigurationTab({ config, onSaveConfig }: ConfigurationTabProps) {
  const [localConfig, setLocalConfig] = useState<AnticheatConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key: keyof Omit<AnticheatConfig, 'discordLogWebhook' | 'detectionSensitivity'>) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSaveConfig(localConfig);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Configuration</h2>
        <p className="text-sm text-gray-400 mt-1">Adjust real-time detection matrices, severity sensitivity and log channels.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Protection Flags Controls */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e1e24] pb-4">
            <h3 className="text-white font-semibold text-base font-display">Detection Rules</h3>
            <span className="text-[10px] text-gray-500 font-mono">Select specific vectors to block</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rule 1 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti Noclip Detection</h4>
                <p className="text-[10px] text-gray-500 mt-1">Blocks player velocity bypasses</p>
              </div>
              <button
                type="button"
                id="toggle-antiNoclip"
                onClick={() => handleToggle('antiNoclip')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiNoclip ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiNoclip ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti Spectate Camera</h4>
                <p className="text-[10px] text-gray-500 mt-1">Stops camera hacking vectors</p>
              </div>
              <button
                type="button"
                id="toggle-antiSpectate"
                onClick={() => handleToggle('antiSpectate')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiSpectate ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiSpectate ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti weapon-give Hack</h4>
                <p className="text-[10px] text-gray-500 mt-1">Intercepts illegal gun spawning</p>
              </div>
              <button
                type="button"
                id="toggle-antiGiveWeapon"
                onClick={() => handleToggle('antiGiveWeapon')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiGiveWeapon ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiGiveWeapon ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Rule 4 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti CheatEngine Speed</h4>
                <p className="text-[10px] text-gray-500 mt-1">Mitigates process memory speeds</p>
              </div>
              <button
                type="button"
                id="toggle-antiCheatEngine"
                onClick={() => handleToggle('antiCheatEngine')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiCheatEngine ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiCheatEngine ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Rule 5 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti Trigger Event Protection</h4>
                <p className="text-[10px] text-gray-500 mt-1">Shields server-side API endpoints</p>
              </div>
              <button
                type="button"
                id="toggle-antiTriggerEvent"
                onClick={() => handleToggle('antiTriggerEvent')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiTriggerEvent ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiTriggerEvent ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Rule 6 */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-200">Anti Vehicle Spawn Spam</h4>
                <p className="text-[10px] text-gray-500 mt-1">Restricts rapid entity instantiation</p>
              </div>
              <button
                type="button"
                id="toggle-antiVehicleSpam"
                onClick={() => handleToggle('antiVehicleSpam')}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${localConfig.antiVehicleSpam ? 'bg-purple-600' : 'bg-zinc-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${localConfig.antiVehicleSpam ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Global Settings Side Block (Webhooks + Sensitivity) */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400" /> Server Global Hooks
            </h3>

            {/* Discord logger webhook field */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono flex items-center gap-1">
                <Webhook className="w-3 h-3" /> Discord Log Webhook
              </label>
              <input
                id="config-webhook"
                type="text"
                placeholder="https://discord.com/api/webhooks/..."
                value={localConfig.discordLogWebhook}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, discordLogWebhook: e.target.value }))}
                className="w-full bg-[#121118] border border-[#27272a] rounded-lg px-3.5 py-2.5 text-xs text-white font-mono placeholder-gray-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Sensitivity slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono">
                <span className="font-bold tracking-wider text-gray-500">Detection Sensitivity</span>
                <span className="text-purple-400 font-bold">{localConfig.detectionSensitivity} / 10</span>
              </div>
              <input
                id="config-sensitivity"
                type="range"
                min="1"
                max="10"
                value={localConfig.detectionSensitivity}
                onChange={(e) => setLocalConfig(prev => ({ ...prev, detectionSensitivity: Number(e.target.value) }))}
                className="w-full accent-purple-600 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[9px] text-gray-500 leading-normal">
                Higher sensitivity limits trigger velocities more strictly but may lead to false positives on lagging connections. Recommended: 7.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-2 border-t border-[#1e1e24] pt-4">
            <button
              id="btn-save-config"
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900/40 text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-200" /> Saving configuration...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </>
              )}
            </button>

            {saveSuccess && (
              <p className="text-center text-[11px] text-emerald-400 font-medium">
                ✓ Server configuration saved and synchronized!
              </p>
            )}
          </div>

        </div>

      </form>
    </motion.div>
  );
}
