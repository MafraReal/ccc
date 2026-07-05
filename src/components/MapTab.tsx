import React, { useState } from 'react';
import { Map, AlertTriangle, Eye, RefreshCw, Crosshair, HelpCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface DetectionMarker {
  id: string;
  x: number;
  y: number;
  locationName: string;
  playerName: string;
  cheatType: string;
  time: string;
}

const INITIAL_MARKERS: DetectionMarker[] = [
  { id: '1', x: 42, y: 55, locationName: 'Legion Square (Bank)', playerName: 'GamerGod_99', cheatType: 'Lua Executor: Spawn Cash', time: '14:38' },
  { id: '2', x: 28, y: 35, locationName: 'Los Santos Customs (Burton)', playerName: 'TrollerFiveM', cheatType: 'Weapon Give: Weapon_Railgun', time: '12:04' },
  { id: '3', x: 65, y: 72, locationName: 'Sandy Shores Airport', playerName: 'SpeedyCheats', cheatType: 'Speed Hack bypass', time: '09:12' },
  { id: '4', x: 48, y: 22, locationName: 'Maze Bank Tower Roof', playerName: 'NoclipUser', cheatType: 'No-clip velocity trigger', time: '02:40' }
];

export default function MapTab() {
  const [markers, setMarkers] = useState<DetectionMarker[]>(INITIAL_MARKERS);
  const [selected, setSelected] = useState<DetectionMarker | null>(INITIAL_MARKERS[0]);
  const [isSweeping, setIsSweeping] = useState(false);

  const handleSweep = () => {
    setIsSweeping(true);
    setTimeout(() => {
      setIsSweeping(false);
      // Randomly spawn a dummy marker simulation
      const names = ['CheatPro_RP', 'LaggyBoy', 'HaxMax', 'LuaLover'];
      const cheats = ['Spectate mode bypass', 'Infinite ammo exploit', 'Anti-ragdoll bypass', 'Super jump exploit'];
      const locations = ['Vinewood Hills', 'Del Perro Pier', 'Paleto Bay Sheriff Office', 'Chiliad Mountain Summit'];
      
      const newMarker: DetectionMarker = {
        id: Date.now().toString(),
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20,
        locationName: locations[Math.floor(Math.random() * locations.length)],
        playerName: names[Math.floor(Math.random() * names.length)],
        cheatType: cheats[Math.floor(Math.random() * cheats.length)],
        time: new Date().toTimeString().slice(0, 5)
      };
      setMarkers(prev => [...prev, newMarker]);
      setSelected(newMarker);
    }, 1500);
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
          <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">Detections Map</h2>
          <p className="text-sm text-gray-400 mt-1">Spatial projection of blocked injections mapped across Los Santos coordinates.</p>
        </div>

        <button
          id="btn-sweep-map"
          onClick={handleSweep}
          disabled={isSweeping}
          className="bg-purple-700 hover:bg-purple-600 disabled:bg-purple-900/50 text-white font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 transition active:scale-95 cursor-pointer self-start text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : ''}`} /> 
          {isSweeping ? 'Scanning Coordinates...' : 'Scan Live Servers'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Map Grid */}
        <div className="lg:col-span-2 bg-[#050507] border border-[#1b1525] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-[460px]">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:30px_30px]"></div>
          
          {/* Interactive Scan Line effect */}
          {isSweeping && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="absolute left-0 right-0 h-0.5 bg-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10"
            />
          )}

          {/* Graphical Compass Overlay */}
          <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-600 flex flex-col gap-0.5">
            <span>GRID: LS-ZONE-A</span>
            <span>HDG: 342.1°</span>
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">
            <span>SCALE: 1:12500</span>
          </div>

          {/* Map canvas container */}
          <div className="w-full h-full relative z-20">
            {/* Markers list mapping */}
            {markers.map((mark) => (
              <button
                id={`marker-${mark.id}`}
                key={mark.id}
                onClick={() => setSelected(mark)}
                style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                className={`absolute w-4 h-4 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition duration-300 focus:outline-none cursor-pointer ${
                  selected?.id === mark.id 
                    ? 'bg-rose-600 scale-125 ring-4 ring-rose-500/30 shadow-[0_0_15px_rgba(239,68,68,0.8)]' 
                    : 'bg-purple-600 hover:bg-rose-500 hover:scale-110'
                }`}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                
                {/* Flashing pulse circle */}
                <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
              </button>
            ))}

            {/* Simulated abstract islands contours */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100,100 C150,80 250,150 220,250 C180,350 350,380 420,320 C500,250 620,380 680,250 C740,120 600,80 500,150 Z" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 5" />
              <path d="M50,300 C120,280 180,420 300,450 C420,480 520,400 620,460 C680,500 750,420 800,490" fill="none" stroke="#a855f7" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Selected Marker detail card */}
        <div className="bg-[#0b0a0f] border border-[#1e1e24] rounded-xl p-5 flex flex-col justify-between">
          {selected ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#1e1e24] pb-3">
                  <Crosshair className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-sm">Coordinate Capture</h3>
                    <p className="text-[10px] text-gray-500 font-mono">X: {selected.x * 12} | Y: {selected.y * 14} | Z: 41.5</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Player Trigger</span>
                    <strong className="text-gray-200 text-sm mt-0.5 block">{selected.playerName}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Blocked Action</span>
                    <span className="text-rose-400 text-xs font-semibold mt-0.5 block">{selected.cheatType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Captured Location</span>
                    <span className="text-gray-300 text-xs mt-0.5 block">{selected.locationName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Captured At</span>
                    <span className="text-zinc-500 text-xs font-mono mt-0.5 block">Today, {selected.time}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 flex gap-2">
                <button
                  id="btn-teleport-admin"
                  onClick={() => alert(`RCON Teleport Trigger sent: /goto ${selected.playerName}`)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-gray-300 text-xs font-semibold py-2 rounded-lg border border-zinc-800 transition active:scale-95 cursor-pointer"
                >
                  Goto Player
                </button>
                <button
                  id="btn-spectate-admin"
                  onClick={() => alert(`RCON Camera hook initiated: spectate pid ${selected.id}`)}
                  className="flex-1 bg-purple-950/40 hover:bg-purple-900/40 text-purple-400 text-xs font-semibold py-2 rounded-lg border border-purple-900/30 transition active:scale-95 cursor-pointer"
                >
                  Spectate Cam
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-gray-650">
              <HelpCircle className="w-10 h-10 text-zinc-800 mb-2.5" />
              <h4 className="font-semibold text-sm text-gray-500">No Location Selected</h4>
              <p className="text-xs text-zinc-650 mt-1">Select a glowing crosshair node on the left coordinate matrix map.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
