import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';

// Tabs
import DashboardTab from './components/DashboardTab';
import RedeemTab from './components/RedeemTab';
import DownloadTab from './components/DownloadTab';
import ShareConfigTab from './components/ShareConfigTab';
import SettingsTab from './components/SettingsTab';
import BansTab from './components/BansTab';
import ConfigurationTab from './components/ConfigurationTab';
import AdminsTab from './components/AdminsTab';
import ConsoleTab from './components/ConsoleTab';
import PlayersTab from './components/PlayersTab';
import EconomyTab from './components/EconomyTab';
import MapTab from './components/MapTab';
import MetricsTab from './components/MetricsTab';
import SandboxTab from './components/SandboxTab';

// Mock values
import { 
  INITIAL_SERVERS, 
  INITIAL_KEYS, 
  INITIAL_BANS, 
  INITIAL_PLAYERS, 
  INITIAL_CONSOLE_LOGS, 
  INITIAL_CONFIG 
} from './data/mockData';
import { FiveMServer, LicenseKey, BanRecord, PlayerRecord, ConsoleLog, AnticheatConfig, User } from './types';
import { ShieldCheck, Menu, X, Plus, Terminal, RefreshCw, AlertTriangle, Server } from 'lucide-react';
import AuthPage from './components/AuthPage';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('powerac_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [servers, setServers] = useState<FiveMServer[]>([]);
  const [selectedServer, setSelectedServer] = useState<FiveMServer>(null as any);
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [bans, setBans] = useState<BanRecord[]>([]);
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [config, setConfig] = useState<AnticheatConfig>(INITIAL_CONFIG);
  const [admins, setAdmins] = useState<any[]>([]);
  const [unredeemedKeys, setUnredeemedKeys] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>('redeem'); // Default is Redeem as in user's image
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Server Creator Modal States
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIp, setNewServerIp] = useState('0.0.0.0:30120');
  const [createServerLoading, setCreateServerLoading] = useState(false);
  const [createServerError, setCreateServerError] = useState('');

  // --- Real Backend Synchronization ---
  useEffect(() => {
    if (!user) return; // Wait until authenticated

    const fetchAllData = async () => {
      try {
        const query = `?userId=${user.id}`;
        const serverId = selectedServer?.id;
        const serverQuery = serverId ? `&serverId=${serverId}` : '';

        if (!serverId) {
          // If no server is selected, clear server-specific state
          setBans([]);
          setPlayers([]);
          setConsoleLogs([]);
          setAdmins([]);
          setConfig(INITIAL_CONFIG);

          // Still fetch servers and keys for this user
          const [resKeys, resServers] = await Promise.all([
            fetch(`/api/keys${query}`),
            fetch(`/api/servers${query}`)
          ]);

          const [dataKeys, dataServers] = await Promise.all([
            resKeys.json(),
            resServers.json()
          ]);

          if (dataKeys.success) {
            setKeys(dataKeys.keys);
            setUnredeemedKeys(dataKeys.unredeemedKeys || []);
          }
          if (dataServers.success) {
            setServers(dataServers.servers);
            if (dataServers.servers.length > 0) {
              setSelectedServer(dataServers.servers[0]);
            } else {
              setSelectedServer(null as any);
            }
          }
          return;
        }

        const [resKeys, resServers, resBans, resConfig, resConsole, resPlayers, resAdmins] = await Promise.all([
          fetch(`/api/keys${query}`),
          fetch(`/api/servers${query}`),
          fetch(`/api/bans?userId=${user.id}${serverQuery}`),
          fetch(`/api/config?userId=${user.id}${serverQuery}`),
          fetch(`/api/console?userId=${user.id}${serverQuery}`),
          fetch(`/api/players?userId=${user.id}${serverQuery}`),
          fetch(`/api/admins?userId=${user.id}${serverQuery}`)
        ]);

        const [dataKeys, dataServers, dataBans, dataConfig, dataConsole, dataPlayers, dataAdmins] = await Promise.all([
          resKeys.json(),
          resServers.json(),
          resBans.json(),
          resConfig.json(),
          resConsole.json(),
          resPlayers.json(),
          resAdmins.json()
        ]);

        if (dataKeys.success) {
          setKeys(dataKeys.keys);
          setUnredeemedKeys(dataKeys.unredeemedKeys || []);
        }
        if (dataServers.success) {
          setServers(dataServers.servers);
          if (dataServers.servers.length > 0) {
            setSelectedServer(prev => {
              const exists = dataServers.servers.some((s: FiveMServer) => s.id === prev?.id);
              return exists ? prev : dataServers.servers[0];
            });
          } else {
            setSelectedServer(null as any);
          }
        }
        if (dataBans.success) setBans(dataBans.bans);
        if (dataConfig.success) setConfig(dataConfig.config);
        if (dataConsole.success) setConsoleLogs(dataConsole.logs);
        if (dataPlayers.success) setPlayers(dataPlayers.players);
        if (dataAdmins.success) setAdmins(dataAdmins.admins);
      } catch (err) {
        console.warn('Backend server error or standalone fallback.', err);
      }
    };

    fetchAllData();
    // Poll console logs and keys every 10 seconds to keep live with the Discord bot
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, [user, selectedServer?.id]);

  // --- Dynamic Operations ---

  // Redeem key routine
  const handleRedeemKey = async (input: string, serverId: string): Promise<{ success: boolean; message: string; key?: LicenseKey }> => {
    if (!user) return { success: false, message: 'Non sei autenticato.' };
    try {
      const response = await fetch('/api/keys/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyInput: input, serverId, userId: user.id })
      });
      const data = await response.json();
      
      if (data.success) {
        // Optimistic refresh
        setKeys(prev => [data.key, ...prev]);
        setUnredeemedKeys(prev => prev.filter(k => k.key.toUpperCase() !== input.trim().toUpperCase()));
        
        // Refresh console logs
        const consoleRes = await fetch('/api/console');
        const consoleData = await consoleRes.json();
        if (consoleData.success) setConsoleLogs(consoleData.logs);

        return {
          success: true,
          message: data.message,
          key: data.key
        };
      } else {
        return { success: false, message: data.message || 'Verification error' };
      }
    } catch (err) {
      console.error('Failed to redeem key on backend:', err);
      return { success: false, message: 'Server connection error during key verification.' };
    }
  };

  // Update IP lock for key
  const handleUpdateIP = async (key: string, ip: string) => {
    try {
      const response = await fetch('/api/keys/setip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, ip })
      });
      const data = await response.json();
      if (data.success) {
        // Update local keys list with the new IP
        setKeys(prev => prev.map(k => k.key.toUpperCase() === key.toUpperCase() ? { ...k, ip } : k));
        // Update servers list if returned
        if (data.servers) {
          setServers(data.servers);
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Error updating IP' };
      }
    } catch (err) {
      console.error('Failed to update IP lock on backend:', err);
      return { success: false, message: 'Server connection error.' };
    }
  };

  // Add Manual Unredeemed Key
  const handleAddUnredeemedKey = async (key: string, tier: string, duration: string) => {
    try {
      const response = await fetch('/api/keys/unredeemed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, tier, duration })
      });
      const data = await response.json();
      if (data.success) {
        setUnredeemedKeys(prev => [...prev, data.key]);
        return { success: true, message: 'Key registered successfully.' };
      } else {
        return { success: false, message: data.message || 'Error registering key' };
      }
    } catch (err) {
      console.error('Failed to add unredeemed key:', err);
      return { success: false, message: 'Server connection error.' };
    }
  };

  // Delete Manual Unredeemed Key
  const handleDeleteUnredeemedKey = async (key: string) => {
    try {
      const response = await fetch(`/api/keys/unredeemed/${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setUnredeemedKeys(prev => prev.filter(k => k.key !== key));
      }
    } catch (err) {
      console.error('Failed to delete unredeemed key:', err);
    }
  };

  // Add Manual Server Modal trigger
  const handleAddServer = () => {
    setNewServerName(`FiveM Server ${servers.length + 1}`);
    setNewServerIp('0.0.0.0:30120');
    setCreateServerError('');
    setShowCreateServerModal(true);
  };

  // Submit Server Creation
  const submitCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !newServerIp.trim()) {
      setCreateServerError('Tutti i campi sono obbligatori.');
      return;
    }

    setCreateServerLoading(true);
    setCreateServerError('');

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newServerName.trim(), 
          ip: newServerIp.trim(),
          userId: user?.id
        })
      });
      const data = await response.json();
      if (data.success) {
        setServers(prev => [...prev, data.server]);
        setSelectedServer(data.server);
        setShowCreateServerModal(false);
      } else {
        setCreateServerError(data.message || 'Errore nella creazione del server.');
      }
    } catch (err) {
      setCreateServerError('Errore di connessione al server.');
    } finally {
      setCreateServerLoading(false);
    }
  };

  // Toggle/Revoke Ban state
  const handleToggleBanStatus = async (id: string) => {
    // Optimistic update
    setBans(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));

    try {
      await fetch('/api/bans/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (err) {
      console.error('Failed to toggle ban status on backend:', err);
    }
  };

  // Add Manual Ban
  const handleAddBan = async (newBanData: Omit<BanRecord, 'id' | 'date'>) => {
    try {
      const response = await fetch('/api/bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBanData, serverId: selectedServer?.id })
      });
      const data = await response.json();
      if (data.success) {
        setBans(prev => [data.ban, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add ban record on backend:', err);
    }
  };

  // Configuration Save
  const handleSaveConfig = async (updatedConfig: AnticheatConfig) => {
    // Optimistic update
    setConfig(updatedConfig);

    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updatedConfig, serverId: selectedServer?.id })
      });
    } catch (err) {
      console.error('Failed to save configuration on backend:', err);
    }
  };

  // Send RCON Terminal Command
  const handleSendCommand = async (cmdText: string) => {
    const timestamp = new Date().toTimeString().slice(0, 8);
    const userLog: ConsoleLog = {
      id: 'usr-' + Date.now(),
      timestamp,
      type: 'info',
      message: `Command Executed: ${cmdText}`
    };

    let replyMessage = `Unknown command "${cmdText}". Try "powerac status" or "powerac reload".`;
    let replyType: ConsoleLog['type'] = 'error';

    const cleanCmd = cmdText.trim().toLowerCase();

    if (cleanCmd === 'powerac status') {
      replyMessage = `PowerAC Core status: active, linked keys: ${keys.length}, sensitivity level: ${config.detectionSensitivity}/10.`;
      replyType = 'success';
    } else if (cleanCmd === 'powerac reload') {
      replyMessage = `Rules refreshed successfully. 6 detection hooks updated.`;
      replyType = 'success';
    } else if (cleanCmd === 'powerac clear_bans') {
      setBans([]);
      replyMessage = `Local ban records cleared successfully.`;
      replyType = 'warning';
    } else if (cleanCmd === 'powerac sync_license') {
      replyMessage = `License verified online. Connected with server hash: 222a-99b1.`;
      replyType = 'success';
    }

    const replyLog: ConsoleLog = {
      id: 'rep-' + Date.now(),
      timestamp,
      type: replyType,
      message: replyMessage
    };

    setConsoleLogs(prev => [...prev, userLog, replyLog]);

    try {
      // Post user execution log
      await fetch('/api/console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Command Executed: ${cmdText}`, type: 'info', serverId: selectedServer?.id })
      });
      // Post system reply log
      await fetch('/api/console', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage, type: replyType, serverId: selectedServer?.id })
      });
    } catch (err) {
      console.error('Failed to post terminal command log:', err);
    }
  };

  // Live Kick player
  const handleKickPlayer = async (id: string, reason: string) => {
    const playerToKick = players.find(p => p.id === id);
    if (!playerToKick) return;

    setPlayers(prev => prev.filter(p => p.id !== id));
    
    try {
      await fetch('/api/players/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason, serverId: selectedServer?.id })
      });
      // Refresh console logs
      const consoleRes = await fetch(`/api/console?serverId=${selectedServer?.id}`);
      const consoleData = await consoleRes.json();
      if (consoleData.success) setConsoleLogs(consoleData.logs);
    } catch (err) {
      console.error('Failed to kick player:', err);
    }
  };

  // Live Ban player
  const handleBanPlayer = async (p: PlayerRecord, reason: string) => {
    // Remove from active players list
    setPlayers(prev => prev.filter(item => item.id !== p.id));

    try {
      const response = await fetch('/api/players/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: p, reason, serverId: selectedServer?.id })
      });
      const data = await response.json();
      if (data.success) {
        setBans(prev => [data.ban, ...prev]);
      }
      // Refresh console logs
      const consoleRes = await fetch(`/api/console?serverId=${selectedServer?.id}`);
      const consoleData = await consoleRes.json();
      if (consoleData.success) setConsoleLogs(consoleData.logs);
    } catch (err) {
      console.error('Failed to ban player:', err);
    }
  };

  // Add Admin Bypass whitelisting
  const handleAddAdmin = async (name: string, steamHex: string, role: string) => {
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, steamHex, role, serverId: selectedServer?.id })
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(prev => [...prev, data.admin]);
      }
    } catch (err) {
      console.error('Failed to add admin:', err);
    }
  };

  // Remove Admin Bypass whitelisting
  const handleRemoveAdmin = async (id: string) => {
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(prev => prev.filter(adm => adm.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove admin:', err);
    }
  };

  // Clear Terminal logs
  const handleClearLogs = () => {
    setConsoleLogs([]);
  };

  // --- Router render decision ---
  const renderTabContent = () => {
    const serverSpecificTabs = ['sandbox', 'bans', 'configuration', 'admins', 'console', 'players', 'economy', 'map', 'metrics'];
    const isServerTab = serverSpecificTabs.includes(activeTab);

    if (isServerTab && !selectedServer) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 max-w-2xl mx-auto my-12 backdrop-blur-sm">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6 animate-pulse">
            <Server className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Nessun Server Selezionato</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md">
            Questa sezione contiene impostazioni e log protetti in tempo reale specifici per ciascun server. Per iniziare ad amministrare, crea un server o riscatta una chiave licenza.
          </p>
          <button
            onClick={handleAddServer}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            Crea un Server Ora
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab selectedServer={selectedServer} keys={keys} bans={bans} />;
      case 'redeem':
        return (
          <RedeemTab 
            servers={servers} 
            selectedServer={selectedServer} 
            keys={keys} 
            unredeemedKeys={unredeemedKeys}
            onRedeem={handleRedeemKey} 
            onAddUnredeemedKey={handleAddUnredeemedKey}
            onDeleteUnredeemedKey={handleDeleteUnredeemedKey}
            user={user}
            onRefreshData={async () => {
              if (user) {
                try {
                  const resKeys = await fetch(`/api/keys?userId=${user.id}`);
                  const dataKeys = await resKeys.json();
                  if (dataKeys.success) {
                    setKeys(dataKeys.keys);
                    setUnredeemedKeys(dataKeys.unredeemedKeys || []);
                  }
                } catch (err) {
                  console.warn(err);
                }
              }
            }}
          />
        );
      case 'sandbox':
        return (
          <SandboxTab
            config={config}
            players={players}
            onSimulationComplete={(updatedBans, updatedPlayers, logs) => {
              setBans(updatedBans);
              setPlayers(updatedPlayers);
              setConsoleLogs(prev => [...prev, ...logs]);
            }}
          />
        );
      case 'download':
        return (
          <DownloadTab 
            servers={servers}
            keys={keys}
            onUpdateIP={handleUpdateIP}
          />
        );
      case 'share_config':
        return <ShareConfigTab config={config} />;
      case 'settings':
        return <SettingsTab />;
      case 'bans':
        return (
          <BansTab 
            bans={bans} 
            onToggleBanStatus={handleToggleBanStatus} 
            onAddBan={handleAddBan} 
          />
        );
      case 'configuration':
        return <ConfigurationTab config={config} onSaveConfig={handleSaveConfig} />;
      case 'admins':
        return <AdminsTab admins={admins} onAddAdmin={handleAddAdmin} onRemoveAdmin={handleRemoveAdmin} />;
      case 'console':
        return (
          <ConsoleTab 
            logs={consoleLogs} 
            onClearLogs={handleClearLogs} 
            onSendCommand={handleSendCommand} 
          />
        );
      case 'players':
        return (
          <PlayersTab 
            players={players} 
            onKickPlayer={handleKickPlayer} 
            onBanPlayer={handleBanPlayer} 
          />
        );
      case 'economy':
        return <EconomyTab />;
      case 'map':
        return <MapTab />;
      case 'metrics':
        return <MetricsTab />;
      default:
        return (
          <div className="text-center py-20 text-gray-500">
            Section <span className="text-purple-400 font-mono">"{activeTab}"</span> is currently being initialized by the security core.
          </div>
        );
    }
  };

  if (!user) {
    return (
      <AuthPage 
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          localStorage.setItem('powerac_user', JSON.stringify(loggedInUser));
        }} 
      />
    );
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('powerac_user');
    setServers([]);
    setKeys([]);
    setSelectedServer(null as any);
  };

  return (
    <div id="dashboard-layout" className="flex h-screen overflow-hidden bg-[#050507] text-gray-100 font-sans relative">
      
      {/* Desktop Sidebar (Always visible on large screens) */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          servers={servers}
          selectedServer={selectedServer}
          setSelectedServer={setSelectedServer}
          onAddServer={handleAddServer}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {mobileSidebarOpen && (
        <div id="mobile-sidebar-backdrop" className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop mask */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Sidebar Drawer container */}
          <div className="relative flex flex-col max-w-xs w-full bg-[#09090b] h-full z-10">
            {/* Close button */}
            <button 
              id="btn-close-mobile-nav"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }} 
              servers={servers}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              onAddServer={handleAddServer}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div id="main-content" className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header id="mobile-header" className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#1e1e24] bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-400 font-display font-bold text-sm">
              PAC
            </div>
            <span className="font-display font-bold text-sm text-white">Power Dashboard</span>
          </div>

          <button
            id="btn-toggle-mobile-nav"
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Breadcrumbs & Status */}
        <Breadcrumbs activeTab={activeTab} selectedServer={selectedServer} />

        {/* Scrollable Tab Pane container */}
        <main id="tab-viewport" className="flex-1 overflow-y-auto px-6 py-8 md:px-8 space-y-6">
          <div className="max-w-6xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Create Server Modal Popup */}
      {showCreateServerModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0c0b11] border border-[#211f2d] rounded-2xl p-6 md:p-8 shadow-2xl relative z-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-sans">Aggiungi Nuovo Server</h3>
              </div>
              <button
                id="btn-close-server-modal"
                onClick={() => setShowCreateServerModal(false)}
                className="text-gray-500 hover:text-gray-300 transition text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {createServerError && (
              <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createServerError}</span>
              </div>
            )}

            <form onSubmit={submitCreateServer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                  Nome Server
                </label>
                <input
                  id="create-server-name-input"
                  type="text"
                  placeholder="es. Imperia Roleplay"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full bg-[#131119] border border-[#262432] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition font-sans"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Indirizzo IP : Porta</span>
                  <span className="text-[9px] text-purple-400 font-normal normal-case">Consigliato: 0.0.0.0:30120</span>
                </label>
                <input
                  id="create-server-ip-input"
                  type="text"
                  placeholder="es. 0.0.0.0:30120"
                  value={newServerIp}
                  onChange={(e) => setNewServerIp(e.target.value)}
                  className="w-full bg-[#131119] border border-[#262432] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition font-mono"
                  required
                />
                <p className="text-[10px] text-gray-500 leading-normal">
                  Se lasci l'IP come <code className="text-gray-300 font-mono">0.0.0.0:30120</code>, PowerAC bloccherà la licenza al primo indirizzo IP che avvia il server con questa chiave (Auto-Lock).
                </p>
              </div>

              <div className="pt-4 flex gap-3.5 justify-end">
                <button
                  id="btn-cancel-create-server"
                  type="button"
                  onClick={() => setShowCreateServerModal(false)}
                  className="text-xs font-semibold py-2.5 px-4 text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  id="btn-confirm-create-server"
                  type="submit"
                  disabled={createServerLoading}
                  className="bg-purple-900 hover:bg-purple-800 disabled:bg-purple-950/40 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {createServerLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Creazione...
                    </>
                  ) : (
                    'Crea Server'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
