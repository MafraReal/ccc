import { Home, ChevronRight, Server, Globe, Users } from 'lucide-react';
import { FiveMServer } from '../types';

interface BreadcrumbsProps {
  activeTab: string;
  selectedServer: FiveMServer;
}

export default function Breadcrumbs({ activeTab, selectedServer }: BreadcrumbsProps) {
  // Map tab key to human-readable label
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'redeem': return 'Redeem';
      case 'download': return 'Download';
      case 'share_config': return 'Share Config';
      case 'settings': return 'Settings';
      case 'bans': return 'Bans';
      case 'configuration': return 'Configuration';
      case 'admins': return 'Admins';
      case 'console': return 'Console';
      case 'players': return 'Players';
      case 'economy': return 'Economy';
      case 'map': return 'Map';
      case 'metrics': return 'Metrics';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1);
    }
  };

  const isServerTab = [
    'bans', 'configuration', 'admins', 'console', 'players', 'economy', 'map', 'metrics'
  ].includes(activeTab);

  return (
    <div id="breadcrumbs-container" className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-5 border-b border-[#1e1e24] bg-[#0c0c0e]/60 backdrop-blur-md gap-4">
      {/* Path Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
        <Home className="w-3.5 h-3.5 text-gray-500" />
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="hover:text-gray-300 cursor-pointer">Dashboard</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        {isServerTab && (
          <>
            <span className="text-gray-500 font-mono">{selectedServer.id}</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </>
        )}
        <span className="text-purple-400 font-semibold">{getTabLabel(activeTab)}</span>
      </div>

      {/* Active Server Context Badge */}
      <div className="flex items-center gap-3">
        {isServerTab && (
          <div className="flex items-center gap-4 bg-zinc-900/60 px-3.5 py-1.5 rounded-lg border border-[#27272a] text-xs">
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-gray-300 font-medium font-mono truncate max-w-[120px] sm:max-w-none">
                {selectedServer.name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-gray-500">
              <Globe className="w-3 h-3" />
              <span className="font-mono text-[10px]">{selectedServer.ip}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${selectedServer.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-mono uppercase font-bold text-gray-400">
                {selectedServer.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
