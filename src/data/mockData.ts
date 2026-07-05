import { FiveMServer, LicenseKey, BanRecord, PlayerRecord, ConsoleLog, AnticheatConfig } from '../types';

export const INITIAL_SERVERS: FiveMServer[] = [
  { id: '222', name: 'Server 222 (RP Italia)', ip: '185.223.15.42:30120', status: 'online', playersCount: 48, maxPlayers: 128 },
  { id: '404', name: 'Server 404 (Los Santos Life)', ip: '82.10.155.88:30120', status: 'online', playersCount: 12, maxPlayers: 64 },
  { id: '888', name: 'Server 888 (Milano RP)', ip: '95.217.1.10:30120', status: 'offline', playersCount: 0, maxPlayers: 128 }
];

export const INITIAL_KEYS: LicenseKey[] = [
  {
    id: 'key-1',
    key: 'PAC-LIFETIME-FREE-MH60-ZGV6',
    tier: 'Free',
    duration: 'Lifetime',
    linkedServer: '222',
    redeemedAt: '2026-03-12 18:40'
  },
  {
    id: 'key-2',
    key: 'PAC-30DAYS-PREM-AX90-PL21',
    tier: 'Premium',
    duration: '30 Days',
    linkedServer: '404',
    redeemedAt: '2026-06-01 12:15'
  }
];

export const INITIAL_BANS: BanRecord[] = [
  {
    id: 'ban-1',
    playerName: 'GamerGod_99',
    steamId: 'steam:11000013e2f177c',
    discordId: 'discord:529241940984852480',
    reason: 'Lua Executor execution: triggerServerEvent("adminMenu")',
    bannedBy: 'PowerAC System',
    date: '2026-07-03 23:14',
    active: true
  },
  {
    id: 'ban-2',
    playerName: 'CheaterPro_FiveM',
    steamId: 'steam:110000109ae93c1',
    discordId: 'discord:412093849023812048',
    reason: 'Spectate Mode Bypass detected',
    bannedBy: 'PowerAC System',
    date: '2026-07-03 18:42',
    active: true
  },
  {
    id: 'ban-3',
    playerName: 'ModdedTroll',
    steamId: 'steam:11000011bb9e5df',
    reason: 'Vehicle Spawn Spam: weapon_railgun',
    bannedBy: 'Admin ' + 'Seba',
    date: '2026-06-28 02:11',
    active: false
  }
];

export const INITIAL_PLAYERS: PlayerRecord[] = [
  { id: '1', name: 'Mario_Rossi', ping: 24, steamId: 'steam:11000013f99aa21', discord: 'rossi#1234', hardwareId: 'hw:8fa92b...', joinTime: '1h 22m ago' },
  { id: '2', name: 'LuigiV', ping: 35, steamId: 'steam:11000011fca34bb', discord: 'luigiv#9911', hardwareId: 'hw:9c882a...', joinTime: '45m ago' },
  { id: '3', name: 'Anticheat_Tester', ping: 12, steamId: 'steam:11000014aa2212a', discord: 'tester#0001', hardwareId: 'hw:2fb11d...', joinTime: '12m ago' },
  { id: '4', name: 'GigaChadRP', ping: 48, steamId: 'steam:11000012bcdd33a', discord: 'gigachad#1337', hardwareId: 'hw:7ff11a...', joinTime: '3h 10m ago' }
];

export const INITIAL_CONSOLE_LOGS: ConsoleLog[] = [
  { id: 'l1', timestamp: '14:32:01', type: 'info', message: 'PowerAC system initializing on Server 222...' },
  { id: 'l2', timestamp: '14:32:05', type: 'success', message: 'Loaded 52 base detection matrices successfully' },
  { id: 'l3', timestamp: '14:32:06', type: 'info', message: 'Connected to Discord Log Webhook: #powerac-logs' },
  { id: 'l4', timestamp: '14:35:12', type: 'warning', message: 'Player Mario_Rossi ping spike: 180ms' },
  { id: 'l5', timestamp: '14:38:44', type: 'error', message: 'Blocked Executor attempt from [steam:11000013e2f177c] GamerGod_99' },
  { id: 'l6', timestamp: '14:38:44', type: 'success', message: 'Banned GamerGod_99 for 365 days (Reason: Lua Executor)' },
  { id: 'l7', timestamp: '14:40:12', type: 'info', message: 'Config reloaded by Admin console.' }
];

export const INITIAL_CONFIG: AnticheatConfig = {
  antiNoclip: true,
  antiSpectate: true,
  antiGiveWeapon: true,
  antiCheatEngine: true,
  antiTriggerEvent: false,
  antiVehicleSpam: true,
  discordLogWebhook: 'https://discord.com/api/webhooks/1122334455/abcdefg_hijk_lmnop',
  detectionSensitivity: 7
};
