import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAppUrl(req: any) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const forwardedProto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const forwardedHost = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  const host = typeof forwardedHost === 'string' ? forwardedHost.split(',')[0].trim() : forwardedHost;
  return `${forwardedProto}://${host}`;
}

// Initial values for seeding
const INITIAL_SERVERS = [
  { id: '222', name: 'Server 222 (RP Italia)', ip: '185.223.15.42:30120', status: 'online', playersCount: 48, maxPlayers: 128 },
  { id: '404', name: 'Server 404 (Los Santos Life)', ip: '82.10.155.88:30120', status: 'online', playersCount: 12, maxPlayers: 64 },
  { id: '888', name: 'Server 888 (Milano RP)', ip: '95.217.1.10:30120', status: 'offline', playersCount: 0, maxPlayers: 128 }
];

const INITIAL_KEYS = [
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

const INITIAL_BANS = [
  {
    id: 'ban-1',
    playerName: 'GamerGod_99',
    steamId: 'steam:11000013e2f177c',
    discordId: 'discord:529241940984852480',
    reason: 'Lua Executor execution: triggerServerEvent("adminMenu")',
    bannedBy: 'PowerAC System',
    date: '2026-07-03 23:14',
    active: true,
    serverId: '222'
  },
  {
    id: 'ban-2',
    playerName: 'CheaterPro_FiveM',
    steamId: 'steam:110000109ae93c1',
    discordId: 'discord:412093849023812048',
    reason: 'Spectate Mode Bypass detected',
    bannedBy: 'PowerAC System',
    date: '2026-07-03 18:42',
    active: true,
    serverId: '222'
  }
];

const INITIAL_CONFIG = {
  antiNoclip: true,
  antiSpectate: true,
  antiGiveWeapon: true,
  antiCheatEngine: true,
  antiTriggerEvent: false,
  antiVehicleSpam: true,
  discordLogWebhook: 'https://discord.com/api/webhooks/1122334455/abcdefg_hijk_lmnop',
  detectionSensitivity: 7
};

const INITIAL_CONSOLE_LOGS = [
  { id: 'l1', timestamp: '14:32:01', type: 'info', message: 'PowerAC system initializing on Server 222...', serverId: '222' },
  { id: 'l2', timestamp: '14:32:05', type: 'success', message: 'Loaded 52 base detection matrices successfully', serverId: '222' },
  { id: 'l3', timestamp: '14:32:06', type: 'info', message: 'Connected to Discord Log Webhook: #powerac-logs', serverId: '222' },
  { id: 'l4', timestamp: '14:35:12', type: 'warning', message: 'Player Mario_Rossi ping spike: 180ms', serverId: '222' },
  { id: 'l5', timestamp: '14:38:44', type: 'error', message: 'Blocked Executor attempt from [steam:11000013e2f177c] GamerGod_99', serverId: '222' },
  { id: 'l6', timestamp: '14:38:44', type: 'success', message: 'Banned GamerGod_99 for 365 days (Reason: Lua Executor)', serverId: '222' },
  { id: 'l7', timestamp: '14:40:12', type: 'info', message: 'Config reloaded by Admin console.', serverId: '222' }
];

const INITIAL_ADMINS = [
  { id: '1', name: 'Seba', steamHex: 'steam:110000100abcdef', role: 'Owner', addedAt: '2026-01-01', serverId: '222' },
  { id: '2', name: 'David_C', steamHex: 'steam:110000199f332aa', role: 'SuperAdmin', addedAt: '2026-03-15', serverId: '222' },
  { id: '3', name: 'Dev_Matt', steamHex: 'steam:110000144bb2112', role: 'Admin', addedAt: '2026-05-20', serverId: '222' }
];

const INITIAL_PLAYERS = [
  { id: '1', name: 'Mario_Rossi', ping: 24, steamId: 'steam:11000013f99aa21', discord: 'rossi#1234', hardwareId: 'hw:8fa92b...', joinTime: '1h 22m ago', serverId: '222' },
  { id: '2', name: 'LuigiV', ping: 35, steamId: 'steam:11000011fca34bb', discord: 'luigiv#9911', hardwareId: 'hw:9c882a...', joinTime: '45m ago', serverId: '222' },
  { id: '3', name: 'Anticheat_Tester', ping: 12, steamId: 'steam:11000014aa2212a', discord: 'tester#0001', hardwareId: 'hw:2fb11d...', joinTime: '12m ago', serverId: '222' },
  { id: '4', name: 'GigaChadRP', ping: 48, steamId: 'steam:11000012bcdd33a', discord: 'gigachad#1337', hardwareId: 'hw:7ff11a...', joinTime: '3h 10m ago', serverId: '222' }
];

const DB_FILE = path.join(process.cwd(), 'database.json');

// Helper to load DB
function loadDatabase() {
  let db: any = null;
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing database.json, resetting database.', e);
    }
  }
  
  if (!db) {
    // Default structure
    const defaultDB = {
      servers: INITIAL_SERVERS,
      keys: INITIAL_KEYS,
      bans: INITIAL_BANS,
      config: INITIAL_CONFIG,
      configs: {
        '222': { ...INITIAL_CONFIG },
        '404': { ...INITIAL_CONFIG },
        '888': { ...INITIAL_CONFIG }
      },
      consoleLogs: INITIAL_CONSOLE_LOGS,
      unredeemedKeys: [
        { key: 'PAC-DISCORD-TEST-KEY1-AAAA', tier: 'Premium', duration: '30 Days', used: false },
        { key: 'PAC-DISCORD-TEST-KEY2-BBBB', tier: 'Exclusive', duration: 'Lifetime', used: false }
      ],
      admins: INITIAL_ADMINS,
      activePlayers: INITIAL_PLAYERS
    };
    saveDatabase(defaultDB);
    return defaultDB;
  }

  let dirty = false;
  if (!db.configs) {
    db.configs = {
      '222': db.config || { ...INITIAL_CONFIG },
      '404': db.config || { ...INITIAL_CONFIG },
      '888': db.config || { ...INITIAL_CONFIG }
    };
    dirty = true;
  }
  if (!db.servers) {
    db.servers = INITIAL_SERVERS;
    dirty = true;
  }
  if (!db.keys) {
    db.keys = INITIAL_KEYS;
    dirty = true;
  }
  if (!db.bans) {
    db.bans = INITIAL_BANS;
    dirty = true;
  }
  if (!db.config) {
    db.config = INITIAL_CONFIG;
    dirty = true;
  }
  if (!db.consoleLogs) {
    db.consoleLogs = INITIAL_CONSOLE_LOGS;
    dirty = true;
  }
  if (!db.unredeemedKeys) {
    db.unredeemedKeys = [];
    dirty = true;
  }
  if (!db.admins) {
    db.admins = INITIAL_ADMINS;
    dirty = true;
  }
  if (!db.activePlayers) {
    db.activePlayers = INITIAL_PLAYERS;
    dirty = true;
  }
  if (!db.users) {
    db.users = [];
    dirty = true;
  }
  if (dirty) {
    saveDatabase(db);
  }
  return db;
}

// Helper to save DB
function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write database.json', e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Memory queue for pending commands to FiveM server
  const pendingCommands: Record<string, any[]> = {};

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Log request info
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.url}`);
    next();
  });

  // Load state
  let db = loadDatabase();

  // API Secret key to protect Discord Bot requests
  const DISCORD_API_SECRET = process.env.DISCORD_API_SECRET || 'Davidcerasa26';
  console.log(`\n========================================`);
  console.log(`🔑 DISCORD BOT API SECRET TOKEN: "${DISCORD_API_SECRET}"`);
  console.log(`Configure your Discord bot to send this token in headers as:`);
  console.log(`"Authorization: Bearer ${DISCORD_API_SECRET}"`);
  console.log(`========================================\n`);

  // Middleware to authorize Discord Bot calls
  const authDiscordBot = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Missing or invalid Bearer token.' });
    }
    const token = authHeader.split(' ')[1];
    if (token !== DISCORD_API_SECRET) {
      return res.status(403).json({ success: false, error: 'Forbidden. Incorrect Discord bot authorization token.' });
    }
    next();
  };

  // --- API ROUTES FOR DISCORD BOT ---

  /**
   * Genera una nuova licenza (utilizzata dal Bot Discord)
   * URL: POST /api/keys/generate
   * Body: { tier: 'Free' | 'Premium' | 'Exclusive', duration: '30 Days' | 'Lifetime' | 'Yearly', discordUserId?: string }
   */
  app.post('/api/keys/generate', authDiscordBot, (req, res) => {
    const { tier, duration, discordUserId } = req.body;
    
    const validTiers = ['Free', 'Premium', 'Exclusive'];
    const validDurations = ['30 Days', 'Lifetime', 'Yearly'];

    const chosenTier = validTiers.includes(tier) ? tier : 'Premium';
    const chosenDuration = validDurations.includes(duration) ? duration : '30 Days';

    // Generate a secure custom license key format
    const randomHex = () => Math.random().toString(16).substring(2, 6).toUpperCase();
    const cleanTier = chosenTier.toUpperCase();
    const generatedKeyStr = `PAC-${cleanTier}-${randomHex()}-${randomHex()}-${randomHex()}`;

    // Reload latest db
    db = loadDatabase();

    const newKeyObj = {
      key: generatedKeyStr,
      tier: chosenTier,
      duration: chosenDuration,
      used: false,
      createdByDiscordId: discordUserId || null,
      createdAt: new Date().toISOString()
    };

    db.unredeemedKeys.push(newKeyObj);
    saveDatabase(db);

    console.log(`[DISCORD BOT] Generated new key: ${generatedKeyStr} (${chosenTier} - ${chosenDuration})`);

    return res.json({
      success: true,
      key: generatedKeyStr,
      tier: chosenTier,
      duration: chosenDuration,
      message: 'License key successfully generated!'
    });
  });

  // --- DISCORD BOT BACKWARD-COMPATIBILITY API ENDPOINT ---
  /**
   * Compatibility endpoint to substitute http://powerac.infy.click/auth.php
   * URL: POST /api/auth
   * Content-Type: application/x-www-form-urlencoded
   */
  app.post('/api/auth', (req, res) => {
    const { action, secret } = req.body;

    console.log(`[DISCORD BOT COMPATIBILITY] Action: "${action}" requested.`);

    // Authenticate with either panel's secret token or the standard bot config secret
    if (secret !== DISCORD_API_SECRET && secret !== 'Davidcerasa26') {
      console.warn(`[DISCORD BOT COMPATIBILITY] Failed auth attempt with secret: "${secret}"`);
      return res.status(403).json({ status: 'error', message: 'Forbidden. Incorrect Discord bot authorization secret.' });
    }

    db = loadDatabase();

    if (action === 'generate') {
      const { license, total_time, created_by, userid, ip, tier } = req.body;
      if (!license) {
        return res.status(400).json({ status: 'error', message: 'Missing license parameter.' });
      }

      // Parse and normalize tier
      let parsedTier = 'Premium';
      if (tier) {
        const rawTier = String(tier).trim().toLowerCase();
        if (rawTier === 'free' || rawTier === 'premium' || rawTier === 'exclusive') {
          parsedTier = rawTier.charAt(0).toUpperCase() + rawTier.slice(1);
        }
      }

      // Generate a new key in database matching the Bot's format
      const durationDays = parseInt(total_time) || 30;
      const newKey = {
        key: license.trim().toUpperCase(),
        tier: parsedTier,
        duration: durationDays === 99999 ? 'Lifetime' : `${durationDays} Days`,
        used: false,
        createdBy: created_by || 'Discord Bot',
        userid: userid || '',
        ip: ip || '0.0.0.0',
        total_time: String(durationDays),
        createdAt: new Date().toISOString(),
        usedTimestamp: Math.floor(Date.now() / 1000) // This represents the creation date for $time command
      };

      db.unredeemedKeys.push(newKey);
      saveDatabase(db);

      console.log(`[DISCORD BOT COMPATIBILITY] Key generated & registered: ${license} for Discord ID: ${userid}`);
      return res.json({ status: 'success', message: 'Key successfully inserted into panel database!' });
    }

    if (action === 'setip') {
      const { license, ip } = req.body;
      if (!license || !ip) {
        return res.status(400).json({ status: 'error', message: 'Missing license or IP parameters.' });
      }

      const cleanLicense = license.trim().toUpperCase();

      // Find inside unredeemed keys
      const unredeemedIdx = db.unredeemedKeys.findIndex((k: any) => k.key.toUpperCase() === cleanLicense);
      if (unredeemedIdx !== -1) {
        db.unredeemedKeys[unredeemedIdx].ip = ip;
        saveDatabase(db);
        console.log(`[DISCORD BOT COMPATIBILITY] IP set to ${ip} for unredeemed license: ${cleanLicense}`);
        return res.json({ status: 'success' });
      }

      // Find inside active keys
      const activeIdx = db.keys.findIndex((k: any) => k.key.toUpperCase() === cleanLicense);
      if (activeIdx !== -1) {
        db.keys[activeIdx].ip = ip;
        // Also update IP in servers database if linked
        const serverId = db.keys[activeIdx].linkedServer;
        const srvIdx = db.servers.findIndex((s: any) => s.id === serverId);
        if (srvIdx !== -1) {
          db.servers[srvIdx].ip = `${ip}:30120`;
        }
        saveDatabase(db);
        console.log(`[DISCORD BOT COMPATIBILITY] IP set to ${ip} for active redeemed license: ${cleanLicense}`);
        return res.json({ status: 'success' });
      }

      return res.json({ status: 'error', message: 'License key not found in database.' });
    }

    if (action === 'time') {
      const { userid } = req.body;
      if (!userid) {
        return res.status(400).json({ status: 'error', message: 'Missing userid parameter.' });
      }

      const results: any[] = [];

      // Check unredeemed keys
      db.unredeemedKeys.forEach((k: any) => {
        if (k.userid === userid) {
          results.push({
            used: String(k.usedTimestamp || Math.floor(Date.now() / 1000)),
            total_time: String(k.total_time || 30)
          });
        }
      });

      // Check active keys
      db.keys.forEach((k: any) => {
        if (k.userid === userid) {
          const createdTs = k.redeemedAt 
            ? Math.floor(new Date(k.redeemedAt).getTime() / 1000)
            : Math.floor(Date.now() / 1000);
          const days = k.duration === 'Lifetime' ? 99999 : (parseInt(k.duration) || 30);
          results.push({
            used: String(createdTs),
            total_time: String(days)
          });
        }
      });

      console.log(`[DISCORD BOT COMPATIBILITY] Checking time info for Discord ID: ${userid}. Found ${results.length} keys.`);
      return res.json({ results });
    }

    if (action === 'delkey') {
      const { license } = req.body;
      if (!license) {
        return res.status(400).json({ status: 'error', message: 'Missing license parameter.' });
      }

      const cleanLicense = license.trim().toUpperCase();
      const initialLength = db.unredeemedKeys.length + db.keys.length;

      db.unredeemedKeys = db.unredeemedKeys.filter((k: any) => k.key.toUpperCase() !== cleanLicense);
      db.keys = db.keys.filter((k: any) => k.key.toUpperCase() !== cleanLicense);

      if (db.unredeemedKeys.length + db.keys.length < initialLength) {
        saveDatabase(db);
        console.log(`[DISCORD BOT COMPATIBILITY] License key deleted: ${cleanLicense}`);
        return res.json({ status: 'success' });
      }

      return res.json({ status: 'error', message: 'License key not found.' });
    }

    if (action === 'listkey') {
      const results: any[] = [];

      db.unredeemedKeys.forEach((k: any) => {
        results.push({
          license: k.key,
          created_by: k.createdBy || 'Discord Bot',
          userid: k.userid || '',
          ip: k.ip || '0.0.0.0',
          total_time: String(k.total_time || 30)
        });
      });

      db.keys.forEach((k: any) => {
        const days = k.duration === 'Lifetime' ? 99999 : (parseInt(k.duration) || 30);
        results.push({
          license: k.key,
          created_by: k.createdBy || 'Web Panel',
          userid: k.userid || '',
          ip: k.ip || '0.0.0.0',
          total_time: String(days)
        });
      });

      console.log(`[DISCORD BOT COMPATIBILITY] Listed keys. Total: ${results.length}`);
      return res.json({ results });
    }

    if (action === 'checkkey') {
      const { userid } = req.body;
      if (!userid) {
        return res.status(400).json({ status: 'error', message: 'Missing userid parameter.' });
      }

      const results: any[] = [];

      db.unredeemedKeys.forEach((k: any) => {
        if (k.userid === userid) {
          results.push({
            license: k.key,
            userid: k.userid,
            ip: k.ip || '0.0.0.0',
            total_time: String(k.total_time || 30)
          });
        }
      });

      db.keys.forEach((k: any) => {
        if (k.userid === userid) {
          const days = k.duration === 'Lifetime' ? 99999 : (parseInt(k.duration) || 30);
          results.push({
            license: k.key,
            userid: k.userid,
            ip: k.ip || '0.0.0.0',
            total_time: String(days)
          });
        }
      });

      console.log(`[DISCORD BOT COMPATIBILITY] Checked keys for Discord ID: ${userid}. Found ${results.length}`);
      return res.json({ results });
    }

    return res.status(400).json({ status: 'error', message: 'Invalid bot action.' });
  });

  // --- ANTICHEAT LICENSE VALIDATION AND CONFIGURATION SYNC API ---
  /**
   * Endpoint accessed by FiveM / Game Servers to authorize starting up
   * URL: POST /api/validate
   * Body: { license: string, ip?: string }
   */
  app.post('/api/validate', (req, res) => {
    const { license, ip } = req.body;
    const requestIp = ip || req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!license) {
      return res.status(400).json({ success: false, message: 'License key is required.' });
    }

    db = loadDatabase();
    const cleanLicense = license.trim().toUpperCase();

    // 1. Check if the license is in the active redeemed keys list
    let keyObj = db.keys.find((k: any) => k.key.toUpperCase() === cleanLicense);

    // If not found in active keys, search in unredeemed keys
    if (!keyObj) {
      const unredeemedKey = db.unredeemedKeys.find((k: any) => k.key.toUpperCase() === cleanLicense);
      if (unredeemedKey) {
        if (unredeemedKey.used) {
          return res.status(400).json({ success: false, message: 'This license key has already been redeemed.' });
        }
        return res.status(400).json({ 
          success: false, 
          message: 'License key is valid but has not been redeemed on the web panel yet. Go to your Web Dashboard to link it to a server first!' 
        });
      }
      return res.status(404).json({ success: false, message: 'Invalid license key. Check your Discord DM.' });
    }

    // 2. IP Lock Verification
    const registeredIp = keyObj.ip || '0.0.0.0';
    if (registeredIp !== '0.0.0.0' && registeredIp !== '' && registeredIp !== '127.0.0.1') {
      const normalizeIp = (ipStr: string) => {
        let clean = String(ipStr).replace('::ffff:', '');
        if (clean.includes(':')) {
          clean = clean.split(':')[0]; // remove port if present
        }
        return clean.trim();
      };

      const normRequest = normalizeIp(String(requestIp));
      const normRegistered = normalizeIp(registeredIp);

      if (normRequest !== normRegistered && normRequest !== '127.0.0.1' && normRequest !== 'localhost' && normRequest !== '::1') {
        console.warn(`[API VALIDATION] Blocked connection for license ${cleanLicense} due to IP Mismatch (Request IP: ${normRequest}, Registered IP: ${normRegistered})`);
        return res.status(403).json({ 
          success: false, 
          message: `IP Lock validation failed. Requesting server IP (${normRequest}) does not match registered IP (${normRegistered}).` 
        });
      }
    } else {
      // Auto-lock to requesting server's IP on first launch if IP was not locked
      const normalizeIp = (ipStr: string) => {
        let clean = String(ipStr).replace('::ffff:', '');
        if (clean.includes(':')) {
          clean = clean.split(':')[0];
        }
        return clean.trim();
      };
      const cleanReqIp = normalizeIp(String(requestIp));
      if (cleanReqIp && cleanReqIp !== '127.0.0.1' && cleanReqIp !== '::1' && cleanReqIp !== 'localhost') {
        keyObj.ip = cleanReqIp;
        // Also update IP in servers database if linked
        const srvIdx = db.servers.findIndex((s: any) => s.id === keyObj.linkedServer);
        if (srvIdx !== -1) {
          db.servers[srvIdx].ip = `${cleanReqIp}:30120`;
        }
        saveDatabase(db);
        console.log(`[API VALIDATION] Auto-locked License ${cleanLicense} to Server IP: ${cleanReqIp}`);
      }
    }

    // 3. Expiration Check
    const redeemedDate = keyObj.redeemedAt ? new Date(keyObj.redeemedAt) : new Date();
    const durationStr = keyObj.duration || '30 Days';
    
    if (durationStr !== 'Lifetime') {
      const days = parseInt(durationStr) || 30;
      const expirationMs = redeemedDate.getTime() + (days * 24 * 60 * 60 * 1000);
      if (Date.now() > expirationMs) {
        return res.status(402).json({ 
          success: false, 
          message: `License key has expired on ${new Date(expirationMs).toISOString().replace('T', ' ').slice(0, 16)}.` 
        });
      }
    }

    // 4. Successful validation: return dynamic anticheat config settings from the Web Dashboard!
    console.log(`[API VALIDATION] License ${cleanLicense} validated successfully for IP ${requestIp}`);
    
    // Add success log to the RCON console
    const logMsg = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toTimeString().slice(0, 8),
      type: 'success',
      message: `RCON: External server connected and authenticated [License: ${cleanLicense}, IP: ${requestIp}].`,
      serverId: keyObj.linkedServer
    };
    db.consoleLogs.push(logMsg);
    saveDatabase(db);

    const sId = String(keyObj.linkedServer || '');
    if (!db.configs) db.configs = {};
    const serverConfig = db.configs[sId] || db.config || INITIAL_CONFIG;
    const serverBans = (db.bans || []).filter((b: any) => b.serverId === sId);
    const serverAdmins = (db.admins || []).filter((a: any) => a.serverId === sId);

    return res.json({
      success: true,
      message: 'License is active and valid!',
      license: {
        key: keyObj.key,
        tier: keyObj.tier,
        duration: keyObj.duration,
        expiresAt: durationStr === 'Lifetime' ? 'Never' : new Date(redeemedDate.getTime() + (parseInt(durationStr) || 30) * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 16)
      },
      // Send active settings directly so server-side anticheat can initialize dynamically!
      config: serverConfig,
      bans: serverBans,
      admins: serverAdmins
    });
  });

  // --- FIVE M REAL-TIME BRIDGE ENDPOINTS ---

  // Get active players from the connected server
  app.get('/api/players', (req, res) => {
    const { serverId } = req.query;
    db = loadDatabase();
    let players = db.activePlayers || [];
    if (serverId) {
      players = players.filter((p: any) => p.serverId === serverId);
    }
    res.json({ success: true, players });
  });

  // Kick an active player
  app.post('/api/players/kick', (req, res) => {
    const { id, reason, serverId } = req.body;
    db = loadDatabase();
    const player = db.activePlayers.find((p: any) => p.id === id);
    if (player) {
      const finalServerId = serverId || player.serverId;
      // Find which keys/servers exist to queue the kick command
      db.keys.forEach((k: any) => {
        if (k.linkedServer === finalServerId) {
          const license = k.key.toUpperCase();
          if (!pendingCommands[license]) pendingCommands[license] = [];
          pendingCommands[license].push({
            id: 'cmd-' + Date.now(),
            action: 'kick',
            target: id,
            reason: reason || 'Kicked from Web Panel'
          });
        }
      });
      // Remove player from active list
      db.activePlayers = db.activePlayers.filter((p: any) => p.id !== id);
      // Log to console
      db.consoleLogs.push({
        id: 'log-' + Date.now(),
        timestamp: new Date().toTimeString().slice(0, 8),
        type: 'warning',
        message: `RCON: Kicked player [${player.name}] (ID: ${id}) for: "${reason || 'No reason'}"`,
        serverId: finalServerId
      });
      saveDatabase(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Player not found' });
    }
  });

  // Ban an active player
  app.post('/api/players/ban', (req, res) => {
    const { player, reason, serverId } = req.body;
    db = loadDatabase();
    
    const finalServerId = serverId || player.serverId;
    
    // Queue ban for server-specific license (the FiveM server will receive it on heartbeat)
    db.keys.forEach((k: any) => {
       if (k.linkedServer === finalServerId) {
         const license = k.key.toUpperCase();
         if (!pendingCommands[license]) pendingCommands[license] = [];
         pendingCommands[license].push({
           id: 'cmd-' + Date.now(),
           action: 'ban',
           target: player.id,
           reason: reason || 'Banned from Web Panel'
         });
       }
    });

    // Append to bans list
    const newBan = {
      id: 'ban-' + Date.now(),
      playerName: player.name,
      steamId: player.steamId || 'N/A',
      discordId: player.discord || 'N/A',
      reason: reason || 'Banned from Web Panel',
      bannedBy: 'Console Admin',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      active: true,
      serverId: finalServerId
    };
    db.bans.unshift(newBan);

    // Remove player from active list
    db.activePlayers = db.activePlayers.filter((p: any) => p.id !== player.id);

    // Log to console
    db.consoleLogs.push({
      id: 'log-' + Date.now(),
      timestamp: new Date().toTimeString().slice(0, 8),
      type: 'error',
      message: `RCON: Permanently banned player [${player.name}] (Reason: ${reason || 'No reason'})`,
      serverId: finalServerId
    });

    saveDatabase(db);
    res.json({ success: true, ban: newBan });
  });

  // Heartbeat endpoint polled by the FiveM resource
  app.post('/api/servers/heartbeat', (req, res) => {
    const { license, playersCount, activePlayers } = req.body;
    if (!license) {
      return res.status(400).json({ success: false, message: 'License key is required.' });
    }
    db = loadDatabase();
    const cleanLicense = license.trim().toUpperCase();
    
    // Find key to identify which server is sending the heartbeat
    const keyObj = db.keys.find((k: any) => k.key.toUpperCase() === cleanLicense);
    if (!keyObj) {
      return res.status(404).json({ success: false, message: 'Invalid license key.' });
    }

    const serverId = keyObj.linkedServer;
    const srvIdx = db.servers.findIndex((s: any) => s.id === serverId);
    if (srvIdx !== -1) {
      db.servers[srvIdx].status = 'online';
      db.servers[srvIdx].playersCount = playersCount || 0;
      db.servers[srvIdx].lastSeen = Date.now();
    }

    if (Array.isArray(activePlayers)) {
      const taggedPlayers = activePlayers.map((p: any) => ({ ...p, serverId }));
      db.activePlayers = [
        ...(db.activePlayers || []).filter((p: any) => p.serverId !== serverId),
        ...taggedPlayers
      ];
    }

    const commands = pendingCommands[cleanLicense] || [];
    pendingCommands[cleanLicense] = [];

    saveDatabase(db);
    res.json({ success: true, commands });
  });

  // Get whitelisted admins
  app.get('/api/admins', (req, res) => {
    const { serverId } = req.query;
    db = loadDatabase();
    let admins = db.admins || [];
    if (serverId) {
      admins = admins.filter((a: any) => a.serverId === serverId);
    }
    res.json({ success: true, admins });
  });

  // Add whitelisted admin
  app.post('/api/admins', (req, res) => {
    const { name, steamHex, role, serverId } = req.body;
    if (!name || !steamHex) {
      return res.status(400).json({ success: false, message: 'Name and SteamHex are required.' });
    }
    db = loadDatabase();
    const newAdmin = {
      id: String(Date.now()),
      name,
      steamHex,
      role: role || 'Admin',
      addedAt: new Date().toISOString().split('T')[0],
      serverId: serverId || ''
    };
    if (!db.admins) db.admins = [];
    db.admins.push(newAdmin);

    // Push reload admins command to FiveM client
    db.keys.forEach((k: any) => {
      if (k.linkedServer === serverId) {
        const license = k.key.toUpperCase();
        if (!pendingCommands[license]) pendingCommands[license] = [];
        pendingCommands[license].push({
          id: 'cmd-' + Date.now(),
          action: 'sync_admins',
          admins: db.admins.filter((a: any) => a.serverId === serverId)
        });
      }
    });

    saveDatabase(db);
    res.json({ success: true, admin: newAdmin });
  });

  // Delete whitelisted admin
  app.delete('/api/admins/:id', (req, res) => {
    const { id } = req.params;
    db = loadDatabase();
    if (db.admins) {
      const adminToDelete = db.admins.find((a: any) => a.id === id);
      const serverId = adminToDelete ? adminToDelete.serverId : '';
      
      db.admins = db.admins.filter((a: any) => a.id !== id);

      // Push reload admins command to FiveM client
      db.keys.forEach((k: any) => {
        if (k.linkedServer === serverId) {
          const license = k.key.toUpperCase();
          if (!pendingCommands[license]) pendingCommands[license] = [];
          pendingCommands[license].push({
            id: 'cmd-' + Date.now(),
            action: 'sync_admins',
            admins: db.admins.filter((a: any) => a.serverId === serverId)
          });
        }
      });

      saveDatabase(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Admins list is empty' });
    }
  });

  // --- REGULAR API ENDPOINTS (USED BY THE FRONTEND WEB DASHBOARD) ---

  // --- AUTHENTICATION ENDPOINTS ---

  // Register user
  app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    db = loadDatabase();
    if (!db.users) db.users = [];

    const existingUser = db.users.find((u: any) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This username is already taken.' });
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      username: username.trim(),
      password: password,
      role: 'User',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Seed a free welcome key they can redeem immediately!
    const testUnredeemedKey = {
      key: `VAC-${newUser.username.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-KEY`,
      tier: 'Premium',
      duration: '30 Days',
      used: false,
      createdBy: 'Auto-seeded for New Account',
      createdAt: new Date().toISOString()
    };
    db.unredeemedKeys.push(testUnredeemedKey);

    saveDatabase(db);

    return res.json({ 
      success: true, 
      message: 'Registration completed successfully!', 
      user: { id: newUser.id, username: newUser.username, role: newUser.role } 
    });
  });

  // Login user
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db = loadDatabase();
    if (!db.users) db.users = [];

    const user = db.users.find(
      (u: any) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (user) {
      return res.json({
        success: true,
        user: { id: user.id, username: user.username, role: user.role, discordId: user.discordId, avatarUrl: user.avatarUrl }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials or user not found.' });
  });

  // --- REAL DISCORD OAUTH2 ENDPOINTS ---

  // Generate real Discord OAuth URL
  app.get('/api/auth/discord-url', (req, res) => {
    const client_id = process.env.DISCORD_CLIENT_ID;
    const appUrl = getAppUrl(req);
    const redirectUri = `${appUrl}/auth/callback`;
    
    // Fallback: If client id is not configured, we'll let the frontend know so it can show a setup notice
    if (!client_id || client_id.trim() === '') {
      return res.json({ 
        success: false, 
        error: 'missing_credentials',
        redirectUri,
        message: 'Credenziali Discord non configurate. Per favore aggiungi DISCORD_CLIENT_ID nel file .env o nella scheda Impostazioni.'
      });
    }

    const params = new URLSearchParams({
      client_id: client_id,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email guilds.join gdm.join',
      prompt: 'consent'
    });

    res.json({ 
      success: true, 
      url: `https://discord.com/oauth2/authorize?${params.toString()}` 
    });
  });

  // Real Discord OAuth callback
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error) {
      return res.send(`
        <html>
          <body style="background: #040306; color: #f4f4f5; font-family: sans-serif; text-align: center; padding: 40px; display: flex; align-items: center; justify-content: center; height: 80vh; margin: 0;">
            <div style="background: #0a090e; border: 1px solid #e11d48; padding: 30px; border-radius: 16px; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <h2 style="color: #ef4444; margin: 0 0 15px;">Autenticazione Fallita</h2>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">${error_description || error}</p>
              <button onclick="window.close()" style="background: #e11d48; border: none; color: white; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: background 0.2s;">Chiudi</button>
            </div>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.send(`
        <html>
          <body style="background: #040306; color: #f4f4f5; font-family: sans-serif; text-align: center; padding: 40px; display: flex; align-items: center; justify-content: center; height: 80vh; margin: 0;">
            <div style="background: #0a090e; border: 1px solid #e11d48; padding: 30px; border-radius: 16px; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <h2 style="color: #ef4444; margin: 0 0 15px;">Codice Mancante</h2>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">Nessun codice di autorizzazione è stato fornito da Discord.</p>
              <button onclick="window.close()" style="background: #e11d48; border: none; color: white; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Chiudi</button>
            </div>
          </body>
        </html>
      `);
    }

    try {
      const client_id = process.env.DISCORD_CLIENT_ID;
      const client_secret = process.env.DISCORD_CLIENT_SECRET;
      const appUrl = getAppUrl(req);
      const redirectUri = `${appUrl}/auth/callback`;

      if (!client_id || !client_secret) {
        throw new Error("Credenziali Discord non configurate sul server. Inserisci DISCORD_CLIENT_ID e DISCORD_CLIENT_SECRET.");
      }

      // Exchange code for token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id,
          client_secret,
          grant_type: 'authorization_code',
          code: String(code),
          redirect_uri: redirectUri,
        }).toString()
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error('Discord token exchange failed:', errText);
        throw new Error("Lo scambio del codice di autenticazione con Discord è fallito.");
      }

      const tokenData: any = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get user profile details
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error("Impossibile recuperare i dati del tuo profilo da Discord.");
      }

      const userData: any = await userResponse.json();
      const discordId = userData.id;
      const username = userData.username;
      const avatarHash = userData.avatar;
      const avatarUrl = avatarHash 
        ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`
        : `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;

      // Register or login inside our database.json
      db = loadDatabase();
      if (!db.users) db.users = [];

      let user = db.users.find((u: any) => u.discordId === discordId);

      if (!user) {
        user = {
          id: 'usr-discord-' + Date.now(),
          username: username,
          discordId: discordId,
          avatarUrl: avatarUrl,
          role: 'User',
          createdAt: new Date().toISOString()
        };
        db.users.push(user);

        // Seed an unredeemed key
        const testUnredeemedKey = {
          key: `VAC-DSC-${username.substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-KEY`,
          tier: 'Premium',
          duration: '30 Days',
          used: false,
          createdBy: 'Discord Auth Gift',
          createdAt: new Date().toISOString()
        };
        db.unredeemedKeys.push(testUnredeemedKey);

        saveDatabase(db);
      } else {
        // Update user details if changed
        let updated = false;
        if (user.avatarUrl !== avatarUrl) {
          user.avatarUrl = avatarUrl;
          updated = true;
        }
        if (user.username !== username) {
          user.username = username;
          updated = true;
        }
        if (updated) {
          saveDatabase(db);
        }
      }

      // Success screen that logs user in via postMessage
      res.send(`
        <html>
          <body style="background: #040306; color: #f4f4f5; font-family: sans-serif; text-align: center; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; margin: 0;">
            <div style="background: #0a090e; border: 1px solid #3b82f6; padding: 35px; border-radius: 16px; max-width: 360px; box-shadow: 0 10px 25px rgba(0,0,0,0.6); text-align: center;">
              <div style="width: 70px; height: 70px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 2.5px solid #5865F2; box-shadow: 0 0 15px rgba(88,101,242,0.3);">
                <img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <h2 style="color: #4ade80; margin: 0 0 10px; font-size: 22px;">Accesso Eseguito!</h2>
              <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 25px; line-height: 1.4;">Benvenuto, <strong>${username}</strong>. Ti abbiamo connesso al portale di PowerAC con successo.</p>
              <div style="width: 24px; height: 24px; border: 3px solid #5865F2; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
              <span style="font-size: 11px; color: #52525b; font-family: monospace;">Chiusura finestra in corso...</span>
            </div>
            <style>
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_DISCORD_SUCCESS', 
                  user: ${JSON.stringify({ id: user.id, username: user.username, role: user.role, discordId: user.discordId, avatarUrl: user.avatarUrl })}
                }, '*');
                setTimeout(() => {
                  window.close();
                }, 1500);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);

    } catch (err: any) {
      console.error('Discord OAuth processing error:', err);
      res.send(`
        <html>
          <body style="background: #040306; color: #f4f4f5; font-family: sans-serif; text-align: center; padding: 40px; display: flex; align-items: center; justify-content: center; height: 80vh; margin: 0;">
            <div style="background: #0a090e; border: 1px solid #e11d48; padding: 30px; border-radius: 16px; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <h2 style="color: #ef4444; margin: 0 0 15px;">Errore Interno</h2>
              <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">${err.message || "Errore durante l'elaborazione dell'autenticazione Discord."}</p>
              <button onclick="window.close()" style="background: #e11d48; border: none; color: white; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Chiudi</button>
            </div>
          </body>
        </html>
      `);
    }
  });

  // Discord direct login/register simulation
  app.post('/api/auth/discord-login', (req, res) => {
    const { discordId, username, avatarUrl } = req.body;
    if (!discordId || !username) {
      return res.status(400).json({ success: false, message: 'Discord ID and Username are required.' });
    }

    db = loadDatabase();
    if (!db.users) db.users = [];

    let user = db.users.find((u: any) => u.discordId === discordId);

    if (!user) {
      user = {
        id: 'usr-discord-' + Date.now(),
        username: username,
        discordId: discordId,
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        role: 'User',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);

      // Seed an unredeemed key
      const testUnredeemedKey = {
        key: `VAC-DSC-${username.substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-KEY`,
        tier: 'Exclusive',
        duration: 'Lifetime',
        used: false,
        createdBy: 'Discord Welcome Gift',
        createdAt: new Date().toISOString()
      };
      db.unredeemedKeys.push(testUnredeemedKey);

      saveDatabase(db);
    }

    return res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, discordId: user.discordId, avatarUrl: user.avatarUrl }
    });
  });

  // Get keys (redeemed keys + unredeemed ones) - can filter by userId
  app.get('/api/keys', (req, res) => {
    const { userId } = req.query;
    db = loadDatabase();

    let filteredKeys = db.keys;
    if (userId) {
      filteredKeys = db.keys.filter((k: any) => k.userId === userId);
    }

    res.json({
      success: true,
      keys: filteredKeys,
      unredeemedKeys: db.unredeemedKeys
    });
  });

  // Redeem key routine (links it to a specific server)
  app.post('/api/keys/redeem', (req, res) => {
    const { keyInput, serverId, userId } = req.body;
    
    if (!keyInput || !serverId) {
      return res.status(400).json({ success: false, message: 'License key input and server ID are required.' });
    }

    db = loadDatabase();

    const cleanInput = keyInput.trim().toUpperCase();

    // 1. Check if key is already redeemed
    const isAlreadyRedeemed = db.keys.some((k: any) => k.key.toUpperCase() === cleanInput);
    if (isAlreadyRedeemed) {
      return res.status(400).json({ success: false, message: 'This license key has already been redeemed.' });
    }

    // Check if target server exists
    const serverObj = db.servers.find((s: any) => s.id === serverId);
    if (!serverObj) {
      return res.status(404).json({ success: false, message: 'The specified server destination ID was not found.' });
    }

    // 2. See if the key is in our unredeemedKeys generated by the Discord bot
    const unredeemedIndex = db.unredeemedKeys.findIndex((k: any) => k.key.toUpperCase() === cleanInput && !k.used);

    let finalTier = 'Free';
    let finalDuration = '30 Days';
    let botUserId = '';
    let botCreatedBy = '';
    let botIp = '';
    let botUsedTimestamp = Math.floor(Date.now() / 1000);

    if (unredeemedIndex !== -1) {
      // Key is valid and was generated by Discord Bot!
      const keyObj = db.unredeemedKeys[unredeemedIndex];
      finalTier = keyObj.tier;
      finalDuration = keyObj.duration;
      botUserId = keyObj.userid || '';
      botCreatedBy = keyObj.createdBy || 'Discord Bot';
      botIp = keyObj.ip || '0.0.0.0';
      botUsedTimestamp = keyObj.usedTimestamp || Math.floor(Date.now() / 1000);
      
      // Mark as used in database
      db.unredeemedKeys[unredeemedIndex].used = true;
    } else {
      // Auto-import valid VAC- keys matching the Discord bot's key template format (VAC- followed by 20 uppercase alphanumeric chars)
      const isDiscordKeyFormat = /^VAC-[A-Z0-9]{20}$/i.test(cleanInput);
      
      if (isDiscordKeyFormat) {
        finalTier = 'Premium'; // Default imported bot keys to Premium
        finalDuration = '30 Days'; // Default duration
        botCreatedBy = 'Discord Bot (Auto-imported)';
      } else if (cleanInput.startsWith('TBX-') || cleanInput.includes('PREM')) {
        finalTier = 'Premium';
        finalDuration = '30 Days';
      } else if (cleanInput.includes('EXCL') || cleanInput.includes('LIFETIME')) {
        finalTier = 'Exclusive';
        finalDuration = 'Lifetime';
      } else {
        // Not generated by bot and not a mock tebex key
        return res.status(400).json({ 
          success: false, 
          message: 'The entered key or order number is invalid. Generate a valid key via the Discord Bot first!' 
        });
      }
    }

    // Generate simulated license key
    const redeemedKey = {
      id: 'key-' + Date.now(),
      key: cleanInput.startsWith('TBX-') ? `PAC-PREMIUM-${cleanInput.replace('TBX-', '')}-ZGV6` : cleanInput,
      tier: finalTier,
      duration: finalDuration,
      linkedServer: serverId,
      redeemedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userid: botUserId,
      userId: userId || '', // Track owner account
      createdBy: botCreatedBy,
      ip: botIp,
      usedTimestamp: botUsedTimestamp
    };

    db.keys.unshift(redeemedKey);

    // Add log to RCON console logs
    const logMsg = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toTimeString().slice(0, 8),
      type: 'success',
      message: `RCON: License Key verified & linked [Tier: ${finalTier}] to Server ${serverObj.name}.`
    };
    db.consoleLogs.push(logMsg);

    saveDatabase(db);

    return res.json({
      success: true,
      message: `Successfully redeemed & linked key to ${serverObj.name}!`,
      key: redeemedKey
    });
  });

  // Create an unredeemed key manually from the web panel
  app.post('/api/keys/unredeemed', (req, res) => {
    const { key, tier, duration } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Key is required' });
    }

    db = loadDatabase();
    
    // Check if key is already in redeemed keys or unredeemed keys
    const cleanKey = key.trim().toUpperCase();
    const isAlreadyRedeemed = db.keys.some((k: any) => k.key.toUpperCase() === cleanKey);
    const isAlreadyUnredeemed = db.unredeemedKeys.some((k: any) => k.key.toUpperCase() === cleanKey);

    if (isAlreadyRedeemed || isAlreadyUnredeemed) {
      return res.status(400).json({ success: false, message: 'This key already exists in the database.' });
    }

    const newKey = {
      key: cleanKey,
      tier: tier || 'Premium',
      duration: duration || '30 Days',
      used: false,
      createdBy: 'Manual Web Panel Creation',
      createdAt: new Date().toISOString()
    };

    db.unredeemedKeys.push(newKey);
    saveDatabase(db);

    res.json({ success: true, key: newKey });
  });

  // Generate a Free Lifetime Key for a specific user (limit max 1 per user)
  app.post('/api/keys/generate-free-lifetime', (req, res) => {
    const { userId, username } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'ID utente richiesto.' });
    }

    db = loadDatabase();

    // Check if the user already has a Free key in redeemed keys
    const hasRedeemedFreeKey = db.keys.some((k: any) => k.userId === userId && k.tier === 'Free');
    
    // Check if there's already an unredeemed Free key generated by this user
    const hasUnredeemedFreeKey = db.unredeemedKeys.some((k: any) => k.createdBy === `User-${userId}` && k.tier === 'Free' && !k.used);

    if (hasRedeemedFreeKey || hasUnredeemedFreeKey) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hai già generato la tua chiave Free Lifetime (massimo 1 per utente).' 
      });
    }

    // Generate a unique VAC key of Free tier and Lifetime duration
    const userSeed = (username || userId).substring(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'USR';
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const keyStr = `VAC-FREE-${userSeed}-${randPart}-LIFETIME`;

    const newFreeKey = {
      key: keyStr,
      tier: 'Free',
      duration: 'Lifetime',
      used: false,
      createdBy: `User-${userId}`,
      createdAt: new Date().toISOString()
    };

    db.unredeemedKeys.push(newFreeKey);
    saveDatabase(db);

    res.json({ 
      success: true, 
      message: 'Chiave Free Lifetime creata con successo!', 
      key: newFreeKey 
    });
  });


  // Delete an unredeemed key
  app.delete('/api/keys/unredeemed/:key', (req, res) => {
    const { key } = req.params;
    db = loadDatabase();
    
    const cleanKey = key.trim().toUpperCase();
    db.unredeemedKeys = db.unredeemedKeys.filter((k: any) => k.key.toUpperCase() !== cleanKey);
    saveDatabase(db);
    
    res.json({ success: true });
  });

  // Update IP for an active redeemed key (called from the web panel)
  app.post('/api/keys/setip', (req, res) => {
    const { key, ip } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Key is required' });
    }
    
    db = loadDatabase();
    const cleanKey = key.trim().toUpperCase();
    const keyIdx = db.keys.findIndex((k: any) => k.key.toUpperCase() === cleanKey);
    
    if (keyIdx !== -1) {
      db.keys[keyIdx].ip = ip || '0.0.0.0';
      
      // Also update the linked server's IP if it exists
      const serverId = db.keys[keyIdx].linkedServer;
      const srvIdx = db.servers.findIndex((s: any) => s.id === serverId);
      if (srvIdx !== -1) {
        db.servers[srvIdx].ip = ip ? `${ip}:30120` : '0.0.0.0:30120';
      }
      
      saveDatabase(db);
      return res.json({ success: true, message: 'IP updated successfully!', key: db.keys[keyIdx], servers: db.servers });
    }
    
    return res.status(404).json({ success: false, message: 'License key not found.' });
  });

  // Get servers
  app.get('/api/servers', (req, res) => {
    const { userId } = req.query;
    db = loadDatabase();
    
    let filteredServers = db.servers;
    if (userId) {
      filteredServers = db.servers.filter((s: any) => s.userId === userId);
    }
    
    res.json({ success: true, servers: filteredServers });
  });

  // Add Server
  app.post('/api/servers', (req, res) => {
    const { name, ip, userId } = req.body;
    if (!name || !ip) {
      return res.status(400).json({ success: false, message: 'Name and IP are required.' });
    }

    db = loadDatabase();
    const newServer = {
      id: 'srv-' + Date.now(),
      userId: userId || '',
      name,
      ip,
      status: 'offline',
      playersCount: 0,
      maxPlayers: 128
    };

    db.servers.push(newServer);
    saveDatabase(db);

    return res.json({ success: true, server: newServer });
  });

  // Get bans
  app.get('/api/bans', (req, res) => {
    const { serverId } = req.query;
    db = loadDatabase();
    let bans = db.bans || [];
    if (serverId) {
      bans = bans.filter((b: any) => b.serverId === serverId);
    }
    res.json({ success: true, bans });
  });

  // Add Ban
  app.post('/api/bans', (req, res) => {
    const { playerName, steamId, discordId, reason, bannedBy, serverId } = req.body;
    db = loadDatabase();

    const newBan = {
      id: 'ban-' + Date.now(),
      playerName,
      steamId,
      discordId,
      reason,
      bannedBy,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      active: true,
      serverId: serverId || ''
    };

    db.bans.unshift(newBan);
    saveDatabase(db);

    return res.json({ success: true, ban: newBan });
  });

  // Toggle Ban Status
  app.post('/api/bans/toggle', (req, res) => {
    const { id } = req.body;
    db = loadDatabase();

    db.bans = db.bans.map((b: any) => b.id === id ? { ...b, active: !b.active } : b);
    saveDatabase(db);

    return res.json({ success: true });
  });

  // Get config
  app.get('/api/config', (req, res) => {
    const { serverId } = req.query;
    db = loadDatabase();
    if (!db.configs) db.configs = {};
    
    const sId = String(serverId || '');
    let config = db.configs[sId];
    if (!config) {
      config = db.config || INITIAL_CONFIG;
      if (sId) {
        db.configs[sId] = { ...config };
        saveDatabase(db);
      }
    }
    res.json({ success: true, config });
  });

  // Update config
  app.post('/api/config', (req, res) => {
    const { updatedConfig, serverId } = req.body;
    db = loadDatabase();
    if (!db.configs) db.configs = {};
    
    const sId = String(serverId || '');
    if (sId) {
      db.configs[sId] = updatedConfig;
    } else {
      db.config = updatedConfig;
    }
    saveDatabase(db);
    res.json({ success: true });
  });

  // Get Console logs
  app.get('/api/console', (req, res) => {
    const { serverId } = req.query;
    db = loadDatabase();
    let logs = db.consoleLogs || [];
    if (serverId) {
      logs = logs.filter((l: any) => l.serverId === serverId);
    }
    res.json({ success: true, logs });
  });

  // Add Console Log
  app.post('/api/console', (req, res) => {
    const { message, type, serverId } = req.body;
    db = loadDatabase();

    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toTimeString().slice(0, 8),
      type: type || 'info',
      message,
      serverId: serverId || ''
    };

    db.consoleLogs.push(newLog);
    saveDatabase(db);

    res.json({ success: true, log: newLog });
  });

  // Simulate Anticheat Detection (Sandbox Test)
  app.post('/api/sandbox/simulate', (req, res) => {
    const { playerName, steamId, discord, cheatType, reason, configUsed } = req.body;
    db = loadDatabase();

    const timestamp = new Date().toTimeString().slice(0, 8);
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const logsAdded = [
      {
        id: 'sandbox-l1-' + Date.now(),
        timestamp,
        type: 'info' as const,
        message: `[Sandbox] Simulating cheat attack vector: "${cheatType}" on player [${playerName}]`
      },
      {
        id: 'sandbox-l2-' + Date.now(),
        timestamp,
        type: 'warning' as const,
        message: `[PowerAC Guard] Flagged event: "${reason}" from identifier: ${steamId}`
      }
    ];

    let actionTaken = 'Logged Flag';
    let isBanned = false;

    // Based on whether the specific cheat is a ban trigger and if simulation was bypass-free
    const isBanTrigger = !reason.includes('Bypassed disabled policy');
    const isWarningOnly = cheatType.toLowerCase().includes('ping spike');

    if (isBanTrigger && !isWarningOnly) {
      isBanned = true;
      actionTaken = 'Permanently Banned';

      const newBan = {
        id: 'ban-sim-' + Date.now(),
        playerName,
        steamId: steamId || 'steam:11000014aa2212a',
        discordId: discord || 'discord:529241940984852480',
        reason: `[Simulated Detection] ${cheatType} detected`,
        bannedBy: 'PowerAC Guard (Sandbox)',
        date: dateStr,
        active: true
      };
      
      if (!db.bans) db.bans = [];
      db.bans.unshift(newBan);

      // Remove from active players
      db.activePlayers = (db.activePlayers || []).filter((p: any) => p.name !== playerName);

      logsAdded.push({
        id: 'sandbox-l3-' + Date.now(),
        timestamp,
        type: 'error' as const,
        message: `[PowerAC Guard] ACTION TAKEN: Player ${playerName} has been permanently banned.`
      });
    } else if (isWarningOnly) {
      logsAdded.push({
        id: 'sandbox-l3-' + Date.now(),
        timestamp,
        type: 'warning' as const,
        message: `[PowerAC Guard] Connection lag spike logged for ${playerName}.`
      });
    } else {
      logsAdded.push({
        id: 'sandbox-l3-' + Date.now(),
        timestamp,
        type: 'info' as const,
        message: `[PowerAC Guard] Alert logged (Policy bypassed/disabled in settings).`
      });
    }

    db.consoleLogs.push(...logsAdded);
    saveDatabase(db);

    res.json({
      success: true,
      actionTaken,
      isBanned,
      logs: logsAdded,
      bans: db.bans,
      activePlayers: db.activePlayers
    });
  });

  // Vite development middleware OR static files serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
