export interface LicenseKey {
  id: string;
  key: string;
  tier: 'Free' | 'Premium' | 'Exclusive';
  duration: '30 Days' | 'Lifetime' | 'Yearly';
  linkedServer: string; // Server ID
  redeemedAt: string;
  ip?: string;
  userId?: string; // Tracks account owner
}

export interface FiveMServer {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline';
  playersCount: number;
  maxPlayers: number;
  userId?: string; // Tracks account owner
}

export interface User {
  id: string;
  username: string;
  discordId?: string;
  avatarUrl?: string;
  role: string;
}

export interface BanRecord {
  id: string;
  playerName: string;
  steamId: string;
  discordId?: string;
  reason: string;
  bannedBy: string;
  date: string;
  active: boolean;
}

export interface PlayerRecord {
  id: string;
  name: string;
  ping: number;
  steamId: string;
  discord: string;
  hardwareId: string;
  joinTime: string;
}

export interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface AnticheatConfig {
  antiNoclip: boolean;
  antiSpectate: boolean;
  antiGiveWeapon: boolean;
  antiCheatEngine: boolean;
  antiTriggerEvent: boolean;
  antiVehicleSpam: boolean;
  discordLogWebhook: string;
  detectionSensitivity: number; // 1-10
}
