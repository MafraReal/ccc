import React, { useState } from 'react';
import { Settings, Shield, User, Webhook, RefreshCw, CheckCircle2, Key } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsTab() {
  const [profileName, setProfileName] = useState('David Ceras');
  const [discordLinked, setDiscordLinked] = useState('david_c#9999');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookStatus('Dispatch simulation success! Check your test channel for the Power Anticheat green card.');
      setTimeout(() => setWebhookStatus(null), 4000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Settings</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your customer profile, API integrations, and discord synchronization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 space-y-5">
          <h3 className="text-white font-semibold text-base font-display flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-purple-400" /> Account Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">User Handle</label>
              <input
                id="profile-name-input"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-[#121118] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Linked Discord Profile</label>
              <input
                id="profile-discord-input"
                type="text"
                value={discordLinked}
                onChange={(e) => setDiscordLinked(e.target.value)}
                className="w-full bg-[#121118] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Card */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-base font-display flex items-center gap-2">
              <Webhook className="w-4.5 h-4.5 text-purple-400" /> Discord Diagnostics
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Dispatch a mock security payload event payload down your webhook to test connection relays.
            </p>
          </div>

          <button
            id="btn-test-webhook"
            onClick={handleTestWebhook}
            disabled={isTestingWebhook}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Webhook className="w-3.5 h-3.5 text-purple-400" />} Test Webhook
          </button>

          {webhookStatus && (
            <p className="text-[10px] text-emerald-400 leading-normal text-center mt-2">
              ✓ {webhookStatus}
            </p>
          )}
        </div>

      </div>
    </motion.div>
  );
}
