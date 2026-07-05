import { 
  LayoutDashboard, 
  Key, 
  Download, 
  Share2, 
  Settings, 
  Ban, 
  Sliders, 
  ShieldAlert, 
  Terminal, 
  Users, 
  CircleDollarSign, 
  Map, 
  TrendingUp,
  ChevronDown,
  ShieldCheck,
  Server,
  LogOut
} from 'lucide-react';
import { FiveMServer, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  servers: FiveMServer[];
  selectedServer: FiveMServer;
  setSelectedServer: (server: FiveMServer) => void;
  onAddServer: () => void;
  user: User | null;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  servers,
  selectedServer,
  setSelectedServer,
  onAddServer,
  user,
  onLogout
}: SidebarProps) {

  const generalMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'redeem', name: 'Redeem', icon: Key },
    { id: 'sandbox', name: 'Anticheat Sandbox', icon: ShieldCheck },
    { id: 'download', name: 'Download & Setup', icon: Download },
    { id: 'share_config', name: 'Share Config', icon: Share2 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const serverMenuItems = [
    { id: 'bans', name: 'Bans', icon: Ban },
    { id: 'configuration', name: 'Configuration', icon: Sliders },
    { id: 'admins', name: 'Admins', icon: ShieldAlert },
    { id: 'console', name: 'Console', icon: Terminal },
    { id: 'players', name: 'Players', icon: Users },
    { id: 'economy', name: 'Economy', icon: CircleDollarSign },
    { id: 'map', name: 'Map', icon: Map },
    { id: 'metrics', name: 'Metrics', icon: TrendingUp },
  ];

  return (
    <aside id="sidebar" className="w-64 bg-[#09090b] border-r border-[#1e1e24] flex flex-col h-screen overflow-y-auto select-none shrink-0 text-gray-300">
      {/* Brand Header */}
      <div id="sidebar-header" className="px-6 py-5 border-b border-[#1e1e24] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/50 flex items-center justify-center text-purple-400 font-display font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          PAC
        </div>
        <div>
          <h1 className="font-display font-bold text-white tracking-wide text-base leading-tight flex items-center gap-1.5">
            Power <ShieldCheck className="w-4 h-4 text-purple-400" />
          </h1>
          <span className="text-[11px] font-mono tracking-wider text-gray-500 uppercase">Customer Area</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div id="sidebar-nav" className="flex-1 px-4 py-4 space-y-6">
        
        {/* General */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold tracking-widest text-gray-500 uppercase">General</span>
          {generalMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`btn-menu-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-950/40 text-purple-400 border-l-2 border-purple-500 pl-2.5' 
                    : 'hover:bg-zinc-900 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* My Servers */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold tracking-widest text-gray-500 uppercase">My Servers</span>
          
          {/* Server Selector inside sidebar */}
          <div className="px-2 py-2">
            <div className="relative group">
              <select
                id="sidebar-server-select"
                value={selectedServer?.id || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'add_new') {
                    onAddServer();
                  } else {
                    const found = servers.find(s => s.id === val);
                    if (found) setSelectedServer(found);
                  }
                }}
                className="w-full bg-[#121216] border border-[#27272a] rounded-lg px-3 py-2 text-sm text-gray-200 font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer appearance-none pr-8 font-mono"
              >
                {servers.length === 0 ? (
                  <option value="" disabled className="bg-[#09090b] text-gray-500">
                    Nessun Server Attivo
                  </option>
                ) : (
                  servers.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#09090b]">
                      💻 {s.id} - {s.name.split(' ')[0]}
                    </option>
                  ))
                )}
                <option value="add_new" className="bg-[#09090b] text-purple-400 font-medium">
                  + Add New Server
                </option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Server-specific items */}
          {serverMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`btn-menu-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-950/40 text-purple-400 border-l-2 border-purple-500 pl-2.5' 
                    : 'hover:bg-zinc-900 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info & User Session */}
      <div id="sidebar-footer" className="border-t border-[#1e1e24] bg-[#0c0c0e] divide-y divide-[#1e1e24]/60">
        {user && (
          <div className="p-4 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-purple-500/30 object-cover shrink-0 bg-purple-950/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate font-sans leading-tight">{user.username}</p>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button
              id="btn-sidebar-logout"
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-rose-950/20 text-gray-500 hover:text-rose-400 transition cursor-pointer shrink-0"
              title="Disconnetti"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
        <div className="p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PowerAC Cloud Core: <span className="text-gray-200 font-semibold">Online</span></span>
          </div>
          <p className="text-[10px] text-gray-500 font-mono">Build v2.4.1 - Production</p>
        </div>
      </div>
    </aside>
  );
}
